import { registerAs } from "@nestjs/config";

export interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
  clientSecret: string;
  accounts: {
    user: {
      account: string;
      pass: string;
    },
    admin: {
      account: string;
      pass: string;
    }
  }
}

export const keycloakLoader = registerAs('keycloak', () => ({
  url: process.env.KEYCLOAK_AUTH_URL,
  realm: process.env.KEYCLOAK_REALM,
  clientId: process.env.KEYCLOAK_CLIENT_ID,
  clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
  accounts: {
    user: {
      account: process.env.KEYCLOAK_USER_ACCOUNT,
      pass: process.env.KEYCLOAK_USER_PASS
    },
    admin: {
      account: process.env.KEYCLOAK_ADMIN_ACCOUNT,
      pass: process.env.KEYCLOAK_ADMIN_PASS
    }
  }
}))
