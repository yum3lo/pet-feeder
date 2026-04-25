import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as path from 'path';
import * as fs from 'fs';
import { spawn } from 'child_process';
import * as base64 from 'base64-js';

@Injectable()
export class RecognitionService {
  private readonly logger = new Logger(RecognitionService.name);

  private readonly modelsDir: string;
  private readonly photosDir: string;
  private readonly pythonScriptsDir: string;

  // storing training photos in memory per pet until all batches arrive
  // key: userId, Value: { petId -> photos[] }
  private trainingBuffers = new Map<number, Map<number, string[]>>();

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    this.modelsDir = path.join(process.cwd(), 'models');
    this.photosDir = path.join(process.cwd(), 'photos');
    this.pythonScriptsDir = path.join(
      process.cwd(), 'src', 'recognition', 'python'
    );

    fs.mkdirSync(this.modelsDir, { recursive: true });
    fs.mkdirSync(this.photosDir, { recursive: true });
  }

  async storeTrainingPhotos(
    petId: number,
    photos: string[],
    batchIndex: number,
    totalBatches: number,
  ) {
    const pet = await this.prisma.pet.findUnique({
      where: { id: petId },
      select: { userId: true },
    });
    if (!pet) {
      this.logger.warn(`Pet ${petId} not found.`);
      return;
    }

    const userId = pet.userId;

    if (!this.trainingBuffers.has(userId)) {
      this.trainingBuffers.set(userId, new Map());
    }
    const userBuffer = this.trainingBuffers.get(userId)!;

    // initializing buffer for this pet
    const existing = userBuffer.get(petId) ?? [];
    const updated = [...existing, ...photos];
    userBuffer.set(petId, updated);

    this.logger.log(
      `Stored batch ${batchIndex + 1}/${totalBatches} for pet ${petId}. ` +
      `Total photos for this pet: ${updated.length}`,
    );

    // if last batch for this pet, saving to disk
    if (batchIndex + 1 === totalBatches) {
      await this.savePhotosToDisk(userId, petId, updated);
    }
  }

  // saving base64 photos to disk as JPEG files
  private async savePhotosToDisk(
    userId: number,
    petId: number,
    photos: string[],
  ) {
    const petDir = path.join(
      this.photosDir,
      `user_${userId}`,
      `pet_${petId}`,
    );
    fs.mkdirSync(petDir, { recursive: true });

    // clearing existing photos for this pet before saving new ones
    fs.readdirSync(petDir).forEach((f) =>
      fs.unlinkSync(path.join(petDir, f))
    );

    for (let i = 0; i < photos.length; i++) {
      const buffer = Buffer.from(photos[i], 'base64');
      fs.writeFileSync(path.join(petDir, `photo_${i}.jpg`), buffer);
    }

    this.logger.log(
      `Saved ${photos.length} photos for pet ${petId} (user ${userId}).`
    );
  }

  // training model for a user -> called after all pet photos are received
  async trainModel(userId: number): Promise<{
    success: boolean;
    accuracy?: number;
    error?: string;
  }> {
    this.logger.log(`Starting model training for user ${userId}...`);

    return new Promise((resolve) => {
      const process = spawn('python3', [
        path.join(this.pythonScriptsDir, 'train.py'),
        '--user_id', String(userId),
        '--models_dir', this.modelsDir,
        '--photos_dir', this.photosDir,
      ]);

      let output = '';
      let errorOutput = '';

      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      process.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      process.on('close', (code) => {
        if (errorOutput) {
          this.logger.debug(`Training stderr: ${errorOutput}`);
        }

        try {
          const jsonLine = output.trim().split('\n').reverse().find(l => l.trim().startsWith('{'));
          if (!jsonLine) throw new Error('No JSON line found');
          const result = JSON.parse(jsonLine);
          if (result.success) {
            this.logger.log(
              `Training complete for user ${userId}. ` +
              `Accuracy: ${(result.accuracy * 100).toFixed(1)}%`
            );
          } else {
            this.logger.warn(`Training failed: ${result.error}`);
          }
          this.trainingBuffers.delete(userId);
          resolve(result);
        } catch {
          this.logger.error(`Could not parse training output: ${output}`);
          resolve({ success: false, error: 'Training script error.' });
        }
      });
    });
  }

  // recognising a pet from a base64 image
  async recognizePet(
    deviceId: string,
    imageBase64: string,
  ): Promise<{
    petId: number | null;
    confidence: number;
    shouldFeed: boolean;
  }> {
    const device = await this.prisma.device.findUnique({
      where: { deviceId },
      select: { userId: true },
    });

    if (!device) {
      return { petId: null, confidence: 0, shouldFeed: false };
    }

    const userId = device.userId;
    const modelPath = path.join(
      this.modelsDir, `user_${userId}`, 'model.h5'
    );

    if (!fs.existsSync(modelPath)) {
      this.logger.debug(
        `No model for user ${userId} yet - skipping recognition.`
      );
      return { petId: null, confidence: 0, shouldFeed: false };
    }

    return new Promise((resolve) => {
      const proc = spawn('python3', [
        path.join(this.pythonScriptsDir, 'predict.py'),
        '--user_id', String(userId),
        '--models_dir', this.modelsDir,
      ], {
        env: { ...process.env, TF_CPP_MIN_LOG_LEVEL: '3', TF_ENABLE_ONEDNN_OPTS: '0' },
      });

      proc.stdin.write(imageBase64);
      proc.stdin.end();

      let output = '';
      let errorOutput = '';

      proc.stdout.on('data', (data) => {
        output += data.toString();
      });

      proc.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      proc.on('close', async () => {
        if (errorOutput) {
          this.logger.debug(`Predict stderr: ${errorOutput}`);
        }

        try {
          const jsonLine = output.trim().split('\n').reverse().find(l => l.trim().startsWith('{'));
          if (!jsonLine) throw new Error('No JSON line found');
          const result = JSON.parse(jsonLine);

          if (!result.success || !result.petId) {
            resolve({ petId: null, confidence: result.confidence ?? 0, shouldFeed: false });
            return;
          }

          // petId from the model is stored as a string like "5"
          const petId = parseInt(result.petId, 10);
          const shouldFeed = await this.checkShouldFeed(petId);

          resolve({
            petId: petId,
            confidence: result.confidence,
            shouldFeed,
          });
        } catch {
          this.logger.error(`Could not parse predict output: ${output}`);
          resolve({ petId: null, confidence: 0, shouldFeed: false });
        }
      });
    });
  }

  private async checkShouldFeed(petId: number): Promise<boolean> {
    const anyActiveSchedule = await this.prisma.feedingSchedule.findFirst({
      where: { petId, isActive: true },
    });
    return !anyActiveSchedule;
  }
}