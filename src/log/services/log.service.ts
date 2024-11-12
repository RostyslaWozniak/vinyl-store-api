import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryParams } from '../../types';
import { LogEntryDto, LogResponseDto } from '../dto';

@Injectable()
export class LogService {
  constructor(private readonly prisma: PrismaService) {}

  async getLogs({
    page,
    limit,
    search,
    sort,
  }: QueryParams): Promise<LogResponseDto[]> {
    try {
      return await this.prisma.systemLog.findMany({
        // sort
        orderBy: sort.map(({ field, by }) => ({
          [field]: by,
        })),
        // limit
        take: limit,
        // page
        skip: (page - 1) * limit,
        // search
        where: {
          AND: search.map(({ field, value }) => ({
            [field]: {
              contains: value,
              mode: 'insensitive',
            },
          })),
        },
      });
    } catch (err) {
      if (err instanceof PrismaClientValidationError) {
        throw new NotFoundException();
      }
      throw new InternalServerErrorException();
    }
  }

  async info(logInfo: Omit<LogEntryDto, 'level'>): Promise<void> {
    await this.log({ level: 'INFO', ...logInfo });
  }

  async warn(logInfo: Omit<LogEntryDto, 'level'>): Promise<void> {
    await this.log({ level: 'WARN', ...logInfo });
  }

  async error(logInfo: Omit<LogEntryDto, 'level'>): Promise<void> {
    await this.log({ level: 'ERROR', ...logInfo });
  }

  private async log({
    level,
    entity,
    statusCode,
    method,
    message,
  }: LogEntryDto): Promise<void> {
    const isDevEnvironment = process.env.NODE_ENV === 'development';

    // Log to the database
    await this.prisma.systemLog.create({
      data: {
        level,
        entity,
        statusCode: String(statusCode),
        method,
        message,
      },
    });

    if (isDevEnvironment) {
      const logOutput = `[${level}] ${method} ${statusCode} ${entity}: ${message}`;
      console[level.toLocaleLowerCase()](logOutput);
    }
  }
}
