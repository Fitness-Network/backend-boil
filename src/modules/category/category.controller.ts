import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { Public, Resource, Scopes } from "nest-keycloak-connect";
import { CategoryService } from "./category.service";
import { GetAllCategoryQuery, GetOneCategoryParam } from "./dto/get";
import { CreateCategoryDto } from "./dto/create";
import { UpdateCategoryDto, UpdateCategoryParams } from "./dto/update";
import { DeleteCategoryQuery } from "./dto/delete";

@Controller('categories')
@Resource('category')
export class CategoryController {
  constructor(
    private categoryService: CategoryService
  ) { }

  @Get('')
  @Public()
  async getAll(@Query() query: GetAllCategoryQuery) {
    return this.categoryService.getAll(query);
  }

  @Get(':categoryId')
  @Scopes('view')
  async getOne(@Param() param: GetOneCategoryParam) {
    return this.categoryService.findById(param.categoryId,);
  }

  @Post()
  @Public()
  async create(@Body() body: CreateCategoryDto) {
    return this.categoryService.create(body);
  }

  @Put(':categoryId')
  @Scopes('update')
  async update(@Body() body: UpdateCategoryDto, @Param() params: UpdateCategoryParams) {
    return this.categoryService.updateOne({ _id: params.categoryId }, body)
  }

  @Delete('soft')
  @Scopes('delete')
  async deleteSoft(@Query() query: DeleteCategoryQuery) {
    return this.categoryService.deleteMany(query.ids);
  }

  @Delete('hard')
  @Scopes('delete')
  async deleteHard(@Query() query: DeleteCategoryQuery) {
    return this.categoryService.hardDelete(query.ids);
  }
}
