const express = require('express');
const router = express.Router();
const con = require('../config/dbconfig');
const upload = require("../utils/multer.js");
const excelfile = require('read-excel-file/node');
const fs=require("fs");
const departments={"admin":1,"managing":2,"billing":3,"inventory":4,"cleaning":5,"helper":6,"security":7};
const {adminAuth} = require('../middlewares/authentication');
const bcrypt = require("bcrypt");

////
router.use(adminAuth);

///


router.get("/",(req,res)=>{
    res.render("admin/adminIndex")
  })

router.get("/empdetails",(req,res)=>{
    con.query("select * from employee left join login on employee.emp_id=login.employee_id",(e,result)=>{  //join use on!!!!!!
      if(e) console.log(e);
      else{
        res.render("admin/empdetails",{result:result});
      }
    })
  });
  router.get("/empdetails/:id/view",(req,res)=>{
    con.query(`select * from employee natural join department where emp_id=${req.params.id}`,(e,result)=>{
      if(e) console.log(e);
      else{
        res.render("admin/empview",{result:result});
      }
    })
  });
  router.get("/empdetails/:id/modify",(req,res)=>{
    con.query(`select * from employee left join login on employee.emp_id=login.employee_id where emp_id=${req.params.id}`,(e,result)=>{
      if(e) console.log(e);
      else{
  
        res.render("admin/empmodify",{result:result});
      }
    })
  });
  router.get("/empdetails/:id/addcreds",(req,res)=>{
    con.query(`select * from employee where emp_id=${req.params.id}`,(e,result)=>{
      if(e) console.log(e);
      else{
        res.render("admin/empaddcreds",{result:result});
      }
    })
  });
  
  router.get("/transactions",(req,res)=>{
    con.query("select * from transaction natural join customer",(e,result)=>{
      if(e) console.log(e);
      else{
        res.render("admin/transactions",{result});
      }
    })
  })
  
  
  
  router.get("/transactions/:id",(req,res)=>{
    con.query("select * from transaction_prod natural join product where t_id=?",[Number(req.params.id)],(e,result)=>{
      if(e) console.log(e);
      else{
        res.render("admin/tproducts",{result});
      }
    })
  })
  
  router.get("/customer",(req,res)=>{
    con.query("select * from customer",(e,result)=>{
      if(e) console.log(e);
      else{
        console.log(result)
        res.render("admin/customers",{result});
      }
    })
  })

  //////////////////////////////////////////////////////////// post routes
router.post("/addemp/single",async (req,res)=>{
    con.query(`insert into employee(emp_name,emp_age,emp_gender,salary,emp_address,emp_mobileno,d_id) values('${req.body.name}',
    '${req.body.age}','${req.body.gender}','${req.body.salary}','${req.body.address}','${req.body.mobileno}',
    '${departments[req.body.dept]}')`,(e,result)=>{
      if(e) console.log(e);
      else{
        res.redirect("/admin/empdetails");
      }
    })
});

router.post("/addemp/multiple",upload.single('excelfile'),async (req,res)=>{
  await new Promise((resolve,reject)=>{
    con.query("select * from department",(e,result)=>{
         if(e) console.log(e);
         else{
           let dept={};
           for (x of result){
             dept[x.d_name]=x.d_id;
           }
           resolve(dept);
         }
       })
  })
  .then((dept)=>{
   excelfile("./uploads/"+req.file.filename)
   .then(rows=>{
     let array =[]
     for (x in rows){
       if(x!=0){
         array[x-1]=[rows[x][0],rows[x][1],rows[x][2],rows[x][3],rows[x][4],rows[x][5],dept[rows[x][6]]];
       }
     }
     con.query("insert into employee(emp_name,emp_age,emp_gender,salary,emp_address,emp_mobileno,d_id) values ?",[array],(e,result)=>{
       if(e) console.log(e);
       else{
         res.redirect("/admin/empdetails");
         fs.unlink("../uploads/"+req.file.filename,(e)=>{
           if(e) console.log(e);
         });
       }
     })
   })
  })
  .catch(e=>{
    console.log(e);
    res.redirect("/");
  })
});


router.post("/empdetails/:id/addcreds",async (req,res)=>{
    await bcrypt.hash(req.body.password,10)
                .then(hash=>{
                 con.query(`insert into login(username,password,employee_id) values('${req.body.username}','${hash}',${req.params.id})`,
                 (e,result)=>{
                   if(e) console.log(e);
                   else{
                     res.redirect("/admin/empdetails");
                   }
                 })
                })
                .catch(err=>{
                  console.log(err)
                })
    });

router.patch("/empdetails/:id/modify",async (req,res)=>{
    con.query(`Update employee set emp_name=?,emp_age=?,emp_gender=?,salary=?,emp_address=?,emp_mobileno=?,d_id=? where emp_id=${req.params.id}`,
     [req.body.name,req.body.age,req.body.gender,req.body.salary,req.body.address,req.body.mobileno,departments[req.body.dept]],
       (err,update)=>{
       if(err) console.log(err);
       else{
         if(req.body.username){
           con.query(`select * from login where employee_id=${req.params.id}`,(e,r)=>{
             bcrypt.compare(req.body.password,r[0].password)
             .then(response=>{
                 if(response!=true){
                   bcrypt.hash(req.body.password,10)
                    .then(hash=>{
                     con.query(`Update login set username='${req.body.username}',password='${hash}' where employee_id='${req.params.id}'`,(error,update2)=>{
                     if(error) console.log(error);
                    else{
                      res.redirect("/admin/empdetails");
                     }
                   })
                }).catch(er=>{
                  console.log(er);
                  res.redirect("/");
                })
                 }else{
                   con.query(`Update login set username='${req.body.username}' where employee_id=${req.params.id}`,(error2,update2)=>{
                     if(error2) console.log(error2);
                    else{
                      res.redirect("/admin/empdetails");
                     }
                 });
               }
             
           })
           .catch(errors=>{
             console.log(errors);
             res.redirect("/");
           })
         });
       }
       else{
           res.redirect("/admin/empdetails")
         }
       }
     })
});




//////////////////////////////////// delete routes

router.delete("/empdetails/:id/delete",(req,res)=>{
 con.query(`delete from employee where emp_id=${req.params.id}`,(err,result)=>{
   if(err) console.log(err);
   else {
     res.redirect("/admin/empdetails");
   } 
 })
})


module.exports = router;