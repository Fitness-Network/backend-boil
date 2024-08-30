import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ExampleModule } from "./example.module";
import { Client, Issuer } from 'openid-client';

describe('Example', () => {

  let app: INestApplication
  let issuer: Issuer;
  let client: Client;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ExampleModule]
    }).compile()

    app = moduleRef.createNestApplication();
    await app.init()

    issuer = await Issuer.discover('https://iam.relationc.com/realms/Fitnet');
    client = new issuer.Client({
      client_id: 'backend',
      client_secret: 'aNUNvfA0yKYhmBIFfCcL29KGdGmadvLg',
      redirect_uris: ["http://localhost:3000/cb"],
      response_types: ['code']
    });

    client.authorizationUrl({
      scope: 'email profile',
    })
  })

  it('[GET] example', () => {
    console.log(issuer)
  })

})
