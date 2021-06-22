import express ,{Request,Response} from 'express';
import {requireAuth,validateRequest,NotFoundError, NotAuthorizedError} from '@buy.com/common';
import {body} from 'express-validator';
import {Product} from '../models/product';

import {ProductUpdatedListender}from '../events/publishers/product-updated-publisher';
import {natsWrapper} from '../nats-wrapper';
const router = express.Router();


router.put("/api/products/:id",requireAuth,[
    body("title")
    .not()
    .isEmpty()
    .withMessage('Title is required'),
    body("price")
    .isFloat({gt: 0})
    .withMessage('Price must be greater than 0')
],validateRequest,async (req:Request,res:Response)=>{

    const product = await Product.findById(req.params.id);


    if(!product){
        throw new NotFoundError("Product not found");
    }

    if(product.userId !== req.currentUser!.id){
        throw new NotAuthorizedError();
    }
    
    product.set({
        title:req.body.title,
        price:req.body.price
    })
    try{

        await product.save();
    }catch(err){
        console.log(err);
    }

    new ProductUpdatedListender(natsWrapper.client).publish({
        id:product.id,
        title:product.title,
        price:product.price,
        userId:product.userId,
        version:product.version
    });

 res.status(201).send(product);
})
export {router as updateProductRouter};