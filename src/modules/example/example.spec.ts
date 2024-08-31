import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import axios from "axios";
import request from 'supertest';
import { AppModule } from "../../app.module";
import { ConfigService } from "@nestjs/config";
import { KeycloakConfig } from "src/config";

type LoginData = {
  username: string;
  password: string;
  realm: string;
  clientId: string;
  clientSecret: string;
  url: string;
}

const mockLogin = async (data: LoginData) => {

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${data.url}/realms/${data.realm}/protocol/openid-connect/token`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: {
      client_id: data.clientId,
      client_secret: data.clientSecret,
      username: data.username,
      password: data.password,
      grant_type: 'password'
    }
  };

  return axios.request(config)
    .then((response) => {
      return response.data.access_token as string;
    })
}

describe('Example', () => {

  let app: INestApplication
  let userToken: string;
  let adminToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleRef.createNestApplication();
    await app.init();

    const configSerice: ConfigService = app.get(ConfigService)
    const config = configSerice.get<KeycloakConfig>('keycloak')!;

    userToken = await mockLogin({
      ...config,
      username: config.accounts.user.account,
      password: config.accounts.user.pass
    })
    adminToken = await mockLogin({
      ...config,
      username: config.accounts.admin.account,
      password: config.accounts.admin.pass
    })
  })

  describe('[GET] /example/public', () => {
    it('Should be 200 always because it public route', () => {
      return request(app.getHttpServer())
        .get('/example/public')
        .expect(200)
    })
  })

  describe('[GET] /example/with-roles', () => {

    it('Should be 403 with user role', () => {
      return request(app.getHttpServer())
        .get('/example/with-role')
        .set('Authorization', 'Bearer ' + userToken)
        .expect(403)
    })

    it('Should be 200 with admin role', () => {
      return request(app.getHttpServer())
        .get('/example/with-role')
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(200)
    })
  })

  describe('[GET] /example/with-permission/user', () => {

    it('Should be 200 with user role', () => {
      return request(app.getHttpServer()).get('/example/with-permission/user')
        .set('Authorization', 'Bearer ' + userToken)
        .expect(200)
    })

    it('Should be 200 with admin role', () => {
      return request(app.getHttpServer()).get('/example/with-permission/user')
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(200)
    })
  })

  describe('[GET] /example/with-permission/admin', () => {

    it('Should be 403 with admin role', () => {
      return request(app.getHttpServer()).get('/example/with-permission/admin')
        .set('Authorization', 'Bearer ' + userToken)
        .expect(403)
    })

    it('Should be 200 with admin role', () => {
      return request(app.getHttpServer()).get('/example/with-permission/admin')
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(200)
    })
  })
})
