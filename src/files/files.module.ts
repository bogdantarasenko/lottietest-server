import { Module } from "@nestjs/common";
import { FilesController } from "./files.controller";
import { FileUploadService } from "./files.service";

@Module({
  controllers: [FilesController],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FilesModule {}
