const express = require('express');
const router = express.Router();
const con = require('../config/dbconfig');
const departments={"admin":1,"managing":2,"billing":3,"inventory":4,"cleaning":5,"helper":6,"security":7};
const {supplierAuth} = require('../middlewares/authentication');

////
router.use(supplierAuth);

//////get routes
router.get("/tenders",(req,res)=>{
    con.query("select * from tenders where t_id not in (select t_id from t_supplier where su_id = ?)",[req.session.user.sid],(error,tenders)=>{
      if(error) console.log(error);
      else{
        res.render("supplier/suptenderdet",{tenders});
      }
    })
  })
  
  router.get("/tenders/:id/participate",(req,res)=>{
        con.query("select p_id,t_id,t_name,t_closetime,t_status,p_name,p_mrp from (select * from tenders where t_id=?) as tender natural join t_products natural join product",
        [Number(req.params.id)],(e,tender)=>{
          if(e) console.log(e);
          else{
           if(tender[0].t_status=="open"){
            res.render("supplier/supparticipate",{tender});
           }
          }
  })
  });
  
  router.get("/tenders/participated",(req,res)=>{
    con.query("select * from tenders where t_id in (select t_id from t_supplier where su_id =?)",[req.session.user.sid],
    (error,tenders)=>{
      if(error) console.log(error);
      else{
        res.render("supplier/suptenderpart",{tenders});
      }
    })
  })
  
  router.get("/tenders/:id/details",(req,res)=>{
          con.query("select * from (Select t_id,ternary.su_id,cost,p_mrp,p_name from ternary inner join product on ternary.p_id=product.p_id) as tender natural join tenders where t_id=? and su_id = ?",[Number(req.params.id),Number(req.session.user.sid)],
          (error,responses)=>{
              if(error) console.log(error);
              else{
                  res.render("supplier/suptender",{responses});
              }
          })
  })
  
  
  router.get("/tenders/:id/results",(req,res)=>{
   con.query("Select * from t_products natural join product where t_id=?",[Number(req.params.id)],(e,product)=>{{
     if(e) console.log(e);
     else{
       con.query("Select * from t_supplier where su_id=?",[req.session.user.sid],(error,check)=>{
        if(error) console.log(error);
        else{
          res.render("supplier/suptresults",{sid:req.session.user.sid,product,check});
        }
  
       })
       
     }
   }})
  });
  ////////////////post routes
  router.post("/tenders/:id/participate",(req,res)=>{
  
    const keys = Object.keys(req.body.p);        //if we give p[integers] then surely they become an arrya if they are continuous itnegersl
    const values = Object.values(req.body.p); 
    const su_id = Number(req.session.user.sid);
    let array=[];
    for(x in keys){
      array[x]=[Number(req.params.id),su_id,Number(keys[x].substring(1)),Number(values[x])];
    }
    con.query("insert into t_supplier(t_id,su_id) values(?)",[[Number(req.params.id),su_id]],(error,result)=>{
      if(error) console.log(error)
      else{
        con.query("Insert into ternary(t_id,su_id,p_id,cost) values ?",[array],(e,placed)=>{
          if(e) console.log(e);
          else{
            res.redirect("/supplier/tenders");
          }
        })
      }
     
    })
   
  
  });
  
  
  module.exports = router;