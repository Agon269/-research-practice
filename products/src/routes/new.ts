import express ,{Request,Response} from 'express';
import {requireAuth,validateRequest} from '@buy.com/common';
import {body} from 'express-validator';
import {Product} from '../models/product';
import {ProductCreatedPublisher}from '../events/publishers/product-created-publisher';
import {natsWrapper} from '../nats-wrapper';
const router = express.Router();

router.post("/api/products",requireAuth,[
    body("title")
    .not()
    .isEmpty()
    .withMessage('Title is required'),
    body("price")
    .isFloat({gt: 0})
    .withMessage('Price must be greater than 0')

],validateRequest,async (req:Request,res:Response)=>{

    const {title,price} = req.body;

    const product = Product.build({
        title,
        price,
        userId:req.currentUser!.id
    });
    try{
    await product.save();
    }catch(err){
    console.log(err);
    }
    new ProductCreatedPublisher(natsWrapper.client).publish({
        id:product.id,
        title:product.title,
        price:product.price,
        userId:product.userId,
        version:product.version
    });

    res.status(201).send(product);
});

export {router as createProductRouter};




// const { title, price } = req.body;

// const ticket = Ticket.build({
//   title,
//   price,
//   userId: req.currentUser!.id,
// });
// await ticket.save();
// new TicketCreatedPublisher(natsWrapper.client).publish({
//   id: ticket.id,
//   title: ticket.title,
//   price: ticket.price,
//   userId: ticket.userId,
// //   version: ticket.version,
// // });

// res.status(201).send(ticket);