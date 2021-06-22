import {Product} from '../../models/product';
import {Order,OrderStatus} from '../../models/order';
import {app} from '../../app';
import request from 'supertest';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';


it('returns an error if the product doesnt exist',async ()=>{
    const productId = mongoose.Types.ObjectId();

    await request(app)
        .post('/api/orders')
        .set('Cookie',global.signin())
        .send({productId})
        .expect(404);
}); 


it('returns an error if the product is already reserved',async ()=>{
    const product = Product.build({
        title:"uggs",
        price:56
    });
    await product.save();

    const order = Order.build({
        product,
        userId:"213213123dadfasdf",
        status:OrderStatus.Created,
        expiresAt: new  Date()
    });

    await order.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({productId:product.id})
        .expect(400);
});

it('it reserves a pr',async ()=>{
    const product = Product.build({
        title:"uggs",
        price:56
    });
    await product.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({productId:product.id})
        .expect(201);

});

it('emits an order created event', async () => {
    const product = Product.build({
        title: 'UGGS',
        price: 70,
      });
      await product.save();
  
    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ productId: product.id })
      .expect(201);
  
    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
  