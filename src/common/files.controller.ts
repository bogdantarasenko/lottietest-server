import { Response } from "express";
import { Controller, Get, Param, Res } from "@nestjs/common";
import { FileUploadService } from "./services/file-upload.service";
import { Public } from "../auth/decorators";

@Controller("files")
export class FilesController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Get(":name")
  @Public()
  getImage(@Param("name") name: string, @Res() res: Response) {
    res.sendFile(this.fileUploadService.getFilePath(name));
  }
}
