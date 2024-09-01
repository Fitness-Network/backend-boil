import { INestApplication, ValidationPipe } from "@nestjs/common";
import axios from "axios";
import request from 'supertest';
import { ConfigService } from "@nestjs/config";
import { KeycloakConfig } from "config";
import { Example } from "./example.schema";
import { createNestjsApp } from "utils/test";

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
  let record: Example;

  beforeAll(async () => {
    app = await createNestjsApp();

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


  it('[GET] /example -> 403 because role is user', () => {
    return request(app.getHttpServer())
      .post('/example')
      .set('Authorization', 'Bearer ' + userToken)
      .expect(403)
  })

  it('[GET] /example -> 400 because invalid validate', () => {
    return request(app.getHttpServer())
      .post('/example')
      .set('Authorization', 'Bearer ' + adminToken)
      .expect(400)
  })

  it('[POST] /example -> 201 because valid request', async () => {
    const response = await request(app.getHttpServer())
      .post('/example')
      .send({
        name: "Test"
      })
      .set('Authorization', 'Bearer ' + adminToken)
      .expect(201)
    record = response.body;
  })

  it('[GET] /example/:id -> 200 because role is user', () => {
    return request(app.getHttpServer())
      .get('/example/' + record._id)
      .set('Authorization', 'Bearer ' + userToken)
      .expect(200)
  })

  it('[GET] /example -> 403 because role is user', () => {
    return request(app.getHttpServer())
      .get('/example')
      .set('Authorization', 'Bearer ' + userToken)
      .expect(403)
  })

  it('[GET] /example -> 200 because role is admin', () => {
    return request(app.getHttpServer())
      .get('/example')
      .set('Authorization', 'Bearer ' + adminToken)
      .expect(200)
  })

  it('[PUT] /example/:id -> 200 because role is admin', () => {
    return request(app.getHttpServer())
      .put('/example/' + record._id)
      .send({
        name: "Test Updated"
      })
      .set('Authorization', 'Bearer ' + adminToken)
      .expect(200)
  })

  it('[DELETE] /example/soft -> 403 because role is user', () => {
    return request(app.getHttpServer())
      .delete('/example/soft')
      .set('Authorization', 'Bearer ' + userToken)
      .expect(403)
  })

  it('[DELETE] /example/soft -> 200 because role is admin', () => {
    return request(app.getHttpServer())
      .delete('/example/soft')
      .query({ ids: [record._id] })
      .set('Authorization', 'Bearer ' + adminToken)
      .expect(200)
  })

  it('[DELETE] /example/hard -> 403 because role is user', () => {
    return request(app.getHttpServer())
      .delete('/example/hard')
      .set('Authorization', 'Bearer ' + userToken)
      .expect(403)
  })

  it('[DELETE] /example/hard -> 200 because role is admin', () => {
    return request(app.getHttpServer())
      .delete('/example/hard')
      .query({ ids: [record._id] })
      .set('Authorization', 'Bearer ' + adminToken)
      .expect(200)
  })

  afterAll(async () => {
    await app.close();
  })
})
