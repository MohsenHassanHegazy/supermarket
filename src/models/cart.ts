import mongoose ,{Schema,Document} from "mongoose"

import {Iproduct} from "./product"
import { Icasher } from "./casher"



interface Icart extends Document {
    items:Map<string,number>;
    totalPrice:number;
    date:Date;
    casher:Icasher['_id'];
    returned:boolean;
    _doc:any;

 }

 const cartSchema =new Schema({
         items:new Map(),
         totalPrice:Number,
         date:Date,
         casher:{type:mongoose.Types.ObjectId,ref:'casher'},
         returned:{type:Boolean,default:false}
  })

  const Cart =mongoose.model<Icart>('cart',cartSchema);

  export {Cart,Icart};