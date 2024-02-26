import { Module } from "@nestjs/common";
import { FilesService } from "../modules/files/files.service";
import { FilesController } from "../modules/files/files.controller";

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class CommonModule {}
