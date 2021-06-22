import express,{Request,Response} from 'express';
import mongoose from 'mongoose';
import {BadRequestError, NotFoundError, OrderStatus, requireAuth,validateRequest} from '@buy.com/common';
import {body} from 'express-validator';
import {Product} from '../models/product';
import {Order} from '../models/order';
import {natsWrapper} from '../nats-wrapper';
import {OrderCreatedPublisher} from '../events/publishers/order-created-publisher';


const router = express.Router();


const EXPIRATION_WINDOW_SECONDS = 15 * 60 ;


router.post('/api/orders',requireAuth,
[
    body('productId')
    .not()
    .isEmpty()
    .custom((input:string)=>mongoose.Types.ObjectId.isValid(input))
    .withMessage("Product ID must be provided")
],
validateRequest
,async(req:Request,res:Response)=>{
    //find the product
    const {productId} = req.body;

    const product = await Product.findById(productId);

    if(!product){
        throw new NotFoundError("Product not found");  
    }
 
    //make sure the product is available
    //if product is in ordering process stop the order
  
    const isReserved = await product.isReserved();
    if(isReserved){
        throw new BadRequestError("Product is already reserved");
    }

    //calculate exp date for product 

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds()+EXPIRATION_WINDOW_SECONDS);
    
    //create order & lock product

   const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        product
    });

    await order.save();


    //send event to other services

    new OrderCreatedPublisher(natsWrapper.client).publish({
        id:order.id,
        status:order.status,
        userId:order.userId,
        expiresAt:order.expiresAt.toISOString(),
        product:{
            id:productId.id,
            price:product.price
        }
    })

    res.status(201).send(order);
});


export {router as newOrderRouter}