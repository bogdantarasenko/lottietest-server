import { Response } from "express";
import { ConfigService } from '@nestjs/config';
import { Controller, Get, Param, Res } from "@nestjs/common";
import { AllConfigType } from 'src/config/config.type';
import { FilesService } from "./files.service";
import { Public } from "../auth/decorators";

@Controller("files")
export class FilesController {
  constructor(
    private readonly fileUploadService: FilesService,
    private readonly configService: ConfigService<AllConfigType>
  ) {}

  @Get(":name")
  @Public()
  async getImage(@Param("name") name: string, @Res() res: Response) {
    if (this.configService.get('file').driver === 'local') {
      res.sendFile(await this.fileUploadService.getLocalFile(name))
    } else {
      const stream = await this.fileUploadService.getS3File(name);
      stream.pipe(res);
    }
  }
}
