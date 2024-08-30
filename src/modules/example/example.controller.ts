import { Controller, Get } from "@nestjs/common";
import { Public, Resource, Roles, Scopes } from "nest-keycloak-connect";

@Controller('example')
@Resource('example')
export class ExampleController {
  constructor() { }

  @Get('/public')
  @Public()
  async public() {
    return 'This is public route'
  }

  @Get('with-role')
  @Roles({ roles: ['admin'] })
  async findAllBarcodes() {
    return 'Admin route'
  }

  @Get('/with-permission/user')
  @Scopes('view')
  async findOne() {
    return 'User have view example permission can access this route'
  }

  @Get('/with-permission/admin')
  @Scopes('view-all')
  async findAll() {
    return 'Admin have view all example permission can access this route'
  }
}
