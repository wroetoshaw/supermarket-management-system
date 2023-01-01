const express = require('express');
const router = express.Router();
const con = require('../config/dbconfig');
const departments={"admin":1,"managing":2,"billing":3,"inventory":4,"cleaning":5,"helper":6,"security":7};
const {inventoryAuth} = require('../middlewares/authentication');
const sendEmail =require('../config/email');
const dotenv = require("dotenv");
dotenv.config();


/////

router.use(inventoryAuth);


//////////////get routes
router.get("/",(req,res)=>{
    con.query("select * from product where status='low'",(e,products)=>{
      if(e) console.log(e);
      else{
        res.render("inventory/inventoryindex",{products});
      }
  
    })
  })
  
  router.get("/receive",(req,res)=>{
    con.query("select * from product where status='ordered'",(e,products)=>{
      if(e) console.log(e);
      else{
        let obj={};
        let pids =[];
        for(x in products){
          pids[x]=products[x].p_id;
        }
       if(pids.length==0){
         return res.render("inventory/inventoryreceive",{products:[]})
       }
        con.query("Select qty from orders where p_id in (?) and date_received IS NULL",[pids],(er,qty)=>{
          if(er) console.log(er);
          else{
            for(x in qty){
              obj[pids[x]]=qty[x].qty;
            }
            console.log(obj)
            res.render("inventory/inventoryreceive",{products,obj});
          }
        })
        
      }
  
    })
  })
  
  
  router.get("/location",(req,res)=>{
    con.query("Select * from product where p_id not in (select p_id from location)",(e,products)=>{
      if(e) console.log(e);
      else{
        con.query("Select * from product natural join location",(er,plocation)=>{
          if(er) console.log(er);
          else{
            res.render("inventory/locationindex",{products,plocation});
  
          }
      });
      }
    });
  });
  
  
  
  /////post routes
  
  router.post("/",async (req,res)=>{
   try{
     console.log(Number(Object.values(req.body)[0]))
    await new Promise((resolve,reject)=>{
      con.query("INSERT into orders(p_id,emp_id,qty) values(?)",[[Number(Object.keys(req.body)[0]),req.session.user.empid,Number(Object.values(req.body)[0])]],
      (e,result)=>{
        if(e) reject(e);
        else{
          resolve(result);
        }
      })
    })
  
    await new Promise((resolve,reject)=>{
          con.query("update product set status='ordered' where p_id=?",[Number(Object.keys(req.body)[0])],
          (ee,result)=>{
        if(ee) reject(ee);
        else{
          resolve(result);
        }
      });
        });
  
      
    await new Promise((resolve,reject)=>{
      con.query("select su_email,p_name from supplier inner join product where p_id=?",[Number(Object.keys(req.body)[0])],
      async (e,result)=>{
        if(e) reject(e);
        else{
          console.log(result)
          await sendEmail(
            to=result[0].su_email,
            subject="ORDER FOR PRODUCT",
            html=`<h5>Please deliver the product: ${result[0].p_name} of quantity : ${Object.values(req.body)[0]} as soon as possible! </h5>`
          );
          resolve(1)
        }
      })
    })
   }catch(e){
     console.log(e);
     res.redirect("back");
   }
    res.redirect("back");
  
  })
  
  
  router.post("/receive",async (req,res)=>{
    console.log(req.body);
    try{
      await new Promise((resolve,reject)=>{
            con.query(`update product set status='ok',stock_avail=stock_avail+${Number(Object.values(req.body)[0])} where p_id=?`,[Number(Object.keys(req.body)[0])],
           (ee,result3)=>{
          if(ee) reject(ee);
          else{
            resolve(result3);
          }
        });
          });
  
      await new Promise((resolve,reject)=>{
        const a = new Date();
        let b,c;
        if(a.getDate()<10) b="0"+a.getDate();
        else b=a.getDate();
        if(a.getMonth()<10) c="0"+a.getMonth();
        else c=a.getMonth();
        con.query("update orders set date_received=? where p_id=?",[a.getFullYear()+"-"+c+"-"+b+" "+a.getHours()+":"+a.getMinutes()+":"+a.getSeconds(),
          Number(Object.keys(req.body)[0])],
        (e,result)=>{
          if(e) reject(e);
          else{
            resolve(result);
          }
        })
      })
      res.redirect("/inventory/receive");
    }catch(e){
      console.log(e);
      res.redirect("/inventory/receive");
    }
    
  })
  
  
  router.post("/location",(req,res)=>{
    console.log(req.body)
    const row = Number(Object.values(req.body)[1])
    const floor = Number(Object.values(req.body)[0])
    const column = Number(Object.values(req.body)[2])
    const rackno = Number(Object.values(req.body)[3])
    const pid = Number(Object.keys(req.body)[0].substring(1));
    console.log(floor,row,column,rackno,pid);
    con.query("insert into location(p_id,p_column,p_row,p_floor,p_rackno) values(?)",[[pid,column,row,floor,rackno]],(e,result)=>{
      if(e) console.log(e);
      else{
        res.redirect("/inventory/location");
      }
    })
  })
  
  
  router.patch("/location",(req,res)=>{
    console.log(req.body)
    const row = Number(Object.values(req.body)[1])
    const floor = Number(Object.values(req.body)[0])
    const column = Number(Object.values(req.body)[2])
    const rackno = Number(Object.values(req.body)[3])
    const pid = Number(Object.keys(req.body)[0].substring(1));
    console.log(floor,row,column,rackno,pid);
    con.query("update location set p_column=?,p_row=?,p_floor=?,p_rackno=? where p_id=?",[column,row,floor,rackno,pid],(e,result)=>{
      if(e) console.log(e);
      else{
        res.redirect("/inventory/location");
      }
    })
  })
  


module.exports = router;