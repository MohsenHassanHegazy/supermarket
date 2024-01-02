import express, {request} from 'express';
import { validationResult } from 'express-validator';

import {Casher} from '../models/casher'
import { Product,Iproduct } from '../models/product';
import { Sales } from '../models/sales';
import { DaySales } from '../models/day_sales';
import { Discount } from '../models/discounts';
import { Cart } from '../models/cart';



//casher login
const login=async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    const errors =validationResult(req);
    if(!errors.isEmpty()){
        return next({error:'',code:401,msg:errors.array()})
     }
    const name =req.body.name;
    const casher = await  Casher.findOne({name:name});
    if(!casher){
        return next({error:'',code:404,msg:'casher was not found'});
     }
    const password =req.body.password;
    if(password!==casher.password){
        return next({error:'',code:404,msg:'wrong password'});
     }
    let day:any =await DaySales.findOne({ongoing:true});
    if(!day){
        return next({error:'',code:404,msg:'day was not started'});
     }  
     casher.total=day.drawers[req.body.drawer].totalPrice;
     day.drawers[req.body.drawer].casher=casher._id;
     await casher.save();
     await day.save();
     return res.status(200).json({msg:'casher logged in',casher:casher});
}

//casher logout
const logout=async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    let day:any =await DaySales.findOne({ongoing:true});
    if(!day){
        return next({error:'',code:404,msg:'day was not started'});
     }
     const casher = await  Casher.findById(req.session.logedUserId);
     if(!casher){
         return next({error:'',code:404,msg:'casher was not found'});
      }
      day.drawers[req.body.drawer].totalPrice=casher.total;
      try {
          await day.save();
          return res.status(200)    
        
      } catch (error) {
        next({error:error,code:500,msg:'server error.'})
      }
}

//getting product info
const getProductInfo =async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    const errors =validationResult(req);
    if(!errors.isEmpty()){
        return next({error:'',code:401,msg:errors.array()})
     }
     try {
        const product =await Product.findById(req.body.id);
        if(!product){
       next({error:'',code:404,msg:'product was not found !'})

         }
        return res.status(200).json({product:product});
    } catch (err) {
       next({error:err,code:500,msg:'the data base is off.'})
    }
}

//getting products by name (search)
const getProductSearch =async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    const errors =validationResult(req);
    if(!errors.isEmpty()){
        return next({error:'',code:401,msg:errors.array()})
     }
     try {
         const products =await Product.find({name:{$regex:req.body.word,$option:'i'} })
         return res.status(200).json({products:products});
     } catch (err) {
        next({error:err,code:500,msg:'the data base is off.'})
     }
}

//adding item to cart req.body.number<0 to remove item
const addingToCart =async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    const errors =validationResult(req);
    if(!errors.isEmpty()){
        return next({error:'',code:401,msg:errors.array()})
     }
    try {
        const product =await Product.findById(req.body.id)
        if(!product){
            return next({error:'',code:404,msg:'product was not found.'})
         }
         if(!req.session.cart){
            return next({error:'cart was not set',code:500,msg:'error with the server please try again later.'})
          }
        let item =req.session.cart.items.get(req.body.id);
        if(!item){req.session.cart.items.set(req.body.id,0);item=0;};
        item+=req.body.number;
        req.session.cart.items.set(req.body.id,item);
        const discount =await Discount.findById(product.discount)
        if(discount){
            if(item>=discount.number){
               req.session.cart.totalPrice+=product.price*item-(product.price*item*discount.discount);
            }
       }
       else{req.session.cart.totalPrice+=product.price*item}
        return res.status(204);

    } catch (error) {
        next({error:error,code:500,msg:'data base error.'})
    } 
}

//getting discounts
const getDiscount =async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    const errors =validationResult(req);
    if(!errors.isEmpty()){
        return next({error:'',code:401,msg:errors.array()})
     }
    try {
        const discounts =await Discount.find();
        return res.status(200).json({discounts:discounts})
        
    } catch (error) {
        next({error:error,code:500,msg:'data base error.'})
        
    }

}

//modifying and removing item from cart
const modifyingItem =(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    
}

//cash out 
const cashOut =async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    const cart =req.session.cart;
    const casher =req.session.casher;
    if(!casher){
        return next({error:'casher was not logged in',code:500,msg:'please log in'})

     }
    if(!cart){
        return next({error:'cart was not set',code:500,msg:'error with the server please try again later.'})
     }
    try {
        await cart.save();
        if(cart.returned){
            casher.returns.push(cart._id);
            casher.total-=cart.totalPrice;
        }
        
        else{casher.carts.push(cart._id);
            casher.total+=cart.totalPrice;
        }
        await casher.save();

        
    } catch (error) {
        next({error:error,code:500,msg:'server error'});
    } 
}

//return item
const returnItem =async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    try {
        const cart=await Cart.findById(req.body.id);
        if(!cart){
          return  next({error:'',code:404,msg:'cart was not found!'})
         }
        if(cart.returned){
          return  next({error:'',code:404,msg:'cart was returned!'})
        }
        cart.returned=true; 
        req.session.cart=cart;
        return res.status(200).json({cart:cart});
    } catch (error) {
        next({error:error,code:500,msg:'server error'});

    }
}


const ex ={
    login:login,
    logout:logout,
    getProductSearch:getProductSearch,
    getProductInfo:getProductInfo,
    addingToCart:addingToCart,
    getDiscount:getDiscount,
    modifyingItem:modifyingItem,
    cashOut:cashOut,
    returnItem:returnItem
}

export default ex