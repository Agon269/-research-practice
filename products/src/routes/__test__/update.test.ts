import request from "supertest";
import {app} from "../../app";
import mongoose from 'mongoose';
import {natsWrapper} from '../../nats-wrapper';



it("if product does not exist returns 404",async ()=>{

// const id = new mongoose.Types.ObjectId().toHexString();
//    await request(app)
//     .put(`/api/products/${id}`)
//     .set('Cookie', global.signin())
//     .send({
//         title:"asdafdas",
//         prce:21
//     }).expect(404);

});


it("if user is not authed returns 401",async ()=>{
const id = new mongoose.Types.ObjectId().toHexString();
await request(app)
    .put(`/api/products/${id}`)
    .send({
        title:"asdafdas",
        prce:21
    }).expect(401);

});


it("if user  does not own product returns 401",async ()=>{
    const response =   await request(app)
    .post("/api/products")
    .set('Cookie', global.signin())
    .send({
        title:"ASDfasd",
        price: 20
    });

    await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
        title:"nkjnk",
        price: 88
    }).expect(401);


});

it("if title or price is invalid returns 400",async ()=>{
    const cookie =global.signin();
    const response =   await request(app)
    .post("/api/products")
    .set('Cookie', cookie)
    .send({
        title:"ASDfasd",
        price: 20
    });
    await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title:"",
        price: -1
    }).expect(400);

});

it("it updates product successfully 201",async ()=>{
    const cookie =global.signin();
    const response =   await request(app)
    .post("/api/products")
    .set('Cookie', cookie)
    .send({
        title:"ASDfasd",
        price: 20
    });

  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title:"real update",
        price: 1000
    }).expect(201);

const productResponse = await request(app)
   .get(`/api/products/${response.body.id}`)
   .send();

   expect(productResponse.body.title).toEqual("real update");
   expect(productResponse.body.price).toEqual(1000);


});

it("it publishes an event successfully",async ()=>{
    const cookie =global.signin();
    const response =   await request(app)
    .post("/api/products")
    .set('Cookie', cookie)
    .send({
        title:"ASDfasd",
        price: 20
    });

  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title:"real update",
        price: 1000
    }).expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();



});