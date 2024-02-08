const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const { execute } = require('../DB/dbConnect.js');
require('dotenv').config();

const { authUser,sendUserData,sendUserDataByUserName } = require('../controller/logIn.js');
const { updatePassword } = require('../controller/updatePassWord.js');
const authorization = require('../middlewares/authorization.js');

// Assuming __dirname is the 'route' directory
const routeDirectory = __dirname;
//console.log('Route Directory:', routeDirectory);

// Construct the absolute path to the 'view' directory
const viewDirectory = path.join(routeDirectory, '..', 'views');
//console.log('Absolute Path to View Directory:', viewDirectory);

// Construct the absolute path to the desired file in the 'view' directory
const filePathInView = path.join(viewDirectory, '');
//console.log('Absolute Path to File in View Directory:', filePathInView);


const loginRouter = express.Router();

loginRouter
    .route('/')

    .get( async(req,res) =>
    {
        // here we will render login.ejs page
        res.render('login',{authorized: "false"});
    })

    .post( async ( req, res ) => 
    {
        // here we will take login data from user and check if it is valid or not
        // if valid then redirect to home page
        // else show error message
        try{
            const {
                email,
                password
            } = req.body;

            console.log(email);
            console.log(password);

            const bool = await authUser( email, password );         // checks if user is valid or not
            // const result = await sendUserData( email, password );

            if( bool == true ){

                const payLoad = {
                    email: email,
                    password: password,
                }

                const accessToken = jwt.sign( payLoad, process.env.ACCESS_TOKEN_SECRET );    
                res.cookie('token', accessToken, { httpOnly: true , secure: false });
                res.cookie('isLoggedIn',true, { httpOnly: false , secure: false });
                res.json ( { message: 'Login successful' } );
            }
            else{
                res.json(  { message: 'Invalid Email or Password' } );
            }
        }catch(err){
            console.log(err);
        }
    })

    // here i will redirect to forgot password page
    // then use the updatePass.ejs page to get new password 
    // and update the password in database

loginRouter
    .route('/forgotPassword')
    // here we will send cookies in get request
    .get( async(req,res) =>
    {
        // res.cookie('username', 'abc', { maxAge: 900000, httpOnly: false });
        res.render('updatePass',{});
    })
    
    .post( async ( req, res ) =>
    {
        const {
            username,
            newPassword,
            confirmPassword
        } = req.body;

        const userCheck = await sendUserDataByUserName( username );

        if( userCheck.length == 0 ){
            res.josn('Invalid Username');
            return;
        }

        if( newPassword === confirmPassword ){
            const bool = await updatePassword( username, newPassword );
            if( bool == true ){
                res.json('Password Updated Successfully');
                res.cookie('isLoggedIn',true, { maxAge: 900000, httpOnly: false , secure: false });
            }
            else{
                res.json('Error! Try Again');
            }
        }

    })

loginRouter
    .route('/dashboard')
    .get( authorization, async (req,res) =>
    {
        const user = req.user;
        const sql="SELECT TYPE_NAME,CAR_TYPE_URL FROM CARTYPE";
        const sql2="SELECT NAME FROM USERS WHERE USER_TYPE = 'CO'";
        const car_types=await execute(sql,{});
        console.log(car_types);
        const company_names=await execute(sql2,{});
        console.log(company_names);
        res.render('index', {company_names:company_names,car_types:car_types,authorized: "true", user : user} );
    })

module.exports = loginRouter;