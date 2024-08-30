import { applyDecorators, DynamicModule, Inject, Module } from "@nestjs/common";
import { KeycloakService } from "./keycloak.service";

export interface KeycloakConfig {
  realm: string;
  clientId: string;
  clientSecret: string;
  serverUrl: string;
}

@Module({})
export class KeycloakModule {

  static forRoot(config: KeycloakConfig): DynamicModule {
    return {
      module: KeycloakModule,
      providers: [
        {
          provide: 'KEYCLOAK_CONFIG',
          useValue: config
        },
        KeycloakService
      ],
      exports: [KeycloakService],
      global: true
    }
  }
}

