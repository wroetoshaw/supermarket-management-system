
const express = require('express');
const router = express.Router();
const con = require('../config/dbconfig');
const bcrypt = require("bcrypt");
const departments={"admin":1,"managing":2,"billing":3,"inventory":4,"cleaning":5,"helper":6,"security":7};


router.get("/",(req,res)=>{
    res.render("auth/landing");
 });
 //
 router.get("/register",(req,res)=>{
   res.render("auth/register");
 
 });
 
 router.get("/login",(req,res)=>{
     res.render("auth/login");
   });

 router.get("/supplier/login",(req,res)=>{
     res.render("auth/suplogin");
   });
  
  router.get("/landing",(req,res)=>{
    res.render("auth/landing");
  });
 

 
 
 router.get("/logout",(req,res)=>{
   req.session.destroy((err)=>{
     if(err) console.log(err);
 
   });
   res.clearCookie("connect.sid");
   res.redirect("/");
 });
 
 
 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////auth post routes

  router.post("/register",(req,res)=>{
  bcrypt.hash(req.body.user.password,10,(e,hash)=>{
    con.query(`INSERT INTO login(username,password) VALUES('${req.body.user.username}','${hash}')`,req.body.user,(err,results)=>{
      if(err) console.log(err);
      else {
        console.log(results,results.affectedRows);
        req.session.user=req.body.user.username;
        req.user=req.body.user.username;
        res.redirect("/");
      }
    });
  });
});

 router.post("/login",(req,res)=>{
   con.query(`Select password from login where username='${req.body.username}'`,(err,results)=>{
     if(err) console.log(err);
     else{
     //``  console.log(results);
       if(results[0]){
         bcrypt.compare(req.body.password,results[0].password,(err,resp)=>{
           if(err) {
             console.log(err);
           }else {
             if(resp==true){
             con.query(`Select username,emp_id,d_name from (employee left join login on employee.emp_id=login.employee_id) natural join department  where username='${req.body.username}'`,(err,results)=>{
               req.session.user={
                 username:  results[0].username,
                 empid:results[0].emp_id,
                 role:results[0].d_name
               };
               if(results[0].d_name=="admin") res.redirect("/admin");
               else if(results[0].d_name=="managing") res.redirect("/manager");
               else if(results[0].d_name=="billing") res.redirect("/billing");
               else if(results[0].d_name=="inventory") res.redirect("/inventory");
             })
 
           }else{
             res.redirect("back");
           }
         }
       })
       }else{
         res.redirect("back");
       }
     }
   })
 });
 
 router.post("/supplier/login",(req,res)=>{
   con.query(`Select password from suplogin where username='${req.body.username}'`,(err,results)=>{
     if(err) console.log(err);
     else{
     //``  console.log(results);
       if(results[0]){
         bcrypt.compare(req.body.password,results[0].password,(er,resp)=>{
           if(er) {
             console.log(er);
           }else {
             if(resp==true){
             con.query(`Select username,su_id,su_name,su_email,su_mobileno from supplier natural join suplogin  where username='${req.body.username}'`,(err,results)=>{
               req.session.user={
                 username:  results[0].username,
                 sid:results[0].su_id,
                 name:results[0].su_name,
                 email:results[0].su_email,
                 mobileno:results[0].su_mobileno,
                 role:"supplier"
               };
               res.redirect("/supplier/tenders");
             })
 
           }else{
             res.redirect("back");
           }
         }
       })
       }else{
         res.redirect("back");
       }
     }
   })
 });

 module.exports = router;