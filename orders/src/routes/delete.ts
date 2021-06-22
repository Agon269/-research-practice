import express,{Request,Response} from 'express';
import {  NotAuthorizedError, NotFoundError, requireAuth} from '@buy.com/common';
import {Order,OrderStatus} from '../models/order';
import {natsWrapper} from '../nats-wrapper';
import {OrderCancelledPublisher} from '../events/publishers/order-cancelled-publisher';
const router = express.Router();

router.delete('/api/orders/:orderId',async(req:Request,res:Response)=>{
    const order = await Order.findById(req.params.orderId).populate('product');

    if(!order){
        throw new NotFoundError("order not found");
    }
    
    if(order.userId !== req.currentUser!.id){
        throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;

    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
        id:order.id,
        product:{
            id:order.product.id
        }
    });

    res.status(204).send(order);
});


export {router as deleteOrderRouter}