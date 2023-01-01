const mysql = require("mysql");


var con = mysql.createConnection({
    host:"supermarket.c6xuxvpmhbmh.ap-south-1.rds.amazonaws.com",
    user:"admin",
    password:"sqlpassword",
    database:"supermarket"
  });
 
  
//   con.connect((err)=>{
//     if(err) console.log(err);
//     else console.log("successfully connected");
//   });
  
module.exports=con;