import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Route,
  SuccessResponse,
} from "tsoa";
import { User } from "../dtos/somethingModel.js";
import { SomethingService, SomethingParams } from "../services/somethingService.js";

@Route("something")
export class SomethingController extends Controller {
    @Get("{userId}")
    public async getUser(
        @Path() userId: number,
        @Query() name?: string
    ): Promise<User> {
        return new SomethingService().get(userId, name)
    }

    @SuccessResponse("201", "Created")
    @Post()
    public async createUser(
        @Body() requestBody: SomethingParams
    ): Promise<void> {
        this.setStatus(201); // set return status 201
        new SomethingService().create(requestBody);
        return;
    }
} 