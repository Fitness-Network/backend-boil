import { ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "app.module";
import { ErrorInterceptor } from "interceptors/error.interceptors";

export const createNestjsApp = async () => {

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule]
  }).compile()

  const app = moduleRef.createNestApplication();
  // Global pipes
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    stopAtFirstError: true
  }));
  app.useGlobalInterceptors(new ErrorInterceptor());
  await app.init();
  return app;
}
