import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecognitionService {
  private readonly logger = new Logger(RecognitionService.name);

  // storing training photos in memory per pet until all batches arrive
  private trainingPhotoBuffers = new Map<number, string[]>();

  constructor(private prisma: PrismaService) {}

  async storeTrainingPhotos(petId: number, photos: string[]) {
    const existing = this.trainingPhotoBuffers.get(petId) ?? [];
    const updated = [...existing, ...photos];
    this.trainingPhotoBuffers.set(petId, updated);
    this.logger.log(
      `Stored ${photos.length} photos for pet ${petId}. ` +
      `Total: ${updated.length}`,
    );
  }

  async trainModel(petId: number) {
    const photos = this.trainingPhotoBuffers.get(petId) ?? [];
    this.logger.log(
      `Training model for pet ${petId} with ${photos.length} photos. ` +
      `(Model training implementation pending)`,
    );
    this.trainingPhotoBuffers.delete(petId);
  }

  async recognizePet(
    deviceId: string,
    imageBase64: string,
  ): Promise<{ catId: number | null; confidence: number; shouldFeed: boolean }> {
    this.logger.log(`Running recognition for device ${deviceId}.`);
    return { catId: null, confidence: 0, shouldFeed: false };
  }
}