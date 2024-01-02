import mongoose ,{Schema,Document} from "mongoose"

import {Iproduct} from "./product"



interface Idiscount extends Document {
  
     item:Iproduct['_id'];
     number:number;
     discount:number;
    _doc:any;

 }

 const discountSchema =new Schema({
        items:{type:mongoose.Types.ObjectId,ref:'product'},
        number:Number,
        discount:Number
  })

  const Discount =mongoose.model<Idiscount>('discount',discountSchema);

  export {Discount,Idiscount};