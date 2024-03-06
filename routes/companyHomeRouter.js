const express = require('express');
const path = require('path');
const { authorizationCompany } = require('../middlewares/authorization.js');
const { sendUserIdFromEmailPass,sendUserDataByIdGeneral } = require('../controller/logIn.js');
const { updateStateWithId } = require('../controller/company.js');

// Assuming __dirname is the 'route' directory
const routeDirectory = __dirname;
//console.log('Route Directory:', routeDirectory);

// Construct the absolute path to the 'view' directory
const viewDirectory = path.join(routeDirectory, '..', 'views');
//console.log('Absolute Path to View Directory:', viewDirectory);

// Construct the absolute path to the desired file in the 'view' directory
const filePathInView = path.join(viewDirectory, 'page1.html');
//console.log('Absolute Path to File in View Directory:', filePathInView);


const companyHomeRouter = express.Router();

companyHomeRouter
        .route('/')
        .get( authorizationCompany, async (req,res) =>
        {
            try{
                console.log('Company Home Route');
                const email = req.user.email;
                const password = req.user.password;

                const user_info = await sendUserIdFromEmailPass( email, password );
                const company_id = user_info[0].ID;
                console.log( 'logged in company id : ' + company_id );

                const company_info = await sendUserDataByIdGeneral( company_id );
                console.log( company_info );

                res.render('companyHome',{company_info: company_info, authorized: "true", user:"company", user_info: user_info});
            }catch(err){
                console.log(err);
            }
        });

companyHomeRouter
        .route('/ship/:orderId')
        // dummy get request
        .get( authorizationCompany , async (req,res) =>
        {
            const email = req.user.email;
            const password = req.user.password;

            const user_info = await sendUserIdFromEmailPass( email, password );
            const company_id = user_info[0].ID;
            
            const id = req.params.orderId;
            const state = 'SHIPPING';

            const result = await updateStateWithId( state, id );
            res.status(200).json({ message: 'Order Shipped' });
        })
        .post( authorizationCompany , async (req,res) =>
        {
            const email = req.user.email;
            const password = req.user.password;

            const user_info = await sendUserIdFromEmailPass( email, password );
            const company_id = user_info[0].ID;
            
            const id = req.params.orderId;
            const state = 'SHIPPING';

            const result = await updateStateWithId( state, id );
        })

companyHomeRouter
        .route('/delivered/:orderId')
        // dummy get request
        .get( authorizationCompany , async (req,res) =>
        {
            const email = req.user.email;
            const password = req.user.password;

            const user_info = await sendUserIdFromEmailPass( email, password );
            const company_id = user_info[0].ID;
            
            const id = req.params.orderId;
            const state = 'DELIVERED';

            const result = await updateStateWithId( state, id );
            res.status(200).json({ message: 'Order delivered' });
        })
        .post( authorizationCompany , async (req,res) =>
        {
            const email = req.user.email;
            const password = req.user.password;

            const user_info = await sendUserIdFromEmailPass( email, password );
            const company_id = user_info[0].ID;
            
            const id = req.params.orderId;
            const state = 'DELIVERED';

            const result = await updateStateWithId( state, id );
        })

companyHomeRouter
        .route('/process/:orderId')
        // dummy get request
        .get( authorizationCompany , async (req,res) =>
        {
            const email = req.user.email;
            const password = req.user.password;

            const user_info = await sendUserIdFromEmailPass( email, password );
            const company_id = user_info[0].ID;
            
            const id = req.params.orderId;
            const state = 'PROCESSING';

            const result = await updateStateWithId( state, id );
            res.status(200).json({ message: 'Order IS IN PROCESSING' });
        })
        .post( authorizationCompany , async (req,res) =>
        {
            const email = req.user.email;
            const password = req.user.password;

            const user_info = await sendUserIdFromEmailPass( email, password );
            const company_id = user_info[0].ID;
            
            const id = req.params.orderId;
            const state = 'PROCESSING';

            const result = await updateStateWithId( state, id );
        })




module.exports = companyHomeRouter;