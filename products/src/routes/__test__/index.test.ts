import request from "supertest";
import {app} from "../../app";

const makeProduct = ()=>{
    return request(app)
    .post('/api/products')
    .set('Cookie', global.signin())
    .send({
      title:"shoes",
      price:12,
    }).expect(201);
}
it("returns products",async ()=>{
    
 await makeProduct();
 await makeProduct();
 await makeProduct();
   const response = await request(app)
   .get('/api/products')
   .send()
   .expect(200);

   expect(response.body.length).toEqual(3);
   
})