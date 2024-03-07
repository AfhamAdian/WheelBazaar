const express = require('express');
const path = require('path');
const oracledb = require('oracledb');
const { execute } = require('../../DB/dbConnect.js');

const signUpRouter = express.Router();

signUpRouter
    .route('/')
    .post(async(req,res)=>{
        const { name, email, phone, password } = req.body;
        const check_sql = `
            SELECT check_signup_criteria(:email,:phone) AS CSC FROM DUAL
        `
        const check_binds = {
            email: email,
            phone: phone
        }
        const check = await execute(check_sql,check_binds);
        if(check[0].CSC == 0) {
            const sql = `
                BEGIN
                    signup(:name,:email,:phone,:password);
                END;
            `
            const binds = {
                name: name,
                email: email,
                phone: phone,
                password: password
            }
            await execute(sql,binds);
            res.json({message:"success"});
        }
        if(check[0].CSC == 1) {
            res.json({message: "email"});
        }
        if(check[0].CSC == 2) {
            res.json({message: "phone"});
        }
    })


module.exports = signUpRouter;