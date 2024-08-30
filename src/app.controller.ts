import { Controller, Get, Request } from "@nestjs/common";

@Controller()
export class AppController {
  @Get('/cb')
  async callback(@Request() req: Request) {
    console.log("req is: ", req);
  }
}
