const express = require('express');
const path = require('path');
const { authorizationCompany } = require('../middlewares/authorization.js');
const { sendUserIdFromEmailPass,sendUserDataByIdGeneral } = require('../controller/logIn.js');
const { updateStateWithId ,getShowrooms,getCarTypes , filterShowrooms , getOrderlistByCompanyId } = require('../controller/company.js');
const { execute } = require('../DB/dbConnect.js');

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

let company_info,user_info,car_types;

companyHomeRouter
        .route('/')
        .get( authorizationCompany, async (req,res) =>
        {
            try{
                console.log('Company Home Route');
                const email = req.user.email;
                const password = req.user.password;

                user_info = await sendUserIdFromEmailPass( email, password );
                const company_id = user_info[0].ID;
                console.log( 'logged in company id : ' + company_id );

                company_info = await sendUserDataByIdGeneral( company_id );
                console.log( company_info );

                const ct_sql="SELECT TYPE_NAME,CAR_TYPE_URL FROM CARTYPE";
                car_types = await execute(ct_sql,{})

                res.render('companyHome',{company_info: company_info, authorized: "true", user:"company", user_info: user_info , car_types: car_types});
            }catch(err){
                console.log(err);
            }
        });

companyHomeRouter
        .route('/ship')
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
        .post(async (req,res) =>
        {
            const id = req.body.orderId;
            const state = 'SHIPPING';
            const result = await updateStateWithId( state, id );
            res.json({message : "ok"})
        })

companyHomeRouter
        .route('/delivered')
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
        .post( async (req,res) =>
        {
            const id = req.body.orderId;
            const state = 'DELIVERED';

            const result = await updateStateWithId( state, id );
            res.json({message : "ok"})
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
companyHomeRouter
        .route('/showrooms')
        .get(authorizationCompany,async(req,res)=> {
            const showrooms = await getShowrooms();
            user_info = await sendUserIdFromEmailPass( req.user.email, req.user.password );
            company_info = await sendUserDataByIdGeneral( user_info[0].ID );
            car_types = await getCarTypes();
            res.render('showroom',{company_info: company_info, authorized: "true", user:"company", user_info: user_info , car_types: car_types,showrooms: showrooms})
        })
        .post(async(req,res)=>{
            const {
                division,
                city
            } = req.body;
            const showrooms = await filterShowrooms(division,city);
            res.json(showrooms);
        })
companyHomeRouter
        .route('/orders')
        .get(authorizationCompany,async(req,res)=>{
            user_id = await sendUserIdFromEmailPass(req.user.email,req.user.password)
            company_info = await sendUserDataByIdGeneral( user_id[0].ID );
            const orderlist = await getOrderlistByCompanyId(user_id[0].ID);
            car_types = await getCarTypes();
            res.render('companyOrder',{company_info: company_info, authorized: "true", user:"company", car_types: car_types , orderlist:orderlist})
        })
        .post(async(req,res)=>{

        })





module.exports = companyHomeRouter;