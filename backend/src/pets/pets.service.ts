import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetsService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async create(userId: number, dto: CreatePetDto) {
    return this.prisma.pet.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAllByUser(userId: number) {
    return this.prisma.pet.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number) {
    const pet = await this.prisma.pet.findUnique({ where: { id } });
    if (!pet) throw new NotFoundException('Pet not found.');
    if (pet.userId !== userId) throw new ForbiddenException('Access denied.');
    return pet;
  }

  async update(id: number, userId: number, dto: UpdatePetDto) {
    await this.findOne(id, userId); // verifies ownership
    return this.prisma.pet.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);
    await this.prisma.pet.delete({ where: { id } });
    return { message: 'Pet deleted successfully.' };
  }

  async uploadImage(id: number, userId: number, fileBuffer: Buffer) {
    const pet = await this.findOne(id, userId);

    // deleting old image from Cloudinary if one exists
    if (pet.imageUrl) {
      const publicId = this.extractPublicId(pet.imageUrl);
      if (publicId) await this.cloudinary.deleteImage(publicId);
    }

    const result = await this.cloudinary.uploadImage(fileBuffer, 'pet-profiles');

    return this.prisma.pet.update({
      where: { id },
      data: { imageUrl: result.secure_url },
    });
  }

  private extractPublicId(imageUrl: string): string | null {
    // Cloudinary URLs look like:
    // https://res.cloudinary.com/cloud/image/upload/v123/pet-profiles/abc123.jpg
    try {
      const parts = imageUrl.split('/');
      const filename = parts[parts.length - 1].split('.')[0];
      const folder = parts[parts.length - 2];
      return `${folder}/${filename}`;
    } catch {
      return null;
    }
  }
}