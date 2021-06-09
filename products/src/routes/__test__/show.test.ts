import request from "supertest";
import {app} from "../../app";
import mongoose from 'mongoose';



it('reutrns a 404 if product is not found',async ()=>{

  const id = new mongoose.Types.ObjectId().toHexString();
        const response = await request(app)
        .get(`/api/products/${id}`)
        .send({});


    expect(response.status).toEqual(404);
        
});

it('returns product',async ()=>{
    const title = 'concert';
    const price = 20;
  
    const response = await request(app)
      .post('/api/products')
      .set('Cookie', global.signin())
      .send({
        title,
        price,
      }).expect(201);

      const productResponse = await request(app)
      .get(`/api/products/${response.body.id}`)
      .send()
      .expect(200);
  
    expect(productResponse.body.title).toEqual(title);
    expect(productResponse.body.price).toEqual(price);

});

 