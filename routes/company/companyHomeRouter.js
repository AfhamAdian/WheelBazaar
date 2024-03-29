const express = require('express');
const path = require('path');
const { authorizationCompany } = require('../../middlewares/authorization.js');
const { sendUserIdFromEmailPass,sendUserDataByIdGeneral } = require('../../controller/logIn.js');
const { updateStateWithId ,getShowrooms,getCarTypes , filterShowrooms , getOrderlistByCompanyId ,getAllCars , is_valid_new_car , add_new_car ,get_orderlist_by_showroom , get_car_models_by_company , add_voucher, add_voucher2 , get_vouchers } = require('../../controller/company.js');
const { monthlySalesGraphGenerator,monthlySalesPieGenerator,salesInMonth, salesInYear } = require('../../controller/company/report.js');
const { execute } = require('../../DB/dbConnect.js');
const { DATE } = require('oracledb');

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

                //here i will send the necessary data in the frontend to render a graph
                
                const monthlySales = await monthlySalesGraphGenerator( company_id );
                console.log( monthlySales );
                //console.log( 'sales ' + monthlySales[0].ORDERDATE );

                let sales = [];
                let days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];

                for( let i = 0; i < days.length; i++ )
                {
                    let flag = 0;
                    for ( let j = 0; j < monthlySales.length; j++ )
                    {
                        let date =  new Date( monthlySales[j].ORDERDATE );
                        //console.log( date );
                        if( monthlySales[j].ORDERDATE == days[i] )
                        {
                            sales.push( monthlySales[j].COUNTCAR );
                            flag = 1;
                            break;
                        }
                    }
                    if( false == flag )
                    {
                        sales.push( 0 );
                    }
                }
                
                console.log( sales );
                console.log( days );

                ////////////// PIE chart /////////////////////
                
                const monthlySalesPie = await monthlySalesPieGenerator( company_id );
                console.log( monthlySalesPie );
                //console.log( 'sales ' + monthlySalesPie[0].TYPE );
                
                let carType = [];
                let carCount = [];

                for( let i = 0; i < monthlySalesPie.length; i++ )
                {
                    carType.push( monthlySalesPie[i].TYPE );
                    carCount.push( monthlySalesPie[i].COUNTCAR );
                }
                
                var backgroundColors = carType.map(function() {
                    return getRandomColor();
                });

                console.log( carType );
                console.log( carCount );
                console.log( backgroundColors );

                const salesInAMonth = await salesInMonth( company_id );

                const salesInAYear = await salesInYear( company_id );

                res.render('companyHome',{company_info: company_info, authorized: "true", user:"company", user_info: user_info, sales: sales, days: days, carType: carType, carCount: carCount, backgroundColors: backgroundColors, salesInAMonth: salesInAMonth, salesInAYear: salesInAYear });
            }catch(err){
                console.log(err);
            }
        });

        function getRandomColor() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }



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
            res.render('showroom',{company_info: company_info, authorized: "true", user:"company", user_info: user_info ,showrooms: showrooms})
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
            res.render('companyOrder',{company_info: company_info, authorized: "true", user:"company", orderlist:orderlist})
        })
        .post(async(req,res)=>{

        })
companyHomeRouter
        .route('/cars')
        .get(authorizationCompany,async(req,res)=>{
            user_id = await sendUserIdFromEmailPass(req.user.email,req.user.password)
            company_info = await sendUserDataByIdGeneral( user_id[0].ID );
            const cars = await getAllCars(company_info[0].ID);
            res.render('companyCars',{company_info: company_info, authorized: "true", user:"company", cars:cars })
        })
companyHomeRouter
        .route('/addCar')
        .get(authorizationCompany,async(req,res)=>{
            user_id = await sendUserIdFromEmailPass(req.user.email,req.user.password)
            company_info = await sendUserDataByIdGeneral( user_id[0].ID );
            car_types = await getCarTypes();
            res.render('addCar',{company_info:company_info,authorized:"true",user:"company",car_types:car_types})
        })
        .post(authorizationCompany,async(req,res)=>{
            user_id = await sendUserIdFromEmailPass(req.user.email,req.user.password)
            const {
                model_name,
                color,
                car_type,
                seat_cap,
                engine_cap,
                price,
                stock,
                warranty,
                launch_date,
                car_image_url
            } = req.body
            const check = await is_valid_new_car(user_id[0].ID,model_name,color)
            if(check == 0) {
                await add_new_car(model_name,color,car_type,seat_cap,engine_cap,price,stock,warranty,launch_date,car_image_url,user_id[0].ID)
                res.json({message: "ok"})
            }
            else {
                res.json({message : "duplicate"})
            }
        })
companyHomeRouter
        .route('/addVoucher')
        .get(authorizationCompany,async(req,res)=> {
            user_id = await sendUserIdFromEmailPass(req.user.email,req.user.password)
            company_info = await sendUserDataByIdGeneral( user_id[0].ID );
            const carModels = await get_car_models_by_company(user_id[0].ID)
            res.render('addVoucher',{company_info:company_info,authorized:"true",user:"company",carModels:carModels})
        })
        .post(authorizationCompany,async(req,res)=> {
            const {
                voucher_name,
                discount,
                validity_date
            } = req.body
            await add_voucher(voucher_name,discount,validity_date)
            res.json("ok")
        })
companyHomeRouter
        .route('/addVoucher2')
        .post(authorizationCompany,async(req,res)=>{
            var selectedModel = req.body.selectedModel
            await add_voucher2(selectedModel)
            res.json("ok")
        })
companyHomeRouter
        .route('/showroom/orders')
        .get(authorizationCompany,async(req,res)=> {
            var id = req.query.id
            user_id = await sendUserIdFromEmailPass(req.user.email,req.user.password)
            company_info = await sendUserDataByIdGeneral( user_id[0].ID );
            const orderlist = await get_orderlist_by_showroom(user_id[0].ID,id)
            res.render('showroomOrder',{company_info:company_info,authorized:"true",user:"company",orderlist:orderlist})
        })
companyHomeRouter
        .route('/vouchers')
        .get(authorizationCompany,async(req,res)=> {
            user_id = await sendUserIdFromEmailPass(req.user.email,req.user.password)
            company_info = await sendUserDataByIdGeneral( user_id[0].ID );
            const vouchers = await get_vouchers(user_id[0].ID)
            res.render('vouchers',{company_info:company_info,authorized:"true",user:"company",vouchers:vouchers})
        })

companyHomeRouter
        .route('/myinfo')
        .get(authorizationCompany,async(req,res)=> {
            user_id = await sendUserIdFromEmailPass(req.user.email,req.user.password)
            company_info = await sendUserDataByIdGeneral( user_id[0].ID );
            res.render('companyInfo',{user_info:company_info,authorized:"true",location:[{LOCATION_ID:0,COUNTRY:"",DIVISION:"",CITY:""}],company_info:company_info,user:"company"});
        })


companyHomeRouter.use('/voucher',require('./voucherRouter.js'));
companyHomeRouter.use('/addProduct',require('./productRouter.js'));
module.exports = companyHomeRouter;