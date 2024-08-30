import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import axios from "axios";
import request from 'supertest';
import { AppModule } from "../../app.module";

const mockLogin = async (data: { username: string, password: string }) => {

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://iam.relationc.com/realms/Fitnet/protocol/openid-connect/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: {
      ...data,
      client_id: 'backend',
      client_secret: 'aNUNvfA0yKYhmBIFfCcL29KGdGmadvLg',
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
    userToken = await mockLogin({
      username: 'hoaian412003@gmail.com',
      password: '123123123'
    })
    adminToken = await mockLogin({
      username: 'backendadmin',
      password: '123123123'
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
})
