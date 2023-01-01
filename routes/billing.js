const express = require('express');
const router = express.Router();
const con = require('../config/dbconfig');
const departments={"admin":1,"managing":2,"billing":3,"inventory":4,"cleaning":5,"helper":6,"security":7};
const {billingAuth} = require('../middlewares/authentication');
const otpGenerator = require("otp-generator");

//////////////has twillio
/////

router.use(billingAuth);


/////get routes
router.get("/",(req,res)=>{
    res.render("billing/billindex");
  })
  
  router.get("/newcustomer",(req,res)=>{
    res.render("billing/newcustomer");
  })
  
  router.get("/newcustomer/:id/verify",(req,res)=>{
    con.query("Select c_mobileno from customer where c_id= ?",[Number(req.params.id)],(error,result)=>{
      if(error) console.log(error);
      else{
        res.render("billing/verify",{mobile:result[0].c_mobileno,id:req.params.id});
      }
    })
  })
  
  
  
  router.get("/oldcustomer/:id/verify",(req,res)=>{
    res.render("billing/oldcust",{id:req.params.id});
  })
  
  router.get("/newbill",(req,res)=>{
    con.query("select * from product",(error,products)=>{
      if(error) console.log(error);
      else{
        res.render("billing/newbill",{products});
      }
    })
  
   
  })
  
  router.get("/newbill/:id",(req,res)=>{
    con.query("select * from product ",(error,products)=>{
      if(error) console.log(error);
      else{
       con.query("Select * from customer where c_id=?",[Number(req.params.id)],(e,customer)=>{
         if(e) console.log(e);
         else{
          res.render("billing/newbillcust",{products,customer:customer[0]});
         }
       })
      }
    })
  
  })
  
  
  
  
  
  ////////post routes
  
  router.post("/",(req,res)=>{
    const otp = otpGenerator.generate(6,{alphabets:false,upperCase: false, specialChars: false});
    con.query("update customer set c_otp=? where c_mobileno=?",[otp,Number(req.body.mobile)],async (e,result)=>{
      if(e) console.log(e);
      else{
        if(result.affectedRows!=0){
          try{
            await client.messages.create({from:"+12565105586",to:`+91${req.body.mobile}`,body:`VERIFICATION OTP is ${otp}`});
           con.query("Select c_id from customer where c_mobileno=?",[Number(req.body.mobile)],async (error,result2)=>{
             if(error) console.log(error);
             else{
                res.redirect(`/billing/oldcustomer/${result2[0].c_id}/verify`);
             }
           })
          }catch(e){
            console.log(e);
            res.redirect("back");
          }
        
          
        }else{
          res.redirect("back");
        }
        
      }
    })
  })
  
  
  
  router.post("/oldcustomer/:id/verify",(req,res)=>{
    con.query("select c_otp from customer where c_id=?",[Number(req.params.id)],(e,result)=>{
      if(e) console.log(e);
      else{
        if(result[0].c_otp==req.body.key) res.redirect(`/billing/newbill/${req.params.id}`)
        else {
          res.redirect("back")
        }
      }
    })
  })
  router.post("/newcustomer",async (req,res)=>{
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false,alphabets:false });
    req.body.c[4]=Number(req.body.c[4]);
    req.body.c[3]=Number(req.body.c[3]);
    req.body.c[5]=Number(otp);
     con.query("insert into customer(c_name,c_gender,c_address,c_age,c_mobileno,c_otp) values(?)",
    [req.body.c],async(error,result)=>{
      if(error) console.log(error);
      else{
        const id=result.insertId;
       
        const number = Number(req.body.c[4]);
        try{
          const response = await client.messages.create({
            from:`+12565105586`,
            to:`+91${req.body.c[4]}`,                                          //sending out only indian numbers!! so country code is fixed!
            body:`VERIFICATION OTP:${otp} `
          })
        }catch(e){
          return console.log(e);
        }
        res.redirect(`/billing/newcustomer/${id}/verify`);
        
      }
    })
  });
  
  router.post("/newcustomer/:id/verify",(req,res)=>{
    con.query("Select c_otp from customer where c_id=?",[Number(req.params.id)],(e,result)=>{
       if(Number(req.body.key)!=Number(result[0].c_otp)) res.redirect("back");
       else{
         res.redirect(`/billing/newbill/${req.params.id}`);
       }
    })
  })
  
  router.patch("/newcustomer/:id/change",(req,res)=>{
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false,alphabets:false });
    con.query("Update customer set c_mobileno=?,c_otp=? where c_id=?",[Number(req.body.mobile),otp,Number(req.params.id)],async (err,result)=>{
      if(err) console.log(err);
      else{
        try{
        
          const response = await client.messages.create({
            from:`+12565105586`,
            to:`+91${req.body.mobile}`,                                          //sending out only indian numbers!! so country code is fixed!
            body:`VERIFICATION OTP:${otp} `
          })
        }catch(e){
          return console.log(e);
        }
        res.redirect(`/billing/newcustomer/${req.params.id}/verify`);
      }
    })
  })
  
  router.post("/newbill" ,async (req,res)=>{
    const userid=req.session.user.empid;
    //console.log(req.body);
    let productids=[];
    for(x in  Object.keys(req.body.p)){
     productids[x]=Number(Object.keys(req.body.p)[x].substring(1))
    }
  
    const productqtys = Object.values(req.body.q);
    console.log("pids",productids);
    console.log("pqty",productqtys)
   const amount = Number(req.body.amount);
   const famount = Number(req.body.famount);
   const mop = req.body.mop;
   
   
   try{
  let array2=[];
    const id = await new Promise((resolve,reject)=>{
        con.query("insert into transaction(final_amt,billed_amt,mop,emp_id) values(?)",[[famount,amount,mop,userid]],(e,result)=>{
          if(e) reject(e);
          else{
            const id = result.insertId;
            resolve(id);
          }
        })
      })
      await new Promise((resolve,reject)=>{
        let array=[];
        for(x in productids){
          array[x]=[id,Number(productids[x]),Number(productqtys[x])];
          console.log(array[x])
        }
        con.query("insert into transaction_prod(t_id,p_id,quantity) values ?",[array],(error,result)=>{
          if(error) reject(error);
          else{
            resolve(result);
          }
        })
      })
  
      await new Promise(async (resolve,reject)=>{
        for(x in productids){
          await new Promise((re,rj)=>{
            con.query(`Update product set stock_avail=stock_avail-${Number(productqtys[x])} where p_id=?`,[Number(productids[x])],(e,result)=>{
              if(e) rj(e);
              re(1);
            })
          })
        }
        resolve(1);
      })
      res.redirect("/billing");
    }catch(e){
      console.log(e);
      res.redirect("back");
    }
    
  
  });
  
  
  router.post("/newbill/:id" ,async (req,res)=>{
    const userid=req.session.user.empid;
    let productids=[];
    for(x in  Object.keys(req.body.p)){
     productids[x]=Number(Object.keys(req.body.p)[x].substring(1))
    }
    const productqtys = Object.values(req.body.q);
    const amount = Number(req.body.amount);
    const famount = Number(req.body.famount);
    const customerid = Number(req.params.id);
    const creds = Number(req.body.credits);
    const mop = req.body.mop;
    const points = (amount*5)/100;
    try{  
    const id = await new Promise((resolve,reject)=>{
        con.query("insert into transaction(final_amt,billed_amt,mop,emp_id,c_id) values(?)",[[famount,amount,mop,userid,customerid]],(e,result)=>{
          if(e) reject(e);
          else{
            const id = result.insertId;
            resolve(id);
          }
        })
      })
      await new Promise((resolve,reject)=>{
        let array=[];
        for(x in productids){
          array[x]=[id,Number(productids[x]),Number(productqtys[x])];
        }
        con.query("insert into transaction_prod(t_id,p_id,quantity) values ?",[array],(error,result)=>{
          if(error) reject(error);
          else{
            resolve(result);
          }
        })
      })
  
      await new Promise(async (resolve,reject)=>{
        for(x in productids){
          await new Promise((re,rj)=>{
            con.query(`Update product set stock_avail=stock_avail-${Number(productqtys[x])} where p_id=?`,[Number(productids[x])],(e,result)=>{
              if(e) rj(e);
              re(1);
            })
          })
        }
        resolve(1);
      })
  
        await new Promise((resolve,reject)=>{
              con.query("update customer set c_pts=c_pts+? where c_id= ? ",[points-creds,customerid],(err,result2)=>{
                if(err) reject(err);
                else{
                  resolve(1);
                }
              })
            })
    
      res.redirect("/billing");
    }catch(e){
      console.log(e);
      res.redirect("back");
    }
    
  
  });

  module.exports = router;