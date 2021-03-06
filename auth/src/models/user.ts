import mongoose from 'mongoose';
import {Password} from '../services/password';
//interface to describe the required props of a new user

interface userAttrs {
    email: string;
    password: string;
}
//interface to describe in props of user model

interface userModel extends mongoose.Model<userDoc>{
    build(attrs:userAttrs): userDoc;  

}

//interface todescribe the properties that a single user doc has

interface userDoc extends mongoose.Document{
    email: string;
    password:string;
}

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }   
},{
    toJSON:{
    transform(doc,ret){
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
     }
    }
});

userSchema.pre('save',async function(done){
   if(this.isModified('password')){
       const hashed = await Password.toHash(this.get('password'));
       this.set('password',hashed) ;
   }
   done();
});

userSchema.statics.build = (attrs:userAttrs)=>{
    return new User(attrs);

}

const User = mongoose.model<userDoc,userModel>('User',userSchema);


export {User};