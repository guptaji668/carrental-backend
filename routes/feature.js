var express = require('express');
var router = express.Router();
var pool=require('./pool')
var upload=require('./multer');
var fs=require('fs')
var fs=require('fs') 
var dotenv = require("dotenv");

dotenv.config();

router.post('/featuresubmit',upload.any(),function(req, res, next) {
   console.log(req.file)
  pool.query("insert into featured(image,link) values(?,?)",[req.files[0].filename,req.body.link],function(error,result){
   if(error)
   { console.log(error)
      res.status(500).json({status:false,message:'Server Error'})
   }
   else
   {

      res.status(200).json({status:true,message:'Featured Submitted Successfully'})
   }
 
    
})
      
});

   module.exports = router;
