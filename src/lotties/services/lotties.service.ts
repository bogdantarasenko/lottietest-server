import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

// dto
import { CreateLottieInput } from "../dto/lottie/create-lottie.input";

// schema
import { Lottie, LottieDocument } from "../schemas/lottie.schema";

// common
import { CrudService } from "../../common/services/crud.service";
import { FileUploadService } from "../../common/services/file-upload.service";

@Injectable()
export class LottiesService extends CrudService<
  Lottie,
  CreateLottieInput
> {
  constructor(
    @InjectModel(Lottie.name)
    private readonly lottieModel: Model<LottieDocument>,
    private readonly fileUploadService: FileUploadService,
  ) {
    super(lottieModel);
  }

  async getTags(): Promise<string[]> {
    return this.lottieModel.distinct('tags');
  }

  async createWithUser(tags, author, file): Promise<Lottie> {
    const path = await this.fileUploadService.saveFile(file);
    const lottie = new this.lottieModel({ tags, author, path });

    try {
      await lottie.save();
    } catch (error) {
      if (file) {
        this.fileUploadService.deleteFile(lottie.path);
      }
    }

    return lottie;
  }
}
