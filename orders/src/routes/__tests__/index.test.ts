import {Product} from '../../models/product';
import {app} from '../../app';
import request from 'supertest';

const createProduct = async ()=>{
    const product = Product.build({
        title:"uggs",
        price:56
    });

    await product.save();

    return product
}

it("returns orders for a user", async ()=>{
  // Create three products
  const productOne = await createProduct();
  const productTwo = await createProduct();
  const productThree = await createProduct();

  const userOne = global.signin();
  const userTwo = global.signin();
  // Create one order as User #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ productId: productOne.id })
    .expect(201);

  // Create two orders as User #2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ productId: productTwo.id })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ productId: productThree.id })
    .expect(201);

  // Make request to get orders for User #2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

  // Make sure we only got the orders for User #2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].product.id).toEqual(productTwo.id);
  expect(response.body[1].product.id).toEqual(productThree.id);
});