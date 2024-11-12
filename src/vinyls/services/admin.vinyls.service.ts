import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVinylDto, UpdateVinylDto } from '../dto';
import { PrismaService } from '../../prisma/prisma.service';
import { VinylResponseDto } from '../dto';
import { UploadService } from '../../upload/service';

@Injectable()
export class AdminVinylsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}
  async create({
    name,
    authorName,
    description,
    price,
  }: CreateVinylDto): Promise<{ message: string }> {
    await this.prisma.vinyl.create({
      data: { name, authorName, description, price },
    });
    return { message: 'Vinyl created successfully' };
  }

  async getVinylById({
    vinylId,
  }: {
    vinylId: string;
  }): Promise<VinylResponseDto> {
    const vinyl = await this.prisma.vinyl.findUnique({
      where: { id: vinylId },
    });
    if (!vinyl) {
      throw new NotFoundException('Vinyl not found');
    }
    return vinyl;
  }

  async update(
    {
      vinylId,
    }: {
      vinylId: string;
    },
    updateVinylDto: UpdateVinylDto,
  ): Promise<{ message: string }> {
    const vinyl = await this.prisma.vinyl.findUnique({
      where: { id: vinylId },
    });

    if (!vinyl) throw new NotFoundException('Vinyl not found');

    if (updateVinylDto.coverUrl && vinyl.coverUrl) {
      await this.uploadService.delete({ fileUrl: vinyl.coverUrl });
    }

    await this.prisma.vinyl.update({
      where: { id: vinylId },
      data: updateVinylDto,
    });
    return { message: 'Vinyl updated successfully' };
  }

  async remove({ vinylId }: { vinylId: string }): Promise<void> {
    const vinyl = await this.prisma.vinyl.findUnique({
      where: { id: vinylId },
    });

    if (!vinyl) throw new NotFoundException('Vinyl not found');

    if (vinyl.coverUrl) {
      await this.uploadService.delete({ fileUrl: vinyl.coverUrl });
    }

    await this.prisma.vinyl.delete({ where: { id: vinylId } });
  }

  async uploadVinylImage({
    vinylId,
    fileName,
    file,
  }): Promise<{ message: string }> {
    const coverUrl = await this.uploadService.upload({ fileName, file });

    await this.update({ vinylId }, { coverUrl });
    return { message: 'Image uploaded successfully!' };
  }
}
