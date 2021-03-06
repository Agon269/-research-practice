import request from "supertest";
import {app} from "../../app";
import {Product} from '../../models/product';
import {natsWrapper} from '../../nats-wrapper';

it('it has a route handler listening to  /api/products for post requests',async ()=>{
        const response = await request(app)
        .post('/api/products')
        .send({});

    expect(response.status).not.toEqual(404);
        
});

it('it can only be accessed if the user is signed in',async ()=>{
     await request(app)
    .post('/api/products')
    .send({})
    .expect(401);
});

it('returns a status not 401 if user is signed in',async ()=>{
    const response = await request(app)
    .post('/api/products')
    .set('Cookie',global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});


it('returns an error if an invalid title is provided',async ()=>{
 await request(app)
    .post('/api/products')
    .set('Cookie',global.signin())
    .send({
        title:"",
        price:10
    }).expect(400);

    await request(app)
    .post('/api/products')
    .set('Cookie',global.signin())
    .send({
   
        price:10
    }).expect(400);

});


it('returns an error if an invalid price is provided',async ()=>{
    await request(app)
    .post('/api/products')
    .set('Cookie',global.signin())
    .send({
        title:"uggs",
        price:-10,
    }).expect(400);
    await request(app)
    .post('/api/products')
    .set('Cookie',global.signin())
    .send({
        title:"uggs"
    }).expect(400);
});


it('it creates a product with valid inputs',async ()=>{
  let products = await Product.find({});
  expect(products.length).toEqual(0);

    //check if product has been created from mongo
    await request(app)
    .post('/api/products')
    .set('Cookie',global.signin())
    .send({
        title:"uggs",
        price:20
    }).expect(201);

    products = await Product.find({});

    
    expect(products.length).toEqual(1);
    expect(products[0].price).toEqual(20);

});


it('publishes an event after creating product',async ()=>{

      await request(app)
      .post('/api/products')
      .set('Cookie',global.signin())
      .send({
          title:"uggs",
          price:20
      }).expect(201);
  
      expect(natsWrapper.client.publish).toHaveBeenCalled();
  });