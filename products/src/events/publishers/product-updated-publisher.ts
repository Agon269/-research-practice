import {Publisher,Subjects,ProductUpdatedEvent} from '@buy.com/common';


export class ProductUpdatedListender extends Publisher<ProductUpdatedEvent>{
    subject:Subjects.ProductUpdated = Subjects.ProductUpdated;
}

