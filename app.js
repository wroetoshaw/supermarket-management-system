const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const methodOverride = require("method-override");
const checking = require('./scheduled/check');
const authroutes = require('./routes/auth');
const adminroutes = require('./routes/admin');
const managerroutes = require('./routes/manager');
const billingroutes  = require('./routes/billing');
const inventoryroutes  = require('./routes/inventory');
const supplierroutes = require('./routes/supplier');
const con = require('./config/dbconfig');

///scheduled function
checking();

///database connection
// con.connect((err)=>{
//     if(err) console.log(err);
//     else console.log("successfully connected");
//   });

app.use(session({
  secret:"secretkey",
  resave:false,
  uninitialized:false
}));
app.use(express.static(__dirname + '/public'));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));


///routes

app.use(authroutes);
app.use('/admin',adminroutes);
app.use('/manager',managerroutes);
app.use('/billing',billingroutes);
app.use('/inventory',inventoryroutes );
app.use('/supplier',supplierroutes);



///server
app.listen(3000,()=>{
  console.log("server started on port 3000");
});

