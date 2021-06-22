import {Message} from 'node-nats-streaming';
import {Subjects,Listener,ProductUpdatedEvent} from '@buy.com/common';
import {queueGroupName} from './qeue-group-name';
import {Product} from '../../models/product';


export class ProductUpdatedListener extends Listener<ProductUpdatedEvent> {
    subject:Subjects.ProductUpdated = Subjects.ProductUpdated;
    queueGroupName = queueGroupName;

    
    async onMessage(data:ProductUpdatedEvent['data'],msg:Message){
        const {id,title,price} = data;

        const product = await Product.findOnEvent(data);

        if(!product){
            throw new Error('Product not found');
        }

        product.set({title,price});

        await product.save();

        msg.ack();
    }
}