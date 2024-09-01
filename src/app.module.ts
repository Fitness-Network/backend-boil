import { Module } from '@nestjs/common';
import { ExampleModule } from './modules/example/example.module';
import { AuthGuard, KeycloakConnectModule, ResourceGuard, RoleGuard } from 'nest-keycloak-connect';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { KeycloakConfig, keycloakLoader } from './config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConfig, mongoConfigLoader } from './config/database.config';

@Module({
  imports: [
    ExampleModule,
    KeycloakConnectModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const config = configService.get<KeycloakConfig>('keycloak')!;
        return {
          realm: config.realm,
          clientId: config.clientId,
          secret: config.clientSecret,
          authServerUrl: config.url,
        }
      },
      inject: [ConfigService]
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const config: MongoConfig = configService.get('database')!;
        return {
          uri: config.uri
        };
      },
      inject: [ConfigService]
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [keycloakLoader, mongoConfigLoader],
      expandVariables: true,
    })
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
