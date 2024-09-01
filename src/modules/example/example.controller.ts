import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { Public, Resource, Scopes } from "nest-keycloak-connect";
import { ExampleService } from "./exmple.service";
import { GetAllExampleQuery, GetOneExampleParam } from "./dto/get";
import { CreateExampleDto } from "./dto/create";
import { UpdateExampleDto, UpdateExampleParams } from "./dto/update";
import { DeleteExampleQuery } from "./dto/delete";

@Controller('example')
@Resource('example')
export class ExampleController {
  constructor(
    private exampleService: ExampleService
  ) { }

  @Get('/public')
  @Public()
  async public() {
    return 'This is public route'
  }

  @Get('')
  @Scopes('view-all')
  async getAll(@Query() query: GetAllExampleQuery) {
    return this.exampleService.getAll(query);
  }

  @Get(':id')
  @Scopes('view')
  async getOne(@Param() param: GetOneExampleParam) {
    return this.exampleService.findById(param.id);
  }

  @Post()
  @Scopes('create')
  async create(@Body() body: CreateExampleDto) {
    return this.exampleService.create(body);
  }

  @Put(':id')
  @Scopes('update')
  async update(@Body() body: UpdateExampleDto, @Param() params: UpdateExampleParams) {
    return this.exampleService.updateOne({ _id: params.id }, body)
  }

  @Delete('soft')
  @Scopes('delete')
  async deleteSoft(@Query() query: DeleteExampleQuery) {
    return this.exampleService.deleteMany(query.ids);
  }

  @Delete('hard')
  @Scopes('delete')
  async deleteHard(@Query() query: DeleteExampleQuery) {
    return this.exampleService.hardDelete(query.ids);
  }
}
