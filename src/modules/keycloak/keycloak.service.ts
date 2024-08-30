import { Inject, Injectable } from "@nestjs/common";
import { KeycloakConfig } from "./keycloak.module";
import axios, { Axios } from 'axios';
import { ClientCrdentialsGrant } from "./types/response";

@Injectable()
export class KeycloakService {

  private core: Axios;
  private accessToken: string;

  constructor(@Inject('KEYCLOAK_CONFIG') private config: KeycloakConfig) {
    this.core = axios.create({
      baseURL: this.config.serverUrl
    });

  }

  async onModuleInit() {
    this.accessToken = (await this.grant()).access_token;
    this.core.interceptors.request.use(async (request) => {
      request.headers['Authorization'] = 'Bearer ' + this.accessToken;
      return request;
    })
    console.log(await this.getRoles());
  }

  async grant(): Promise<ClientCrdentialsGrant> {
    return this.core.post(`/realms/${this.config.realm}/protocol/openid-connect/token`, {
      grant_type: 'client_credentials',
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => response.data);
  }

  async getRoles() {
    return this.core.get(`/admin/realms/${this.config.realm}/clients/${this.config.clientId}/roles`).then(response => {
      return response.data;
    }).catch(error => {
      return error.response.data;
    })
  }
}
