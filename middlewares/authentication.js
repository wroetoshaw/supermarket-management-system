function adminAuth(req,res,next){
    if(req.session.user!=undefined && req.session.user.role=="admin") next();
    else res.redirect("/login");
  }

  function managerAuth(req,res,next){
    if(req.session.user!=undefined && (req.session.user.role=="managing" || req.session.user.role=="admin"))  next();
    else res.redirect("/login")
  }

  function supplierAuth(req,res,next){
    if(req.session.user!=undefined && req.session.user.role=="supplier") next();
    else res.redirect("/supplier/login")
    
  }

  function billingAuth(req,res,next){
    if(req.session.user !=undefined && (req.session.user.role=="managing" || req.session.user.role=="admin" || req.session.user.role=="billing" )) next();
    else res.redirect("/login")
  }
  function inventoryAuth(req,res,next){
    if(req.session.user !=undefined && (req.session.user.role=="managing" || req.session.user.role=="admin" || req.session.user.role=="inventory" )) next();
    else res.redirect("/login")
  }


  module.exports = {
    adminAuth,
    managerAuth,
    supplierAuth,
    billingAuth,
    inventoryAuth
  }