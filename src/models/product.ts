import mongoose ,{Schema,Document} from "mongoose"

import { Idiscount } from "./discounts";


interface Iproduct extends Document {
    _id:number;
    name:string;
    price:number;
    amount:{ 
        number:number;
        unit:string;
    };
    discount:Idiscount['_id'];
     _doc:any;
 }
 const productSchema:Schema =new Schema({
    _id:{type:Number,required:true},
    name:{type:String,required:true},
    price:{type:Number,required:true},
    amount:{
        number:{type:Number,required:true},
        unit:{type:String,required:true}
     },
    discount:{type:mongoose.Types.ObjectId,ref:'discount'}
  });

  const Product =mongoose.model<Iproduct>('product',productSchema);

  export {Product ,Iproduct};