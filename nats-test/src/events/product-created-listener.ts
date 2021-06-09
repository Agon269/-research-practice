import {Listener} from './base-listener';
import { Message } from 'node-nats-streaming';
import {ProductCreatedEvent} from './product-created-evet';
import {Subjects} from './subjects';

export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
    subject:Subjects.ProductCreated = Subjects.ProductCreated;
    queueGroupName = 'payments-service';
  
    onMessage(data: ProductCreatedEvent['data'], msg: Message) {
      console.log('Event data!', data);
        console.log(data.id);
        console.log(data.price);
        console.log(data.title);
    
      msg.ack();
    }
  }
  