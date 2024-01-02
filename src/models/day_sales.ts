import mongoose ,{Schema,Document} from "mongoose"

import {Icart} from "./cart";
import {Icasher} from "./casher"



interface IdaySales extends Document {
   ongoing:boolean;
   drawerscount:number; 
   drawers:
   [{carts:[{
        cart:Icart['_id'],
        total:number
    }];
    returns:[{
        cart:Icart['_id'],
        total:number
    }];
    totalPrice:number;
    casher:Icasher['_id'];}];
    date:Date;
    _doc:any;

}

 const daySalesSchema =new Schema({
    ongoing:Boolean,
    drawerscount:{type:Number},
    drawers:
        [{carts:[{
            item:{type:mongoose.Types.ObjectId,ref:'cart'},
            total:Number
         }],
         returns:[{
            item:{type:mongoose.Types.ObjectId,ref:'cart'},
            total:Number
         }],
         totalPrice:Number,
         casher:{type:mongoose.Types.ObjectId,ref:'casher'}}],
         date:Date
  })

  const DaySales =mongoose.model<Icart>('daySales',daySalesSchema);

  export {DaySales,IdaySales};