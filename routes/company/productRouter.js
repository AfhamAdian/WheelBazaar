const express = require('express');
const path = require('path');
const { authorizationCompany } = require('../../middlewares/authorization.js');
const { addCar } = require('../../controller/company/product.js');

const ProductRouter = express.Router();

ProductRouter
    .route('/')
    .post( authorizationCompany, async (req,res) =>
    {
        try{
            console.log('Company Home Route');
            const email = req.user.email;
            const password = req.user.password;

            user_info = await sendUserIdFromEmailPass( email, password );
            const company_id = user_info[0].ID;

            const { name, seat , engine, car_color, car_price ,l_date, car_stock, car_warranty, comp_id , url, typ_id , v_id } = req.body;

            const addCar = await addCar( name, seat , engine, car_color, car_price ,l_date, car_stock, car_warranty, comp_id , url, typ_id , v_id );
        }catch(err){
            console.log(err);
        }
    });

module.exports = ProductRouter;