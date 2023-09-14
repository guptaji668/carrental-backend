var express = require('express');
var router = express.Router();
var pool=require('./pool')
var upload=require('./multer');
var fs=require('fs')// yhe file system(fs) file ko remove karne ke liye

router.post('/modelsubmit',upload.single('icon'),function(req, res, next) {
    console.log(req.body)
   pool.query("insert into model(categoryid,subcategoryid,companyid,modelname,year,icon)values(?,?,?,?,?,?)",[req.body.categoryid,req.body.subcategoryid,req.body.companyid,req.body.modelname,req.body.year,req.file.filename],function(error,result){
    if(error)
    { console.log('ERRRRRRRRRRRR',error)
       res.status(500).json({status:false,message:'Server Error'})
    }
    else
    {
     console.log("xxxxxxxxx",result)

       res.status(200).json({status:true,message:'Model Submitted Successfully'})
    }



   })
 
});
router.get("/displayallmodellist",function(req,res,next){
   pool.query("select * from model",function(error,result){
      if(error){
         res.status(500).json({status:false,message:'server error'})
      }
      else{
         console.log("rrrrrrrrrrrrrrrrrrrr",result)
         res.status(200).json({status:true,data:result})
      }
   })
})

router.post('/edit_picture',upload.single('icon'),function(req, res, next) {
   console.log(req.file)
  pool.query("update model set icon=? where subcategoryid=?",[req.file.filename,req.body.subcategoryid],function(error,result){
   if(error)
   { console.log(error)
      res.status(500).json({status:false,message:'Server Error'})
   }
   else
   {
      fs.unlinkSync(`D:/paynrent_backend/public/images/${req.body.oldicon}`)

      res.status(200).json({status:true,message:'Icon Updated Successfully'})
   }



  })

});

router.post('/edit_data',function(req, res, next) {
   console.log(req.file)
  pool.query("update model set modelname=?,year=? where modelid=?",[req.body.modelname ,req.body.year,
   req.body.modelid,],function(error,result){
   if(error)
   { console.log(error)
      res.status(500).json({status:false,message:'Server Error'})
   }
   else
   {

      res.status(200).json({status:true,message:'model Updated Successfully'})
   }



  })

});

router.post('/delete_data',function(req, res, next) {
   console.log(req.file)
  pool.query("delete from model where modelid=?",[req.body.modelid,],function(error,result){
   if(error)
   { console.log(error)
      res.status(500).json({status:false,message:'Server Error'})
   }
   else
   {
      fs.unlinkSync(`D:/paynrent_backend/public/images/${req.body.oldicon}`)
      res.status(200).json({status:true,message:'model delete Successfully'})
   }



  })

});


router.post('/fetch_all_model_by_company',function(req,res){
   pool.query("select M.*,(select C.companyname from company C where C.companyid=M.companyid)from model M where M.companyid=?",[req.body.companyid],function(error,result){
       if(error)
       {
   
       console.log(error)
       res.status(500).json({status:false,message:'Server Error',result:[]})
   
       }
       else if(result)
       {
          console.log("vvvvvvvvvvvvvvvv",result)
          res.status(200).json({status:true,result:result})
       }
   
   
   })
   
   })
   





module.exports=router;