import express,{Request,Response} from 'express';
import {  NotAuthorizedError, NotFoundError, requireAuth} from '@buy.com/common';
import {Order} from '../models/order';
const router = express.Router();

router.get('/api/orders/:orderId',requireAuth,async(req:Request,res:Response)=>{
    
    const order = await Order.findById(req.params.orderId).populate("product");

    if(!order){
        throw new NotFoundError("product not found");
    }
    
    if(order.userId !== req.currentUser!.id){
        throw new NotAuthorizedError();
    }

    res.send(order);
});


export {router as showOrderRouter}