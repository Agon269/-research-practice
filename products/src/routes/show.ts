import express ,{Request,Response} from 'express';
import {NotFoundError} from '@buy.com/common';

import {Product} from '../models/product';

const router = express.Router();

router.get("/api/products/:id",async (req:Request,res:Response)=>{
    
    const product = await Product.findById(req.params.id)

    
    if(!product){
        throw new NotFoundError("Product not found");
    }

   res.status(200).send(product);

});

export {router as showProduct};