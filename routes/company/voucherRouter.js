const express = require('express');
const path = require('path');
const { authorizationCompany } = require('../../middlewares/authorization.js');
const { addVoucherForCarsFromCompany } = require('../../controller/voucher.js');

// Assuming __dirname is the 'route' directory
const routeDirectory = __dirname;
//console.log('Route Directory:', routeDirectory);

// Construct the absolute path to the 'view' directory
const viewDirectory = path.join(routeDirectory, '..', 'views');
//console.log('Absolute Path to View Directory:', viewDirectory);

// Construct the absolute path to the desired file in the 'view' directory
const filePathInView = path.join(viewDirectory, 'page1.html');
//console.log('Absolute Path to File in View Directory:', filePathInView);

const voucherRouter = express.Router();

voucherRouter
    .route('/')
    .post( authorizationCompany, async (req,res) =>
    {
        try{
            console.log('Company Home Route');
            const email = req.user.email;
            const password = req.user.password;

            user_info = await sendUserIdFromEmailPass( email, password );
            const company_id = user_info[0].ID;

            const { car_id_arr, name, discount, validity  } = req.body;

            const result = await addVoucherForCarsFromCompany( name, discount, validity, company_id, car_id_arr );

        }catch(err){
            console.log(err);
        }
    });

module.exports = companyHomeRouter;