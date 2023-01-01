const express = require('express');
const router = express.Router();
const con = require('../config/dbconfig');
const sendEmail =require('../config/email');
const bcrypt = require("bcrypt");
const {managerAuth} = require('../middlewares/authentication');
const dotenv = require("dotenv");
dotenv.config();



////
router.use(managerAuth);



//////////////////////////////////////////get routes

router.get("/",(req,res)=>{

    res.render("manager/managerindex");
  });

  router.get("/addproducts",(req,res)=>{
    con.query("Select * from supplier",(err,results)=>{
      if(err){
        console.log(err);
        res.redirect("/");
      }else{
        res.render("manager/addprod",{suppliers:results});
      }
    })
  
  });
  
  router.get("/proddetails",(req,res)=>{
    con.query("Select * from product",(err,results)=>{
      if(err){
        console.log(err);
        res.redirect("");
      }else{
        res.render("manager/proddetails",{products:results});
      }
    })
  });
  
  router.get("/proddetails/:id/view",(req,res)=>{
    con.query(`select * from product left join supplier on product.su_id=supplier.su_id where p_id=${req.params.id}`,(e,result)=>{
      if(e) console.log(e);
      else{
        res.render("manager/prodview",{result:result});
      }
    })
  });
  router.get("/proddetails/:id/modify",(req,res)=>{
    con.query(`select * from supplier`,(e,suppliers)=>{
      if(e) console.log(e);
      else{
        con.query(`select * from product left join supplier on product.su_id=supplier.su_id where p_id=${req.params.id}`,(er,result)=>{
          if(er) console.log(er);
          else{
            console.log(result)
            res.render("manager/prodmodify",{results:result,suppliers:suppliers});
          }
        })
      }
    })
    
  });
  
  router.get("/supdetails",(req,res)=>{
    con.query("Select * from supplier",(err,results)=>{
      if(err){
        console.log(err);
        res.redirect("/");
      }else{
        res.render("manager/supdetails",{suppliers:results});
      }
    })
  });
  
  router.get("/supdetails/:id/view",(req,res)=>{
    con.query(`select * from product right join (select * from supplier where supplier.su_id=${req.params.id}) as supplier on product.su_id=supplier.su_id ;`,
    (e,result)=>{
      if(e) console.log(e);
      else{
        res.render("manager/supview",{result:result});
      }
    })
  });
  router.get("/supdetails/:id/modify",(req,res)=>{
    con.query(`select * from supplier where su_id=${req.params.id}`,(e,supplier)=>{
      if(e) console.log(e);
      else{
            res.render("manager/supmodify",{supplier:supplier});
          }
        })
      })
  
  
  router.get("/opentender",(req,res)=>{
    con.query("select p_id,p_name from product",(err,result)=>{
      if(err) console.log(err);
      else{
        con.query("select count(su_id) as count from supplier",(e,count)=>{
          if(e) console.log(e);
          else{
            console.log(result);
            res.render("manager/opentender",{products:result,count:count.count})
          }
        })
      }
    })
  
  });
  
  
  router.get("/tender/details",(req,res)=>{
    con.query("Select * from tenders",(err,tenders)=>{
      if(err) console.log(err);
      else{
        res.render("manager/tenderdet",{tenders});
      }
    })
  })
  
  router.get("/tender/:id/details",(req,res)=>{
    console.log(req.params.id)
    con.query("Select * from tenders natural join t_products natural join product where t_id= ? ",[Number(req.params.id)],(err,tender)=>{
      if(err) console.log(err);
      else{
        con.query("Select * from supplier left join t_supplier on supplier.su_id=t_supplier.su_id where t_id=?",[Number(req.params.id)],(error,suppliers)=>{
          if(error) console.log(error);
          else{
            con.query("Select * from supplier where su_id not in(select su_id from t_supplier)",[Number(req.params.id)],(errr,suppliers2)=>{
              if(errr) console.log(error);
              else{
                res.render("manager/managertender",{tender,suppliers,suppliers2});
              }
            })
  
          }
        })
  
      }
    })
  })
  
  router.get("/tender/:id/results",(req,res)=>{
    con.query("Select * from tenders where t_id=?",[Number(req.params.id)],(e,tender)=>{
      if(e) console.log(e);
      else{
        con.query(`Select suppliers.su_id,su_name,product.p_id,p_name,p_mrp,cost,pc_perunit from product inner join (Select supplier.su_id,su_name,p_id,cost from ternary inner join supplier on ternary.su_id=supplier.su_id where t_id=${Number(req.params.id)}) as suppliers on suppliers.p_id=product.p_id order by product.p_id,cost;
        `,(err,result)=>{
           if(err) console.log(err);
           else{
             res.render("manager/tenderselect",{tender,result});
           }
         })
      }
    })
    
  })
  
  /////////////////////////////////////////post routes
  
  router.post("/addsup/single",(req,res)=>{
    const password=req.body.password;
    const email=req.body.email;
    const username = req.body.username;
    bcrypt.hash(password,10)
    .then(h=>{
      new Promise((resolve,reject)=>{
        con.query(`insert into supplier(su_name,su_address,su_email,su_mobileno) values(?) `,[[req.body.name,req.body.address,email,
          Number(req.body.mobileno)]]
        ,(err,result)=>{
          if(err) {
            reject(err)
          }else{
            resolve(result.insertId);
          }
        })
      })
      .then(id=>{
          new Promise((resolve,reject)=>{
            con.query(`insert into suplogin values('${username}','${h}',${id})`,(error,result)=>{
              if(error) reject(error);
              else{
                resolve(result);
              }
            })
          })
          .then(async result=>{
            html=`<h4>Hola! Dope market is a new kind of market  with unique shopping experience.</h4>
            <br>
            <h5>These are your credentails for logging into Dope market tender account and participate in the tender and be a part of our organization.</h5>
            <div>
             <h4> Username: ${username}</h4>
            </div>
            <div>
              <h4>Password: ${password}</h4>
            </div>
            
            <h5>Meet you at : <a href="https://www.google.com">Tender account Login</a></h5>
            <div>© 2020 DOPE MARKET. All rights reserved.</div>
            `
            await sendEmail(to=email,subject="Credentials for Dope Market Tender account",html)    //transactional stream!!
            res.redirect("/manager/")
          })
          .catch(e=>{
            console.log(e);
            res.redirect("/manager");
          })
          
      })
      .catch(e=>{
        console.log(e);
        res.redirect("/manager");
      })
      
  
    })
    .catch(e=>{
      console.log(e);
      res.redirect("/manager")
    })
    
  })
  
  router.post("/addproducts",(req,res)=>{
      con.query("insert into product(p_name,p_mrp,min_qty,status) values(?)",
      [[req.body.name,Number(req.body.mrp),Number(req.body.qty),'low']],(err,results)=>{
        if(err) {
          console.log(err);
          res.redirect("/manager/addproducts");
        }else{
          res.redirect("/manager");
        }
  
      })
  });
  
  
  router.patch("/proddetails/:id/modify",(req,res)=>{
    con.query("Update product set p_name=?,p_mrp=?,min_qty=?,su_id=?,pc_perunit=? where p_id=?",
    [req.body.name,Number(req.body.mrp),Number(req.body.qty),Number(req.body.sid),Number(req.body.pcp),Number(req.params.id)],(e,results)=>{
      if(e) console.log(e);
      else{
        res.redirect("/manager/proddetails/"+req.params.id+"/view");
      }
    })
  })
  
  
  router.delete("/proddetails/:id/delete",(req,res)=>{
    con.query("Delete from product where p_id=?",
    [req.params.id],(e,results)=>{
      if(e) console.log(e);
      else{
        res.redirect("/manager/proddetails");
      }
    })
  })
  
  router.patch("/supdetails/:id/modify",(req,res)=>{
    con.query("Update supplier set su_name=?,su_mobileno=?,su_email=?,su_address=? where su_id=?",
    [req.body.name,Number(req.body.mobileno),req.body.email,req.body.address,req.params.id],async (err,result)=>{
      if(err) console.log(err);
      else{
        if(req.body.username){
            const hash = await bcrypt.hash(req.body.password,10);
            con.query("Update suplogin set username=?,password=? where su_id=?",[req.body.username,hash,req.params.id],(e,r)=>{
              if(e) console.log(e);
              else{
               console.log("updated!")
              }
            })
        }
        res.redirect("/manager/supdetails/"+req.params.id+"/view");
      }
    })
  })
  
  
  router.delete("/supdetails/:id/delete",(req,res)=>{
   con.query(`Delete from supplier where su_id=${req.params.id}`,(e,result)=>{
     res.redirect("/manager/supdetails");
   })
  })
  
  router.post("/opentender",(req,res)=>{
    con.query("insert into tenders(t_name,t_opentime,t_closetime,t_status) values(?)",
    [[req.body.name,req.body.sd+" "+req.body.st+":00",req.body.ed+" "+req.body.et+":00","upcoming"]],(e,results)=>{
        if(e) console.log(e);
        else{
          let tid=results.insertId;
          let array=[];
          for(let x in req.body.products){
            array[x]=[tid,Number(req.body.products[x])];
          }
          con.query("insert into t_products(t_id,p_id) values ?",[array],(error,result)=>{
            if(error) console.log(error);
            else{
              con.query("select su_email,su_name from supplier",async (er,suppliers)=>{
                if(er) console.log(er);
                else{
                  for(x in suppliers){
                    await sendEmail(
                      to=suppliers[x].su_email,
                      subject="Opened a tender",
                      html=`Hi! ${suppliers[x].su_name}, we have opened a tender.
                      It will start at ${req.body.sd+" "+req.body.st} and will end at ${req.body.ed+" "+req.body.et}`
                    );
                  }
                  res.redirect("/manager/tender/details")
                }
              })
              
            }
          })
        }
    })
  })
  
  
  router.patch("/tender/:id/results",async (req,res)=>{
    const id= Number(req.params.id);
    const pid = Number(req.body.product);
    const sid = Number(req.body.supplier);
    const cost = Number(req.body.cost);
    //console.log(req.body)
    try{
      console.log("e1")
     const product = await new Promise((resolve,reject)=>{
        con.query("Select * from product left join supplier on supplier.su_id=product.su_id where p_id=?",[pid],async (e,p)=>{
          if(e) reject(e);
          else{
            if(p[0].su_id){
              await sendEmail(
                to=p[0].su_email,
                subject="Discontinue the contract",
                html=`<h4>We are sorry for discontinuing the contract of the supply of the product ${p[0].p_name}</h4>`
              )
            }
            resolve(p[0]);
          }
      })
    });
    console.log("e1")
    await new Promise((resolve,reject)=>{
      con.query("Update product set su_id=?,pc_perunit=? where p_id=?",[sid,cost,pid],(err,result)=>{
        if(err) reject(err);
        else{
          con.query("Select su_email from  supplier where su_id=?",[sid],async(erro,email)=>{
            if(erro) reject(erro);
            else{
              console.log("sending email to"+email[0].su_email)
              await sendEmail(
                to=email[0].su_email,
                subject="Signing the contract",
                html=`<h4>Congratulations!! You have won the tender for the supply of the product ${product.p_name}</h4>.`
              );
              resolve(1);
            }
          })
          }
        });
      });
    res.redirect("back");
    }catch(e){
      console.log(e);
    }
  })
  
  router.patch("/tender/:id/submit",(req,res)=>{
      con.query("Update tenders set t_status='selected' where t_id=?",[Number(req.params.id)],(er,t)=>{
        if(er) console.log(er)
        else{
          res.redirect("back")
        }
      });
  })







module.exports = router;