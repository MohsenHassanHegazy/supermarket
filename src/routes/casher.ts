import express from "express"
import { body } from "express-validator";
import controler from "../controllers/casher"

const router =express.Router();

router.post('/login',[
    body('name')
        .notEmpty(),
    body('password')
        .notEmpty(),
    body('drawer')
        .notEmpty()
        .isNumeric()     
],controler.login)

router.post('/logout',controler.logout)

router.post('/search',[
    body('word')
        .notEmpty()
        .isLength({min:3})
],controler.getProductSearch)

router.post('/productInfo',[
    body('id')
        .notEmpty()
],controler.getProductInfo)

router.post('/addToCart',[
    body('id')
        .notEmpty(),
    body('number')
        .notEmpty()
        .isNumeric()
],controler.addingToCart)

router.get('/discounts',controler.getDiscount)

router.post('/cashOut',controler.cashOut)

router.post('/returnItem',[
    body('id')
        .notEmpty()
],controler.returnItem)






export default router;
