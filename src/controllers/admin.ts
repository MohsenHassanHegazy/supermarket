import express, {request} from 'express';
import {Casher} from '../models/casher'
import { Product } from '../models/product';
import { Sales } from '../models/sales';
import { DaySales,IdaySales } from '../models/day_sales';
import { Discount } from '../models/discounts';
import { ValidationError, validationResult } from 'express-validator';


//start a new day
const newDay =async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    const errors =validationResult(req);

    if(!errors.isEmpty()){
        return next({error:'',code:401,msg:errors.array()});
     }
     const drawers=[];
     for(let i =0;i<req.body.drawerscount;i++){
        drawers.push({
            carts:[],
            returns:[],
            totalPrice:req.body.drawers[i].totalPrice,
            casher:req.body.drawers[i].casher
         })
      }
     const day=new DaySales({
        ongoing:true,
        drawerscount:req.body.drawerscount,
        drawers:drawers,
        date:new Date(Date.now())
     })
     try{
        await day.save();
        return res.status(200).json({msg:'day started',day:{...day._doc}})
      }
     catch(err){
        return next({error:err,code:500,msg:'day was not started'})
     }

 }

 //end the day
 const endDay =async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    let day:any =await DaySales.findOne({ongoing:true});
    if(!day){
        return next({error:'',code:404,msg:'day was not started.'})
     }
    try{
        console.log(day);
        day.ongoing=false;
        await day.save();
        return res.status(200).json({msg:'day ended.',day:day})
     }
    catch(err){
        next({error:err,code:500,msg:'day was not ended.'})
     }
 }




//adding newCasher
const newCasher =async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    const errors =validationResult(req);

    if(!errors.isEmpty()){
        return next({error:'',code:401,msg:errors.array()});
     }
    const casher =new Casher({
        name:req.body.name,
        password:req.body.password,
        total:0,
        carts:[]
     })
    try{
        await casher.save();
        return res.status(201).json({...casher._doc})
     }
    catch(err){
       next({error:err,code:500,msg:'an error occurred and the casher was not added.'})
      } 
};

//removing casher
const removingCasher =async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    const errors =validationResult(req);

    if(!errors.isEmpty()){
        return next({error:'',code:401,msg:errors.array()});
     }
    const casher =await Casher.findById(req.body.id);
    try{
        await Casher.deleteOne({_id:req.body.id});
        return res.status(200).json('casher deleted.');
     }
     catch(error){
            if(!casher){next({error:error,code:500,msg:'casher was not found.'})}
            else next({error:error,code:500,msg:'an error occurred and the casher was not removed.'})
     }
};

//adding product
const addingProduct =async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    const errors =validationResult(req);

    if(!errors.isEmpty()){
        return next({error:'',code:401,msg:errors.array()});
     }
    let id=req.body.id;
    if(!id){
        id=await Product.countDocuments();
        id++;
     }
     else{
        
      }
    const product =new Product({
        name:req.body.name,
        price:req.body.price,
        amount:req.body.amount,
        discount:req.body.discount,
        _id:id
     })
    try{
        await product.save();
        return res.status(201).json({msg:'product added',product:{...product._doc}})
     }
    catch(error){
        next({error:error,code:500,msg:'an error occurred and the product was not added.'});
    } 
};

//removing or modifying product 
const modifyingProduct =async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    const errors =validationResult(req);

    if(!errors.isEmpty()){
        return next({error:'',code:401,msg:errors.array()});
     }
    const product =await Product.findById(req.body.id);
    if(!product){
        return res.status(404).json('product was not found.')
     }
    try{
        if(req.body.reqtype==='removing'){
            await Product.deleteOne({_id:req.body.id});
            return res.status(200).json('product was deleted')
         }
        else if(req.body.reqtype==='modifying'){

            product.name=req.body.name?req.body.name: product.name;
            product.price=req.body.price?req.body.price: product.price;
            product.amount=req.body.amount?req.body.amount: product.amount;
            product.discount=req.body.discount?req.body.discount: product.discount;
            await product.save();
            return res.status(200).json({msg:'product was modified',product:{...product._doc}})
              
         }
     }
    catch(error){
        next({error:error,code:500,msg:'an error occurred and the product was modified.'});
    }
};

//getting casher info
const getCasher =async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    const errors =validationResult(req);

    if(!errors.isEmpty()){
        return next({error:'',code:401,msg:errors.array()});
     }
    let casher;
    try {
         casher =await Casher.findById(req.params.id);
         if(!casher){
           return next({error:'error',code:404,msg:'casher not found.'});
          }
         return res.status(200).json({...casher._doc})
    }
    catch(error){
        next({error:error,code:500,msg:'server error casher was not sent.'});
    }
};

//getting today sales info
const getDaySales =async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    const errors =validationResult(req);

    if(!errors.isEmpty()){
        return next({error:'',code:401,msg:errors.array()});
     }
    let daySales;
    try {
        daySales =await DaySales.findOne({date:req.params.date});
         if(!daySales){
            return res.status(404).json('daySales not found.')
          }
         return res.status(200).json({...daySales._doc})
    }
    catch(error){
        next({error:error,code:500,msg:'server error daySales was not sent.'});
    }
};


//getting all sales
const getSales =async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    const errors =validationResult(req);

    if(!errors.isEmpty()){
        return next({error:'',code:401,msg:errors.array()});
     }
    let sales;
    try {
        sales =await Sales.findById(req.params.id);
         if(!sales){
            return res.status(404).json('Sales not found.')
          }
         return res.status(200).json({...sales._doc})
    }
    catch(error){
        next({error:error,code:500,msg:'server error sales was not sent.'});
    }
};

//adding discounts 
const addDiscounts =async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    const errors =validationResult(req);

    if(!errors.isEmpty()){
        return next({error:'',code:401,msg:errors.array()});
     }
        let product;
        try {
            product=await Product.findById(req.body.id)
            if(!product){
                return res.status(404).json('product was not found')
             }
            const discount =new Discount({
                item:product._id,
                number:req.body.number,
                discount:req.body.discount
             })
             await discount.save();
             product.discount=discount;
             await product.save();
             return res.status(201).json({msg:'discount added successfully.',product:{...product._doc},discount:{...discount._doc}})
        } catch (error) {
        next({error:error,code:500,msg:'server error discount was not added.'});
        }

};

//removing or modifying discounts
const modifyingDiscount  =async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    const errors =validationResult(req);

    if(!errors.isEmpty()){
        return next({error:'',code:401,msg:errors.array()});
     }
    const discount =await Discount.findById(req.body.id);
    if(!discount){
        return next({error:'',code:404,msg:'discount was not found.'})}
    try{
        if(req.body.reqtype==='removing'){
            await Discount.findByIdAndDelete(req.body.id);
            return res.status(200).json({msg:'discount was removed.'})   
        }
        else if(req.body.reqtype==='modifying'){
            discount.number=req.body.number?req.body.number:discount.number;
            discount.discount=req.body.discount?req.body.discount:discount.discount;
            await discount.save();
            return res.status(201).json({msg:'discount was modified.',discount:{...discount._doc}})
         }   
        }    
    catch(error){
        next({error:error,code:500,msg:'modifying failed.'})
     }
};


const ex ={
    newDay:newDay,
    endDay:endDay,
    newCasher:newCasher,
    removingCasher:removingCasher,
    addingProduct:addingProduct,
    modifyingProduct:modifyingProduct,
    getCasher:getCasher,
    getDaySales:getDaySales,
    getSales:getSales,
    addDiscounts:addDiscounts,
    modifyingDiscount:modifyingDiscount
 }

export default ex