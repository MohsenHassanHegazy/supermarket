import mongoose ,{Schema,Document} from "mongoose"

import {Icart} from "./cart";



interface Icasher extends Document {
    carts:[{
        cart:Icart['_id'],
        total:number
    }];
    returns:[{
        cart:Icart['_id'],
        total:number
    }];
    total:number;
    name:string;
    password:string;
    isAdmin:boolean;
    _doc:any;

}

 const casherSchema =new Schema({
        carts:[{
            item:{type:mongoose.Types.ObjectId,ref:'cart'},
            total:Number
         }],
         returns:[{
            item:{type:mongoose.Types.ObjectId,ref:'cart'},
            total:Number
         }],
         total:Number,
         name:{type:String,required:true},
         password:{type:String,required:true},
         isAdmin:{type:Boolean,required:true,default:false}
         
  })

  const Casher =mongoose.model<Icasher>('casher',casherSchema);

  export {Casher,Icasher};