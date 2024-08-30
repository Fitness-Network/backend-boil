
import { Module } from '@nestjs/common';
import { ExampleModule } from './modules/example/example.module';
import { AuthGuard, KeycloakConnectModule, ResourceGuard, RoleGuard } from 'nest-keycloak-connect';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ExampleModule,
    KeycloakConnectModule.register({
      authServerUrl: 'https://iam.relationc.com',
      clientId: 'backend',
      realm: 'Fitnet',
      secret: 'aNUNvfA0yKYhmBIFfCcL29KGdGmadvLg'
    }),
    ConfigModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard
    },
  ]
})
export class AppModule { }
