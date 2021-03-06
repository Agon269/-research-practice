import mongoose from 'mongoose';
import {app} from './app'
import { ProductCreatedListener } from './events/listeners/product-created-listener';
import { ProductUpdatedListener } from './events/listeners/product-updated-listener';
import {natsWrapper} from './nats-wrapper';


const start = async()=>{
   if(!process.env.JWT_KEY){
     throw new Error ("JWT_KEY must be defined")
   }
   if(!process.env.MONGO_URI){
    throw new Error ("MONGO_URI must be defined")
  }  
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }


  try{  
    //connecting to the nats wrapper client
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    
    //graceful shutdown
    natsWrapper.client.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });
  process.on('SIGINT', () => natsWrapper.client.close());
  process.on('SIGTERM', () => natsWrapper.client.close());

    //activating listeners

  new  ProductCreatedListener(natsWrapper.client).listen();
  new  ProductUpdatedListener(natsWrapper.client).listen();
  
    await mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  console.log("connected to order mongodb sucessfully");
  
  }catch(err){
    console.log(err);
    
  }
app.listen(3000,()=>{
  console.log("Listening for orders on port 3000!!!");

  })
}
start();
