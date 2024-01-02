import mongoose ,{Schema,Document} from "mongoose"

import {IdaySales} from "./day_sales";



interface Isales extends Document {
    days:[{
        daySales:IdaySales['_id'],
        total:number
    }];
    totalPrice:number;
    _doc:any;

}

 const salesSchema =new Schema({
        carts:[{
            item:{type:mongoose.Types.ObjectId,ref:'daySales'},
            total:Number
         }],
         totalPrice:Number
  })

  const Sales =mongoose.model<Isales>('sales',salesSchema);

  export {Sales,Isales};