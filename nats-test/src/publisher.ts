import nats from 'node-nats-streaming';
import {ProductCreatedPublisher} from "./events/product-created-publisher"
console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect',async ()=>{
    console.log('connected to nats');

    const publisher =  new ProductCreatedPublisher(stan);
    try{
        await publisher.publish({
            id:"23123123",
            title:"uggs",
            price:21
        })
    }catch(err){
        console.log(err);
        
    }

    // const data = JSON.stringify({
    //     id:"12312312",
    //     title:"uggs",
    //     price:12
    // });

    // stan.publish('product:created',data,()=>{ 
    //     console.log("create product event published");
    // });
    
});
 