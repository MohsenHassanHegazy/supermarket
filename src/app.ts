import  express  from "express";
import mongoose from "mongoose";
import { default as connectMongoDBSession } from 'connect-mongodb-session';
import session from 'express-session';

import adminRoutes from "./routes/admin"
import casherRoutes from "./routes/casher"
import {Casher, Icasher} from './models/casher'
import { Cart,Icart } from './models/cart';
import { DaySales,IdaySales } from "./models/day_sales";





const app =express();
const MongoDBStore = connectMongoDBSession(session);

const uri ='mongodb+srv://mohsen:DZFZpuN88Gmkbdj@cluster0test.mc0rmsv.mongodb.net/supermarket?retryWrites=true&w=majority'
const secret='zamazmMarket';

const store =new MongoDBStore({
    uri:uri,
    collection:'session'
})

app.use(express.json())

app.use(session({
    store:store,
    secret:secret,
    saveUninitialized:false,
    resave:false
}))

declare module 'express-session'{
    interface SessionData{
        logedUserId:string,
        isAdmin:boolean,
        cart:Icart,
        casher:Icasher,
        day:IdaySales


    }
 }

app.use(async (req:express.Request,res:express.Response,next:express.NextFunction) => {
    if(!req.session.logedUserId){
        return next();
     }
    const casher = await Casher.findById(req.session.logedUserId);
    if(!casher){
        return next();
    }
    let day=await DaySales.findOne({ongoing:true})
    if(!day){ 
        return next();
    }
    req.session.casher=casher;
    req.session.logedUserId=casher._id;
    req.session.isAdmin=casher.isAdmin;
    req.session.cart=new Cart({
        items:new Map(),
        totalPrice:0,
        date:Date.now(),
        casher:casher._id
    });
    req.session.day=day.id;
    return next();
} )

app.use(adminRoutes);
app.use(casherRoutes);

app.use(async(error:any,req:express.Request,res:express.Response,next:express.NextFunction)=>{
    console.log(error);
    return res.status(error.code).json(error.msg)
});

mongoose.connect(uri)
.then(rs=>{
    console.log('connected')
    app.listen(3000);
 })
