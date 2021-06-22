import {Publisher,OrderCreatedEvent,Subjects} from '@buy.com/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject:Subjects.OrderCreated = Subjects.OrderCreated;
}