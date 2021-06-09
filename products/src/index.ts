import mongoose from 'mongoose';
import {app} from './app'
import {natsWrapper} from './nats-wrapper';
const start = async()=>{
   if(!process.env.JWT_KEY){
     throw new Error ("JWT_KEY must be defined")
   }
   if(!process.env.MONGO_URI){
    throw new Error ("MONGO_URI must be defined")
  }


  try{  
    //connecting to the nats wrapper client
    await natsWrapper.connect("products","lkasd","http://nats-srv:4222");
    
    //graceful shutdown
    natsWrapper.client.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });
  process.on('SIGINT', () => natsWrapper.client.close());
  process.on('SIGTERM', () => natsWrapper.client.close());
  
    await mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  console.log("connected sucessfully");
  
  }catch(err){
    console.log(err);
    
  }
app.listen(3000,()=>{
  console.log("Listening on port 3000 for products and events of products !!!");

  })
}
start();
