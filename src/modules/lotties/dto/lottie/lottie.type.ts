import { ObjectType } from "@nestjs/graphql";
import { Paginated } from "../../../../common/pagination/pagination.type";
import { Lottie } from "../../lottie.schema";

@ObjectType()
export class PaginatedLottie extends Paginated(Lottie) {}
