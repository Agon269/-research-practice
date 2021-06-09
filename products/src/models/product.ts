import mongoose from 'mongoose';


interface ProductAttrs {
    title: string;
    price: number;
    userId:string;
}

interface ProductdOC extends mongoose.Document{
    title: string;
    price: number;
    userId: string;
}
interface ProductModel extends mongoose.Model<ProductdOC>{
    build(attrs:ProductAttrs) : ProductdOC

}

const ProductSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    } ,
    userId:{
        type: String,
        required: true 
    }  
},{
    toJSON:{
    transform(doc,ret){
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
     }
    }
});



ProductSchema.statics.build = (attrs:ProductAttrs)=>{
    return new Product(attrs);

}

const Product  = mongoose.model<ProductdOC,ProductModel>('User',ProductSchema);


export {Product};