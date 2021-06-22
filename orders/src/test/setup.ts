import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import { app } from '../app';

declare global {
    namespace NodeJS{
        interface Global{
            signin():string[];
        }
    }
}


jest.mock('../nats-wrapper');

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asddf';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin =  ()=>{



//build a jwt payload. {id,email}
const payload = {
  id:new mongoose.Types.ObjectId().toHexString(),
  email:"test@gg.com"
};
//create the JWT!
const token = jwt.sign(payload,process.env.JWT_KEY!);


//build session object {jwt: my_jwt}
const session = {jwt:token};

//json into a string
const sessionJSON = JSON.stringify(session);

//encode JSON to base64

const base64 = Buffer.from(sessionJSON).toString('base64');

//return a string

return[ `express:sess=${base64}`];

}