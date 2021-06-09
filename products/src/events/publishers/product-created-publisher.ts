import {Publisher,Subjects,ProductCreatedEvent} from '@buy.com/common';


export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent>{
    subject:Subjects.ProductCreated = Subjects.ProductCreated;
}


