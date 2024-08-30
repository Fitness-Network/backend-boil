import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe, VersioningType } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ErrorInterceptor } from "./interceptors/error.interceptors";
import cookieParser from "cookie-parser";

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Global pipes
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    stopAtFirstError: true
  }));
  app.useGlobalInterceptors(new ErrorInterceptor());

  app.use(cookieParser());

  // Version
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Enable cors
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle("API Documentation")
    .setDescription("API description")
    .setVersion("1.0")
    .addBasicAuth(
      {
        type: "http",
        scheme: "basic",
      },
      "basic"
    )
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("document", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Start server
  await app.listen(process.env.APP_PORT || "3000");
  Logger.log("Server listening on port: " + (process.env.APP_PORT || "3000"));

  return app;
}
bootstrap();
