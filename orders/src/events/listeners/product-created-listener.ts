import {Message} from 'node-nats-streaming';
import {Subjects,Listener,ProductCreatedEvent} from '@buy.com/common';
import {queueGroupName} from './qeue-group-name';
import {Product} from '../../models/product';

export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
        subject:Subjects.ProductCreated = Subjects.ProductCreated;

        queueGroupName = queueGroupName;

     async  onMessage(data:ProductCreatedEvent['data'],msg:Message){
            const {id,title,price} = data;
        //needs to have the same id as the original product
            const product =Product.build({
               id,
               title,
               price
            });
            await product.save();

            msg.ack();
        }

}