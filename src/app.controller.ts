import { Body, Controller, Get, Post, Request } from "@nestjs/common";
import { Public } from "nest-keycloak-connect";

@Controller()
export class AppController {

  @Post('/cb')
  @Public()
  async callback(@Request() req: Request, @Body() body: any) {
    console.log("req is: ", body);
  }
}
