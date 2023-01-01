const con = require('../config/dbconfig');

function checking(){
    let now;
    setInterval(()=>{
     con.query("Select t_id,t_opentime,t_closetime,t_status from tenders",(e,tenders)=>{
       if(e) console.log(e);
       else{
         now = Date.now();
         for(let x in tenders){
           if(new Date(tenders[x].t_opentime).getTime()<=now && now<new Date(tenders[x].t_closetime) && tenders[x].t_status!="open"){
             con.query(`Update tenders set t_status='open' where t_id=${tenders[x].t_id}`,(error,tender)=>{
               if(error) console.log(error);
               else{
                 console.log("opened!!!");
               }
             })
           }
           if(now>new Date(tenders[x].t_closetime) && tenders[x].t_status!="closed" && tenders[x].t_status!="selected"){
            con.query(`Update tenders set t_status='closed' where t_id=${tenders[x].t_id} `,(error,tender)=>{
              if(error) console.log(error);
              else{
                console.log("closed!!!");
              }
            })
           }
         }
       }
     })
    },2000)
  }

module.exports=checking;