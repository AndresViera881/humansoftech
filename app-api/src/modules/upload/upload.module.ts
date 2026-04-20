import { Module } from '@nestjs/common';
import { UploadFileUseCase } from './application/use-cases/upload-file.use-case';
import { UploadController } from './presentation/upload.controller';

@Module({
  providers: [UploadFileUseCase],
  controllers: [UploadController],
})
export class UploadModule {}
