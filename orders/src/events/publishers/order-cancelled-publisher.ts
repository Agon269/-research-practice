import {Publisher,OrderCancelledEvent,Subjects} from '@buy.com/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject:Subjects.OrderCancelled = Subjects.OrderCancelled;
}