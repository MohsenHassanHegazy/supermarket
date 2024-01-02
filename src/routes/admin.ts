import express from "express"
import {body} from "express-validator"
import controler from "../controllers/admin"

const router =express.Router();

router.post('/newDay',controler.newDay);

router.post('/endDay',controler.endDay);


router.post('/newCasher',[
    body('name')
    .notEmpty(),
    body('password')
    .notEmpty()
    .isLength({min:5})
],controler.newCasher);

router.delete('/deleteCasher',
    body('id')
    .notEmpty()
,controler.removingCasher);

router.post('/addProduct',[
    body('id')
    .notEmpty()
    .isNumeric(),
    body('name')
        .notEmpty(),
    body('price')
        .notEmpty()
        .isNumeric(),
    body('amount')
        .notEmpty()        
],controler.addingProduct);

router.put('/modifyingProduct',[
    body('reqtype')
    .notEmpty()
    .equals('removing'||'modifying'),
    body('name')
        .notEmpty(),
    body('price')
        .notEmpty()
        .isNumeric(),
    body('amount')
        .notEmpty()        
],controler.modifyingProduct);

router.get('/casher/:id',controler.getCasher);

router.get('/daySales/:date',controler.getDaySales);

router.get('/sales/:id',controler.getSales);

router.post('/addingDiscount',[
    body('id')
        .notEmpty(),
    body('number')
        .notEmpty()
        .isNumeric(),
    body('discount')
        .notEmpty()
        .isNumeric()    
],controler.addDiscounts);

router.put('/modifyingDiscount',[
    body('reqtype')
        .notEmpty()
        .equals('removing'||'modifying'),
    body('id')
        .notEmpty(),
    body('number')
        .notEmpty()
        .isNumeric(),
    body('discount')
        .notEmpty()
        .isNumeric()    
],controler.modifyingDiscount);






export default router;
