var express = require('express');
var router = express.Router();
var pool=require('./pool')
var upload=require('./multer');
var fs=require('fs')// yhe file system(fs) file ko remove karne ke liye

router.post('/vehiclesubmit',upload.single('originalpicture'),function(req, res, next) {
    console.log(req.body)
   pool.query("insert into vehicle(categoryid,subcategoryid,companyid,modelid,vendorid,registrationno,color,fueltype,ratings,average,remarks,capacity,status,feature,originalpicture)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[req.body.categoryid,req.body.subcategoryid,req.body.companyid,req.body.modelid,req.body.vendorid,req.body.regisno,req.body.color,req.body.fuel,req.body.ratings,req.body.average,req.body.remarks,req.body.capacity,req.body.status,req.body.features,req.file.filename],function(error,result){
    if(error)
    { console.log('ERRRRRRRRRRRR',error)
       res.status(500).json({status:false,message:'Server Error'})
    }
    else
    {
     console.log("xxxxxxxxx",result)

       res.status(200).json({status:true,message:'vehicle Submitted Successfully'})
    }



   })
 
});


router.get("/displayallvehiclelist",function(req,res,next){
   pool.query("select V.*,(select C.categoryname from category C where C.categoryid=V.categoryid)as categoryname,(select S.subcategoryname from subcategory S where S.subcategoryid=V.subcategoryid)as subcategoryname,(select CM.companyname from company CM where CM.companyid=V.companyid) as companyname,(select M.modelname from model M where M.modelid=V.modelid)as modelname from vehicle V",function(error,result){
      if(error){
         res.status(500).json({status:false,message:'server error'})
      }
      else{
         console.log("rrrrrrrrrrrrrrrrrrrr",result)
         res.status(200).json({status:true,data:result})
      }
   })
})


router.post('/edit_picture',upload.single('originalpicture'),function(req, res, next) {
   console.log(req.file)
  pool.query("update vehicle set originalpicture=? where vehicleid=?",[req.file.filename,req.body.vehicleid],function(error,result){
   if(error)
   { console.log(error)
      res.status(500).json({status:false,message:'Server Error'})
   }
   else
   {
      fs.unlinkSync(`D:/paynrent_backend/public/images/${req.body.oldpicture}`)

      res.status(200).json({status:true,message:'Icon Updated Successfully'})
   }



  })

});


router.post('/edit_data',function(req, res, next) {
   console.log(req.file)
  pool.query("update vehicle set vendorid=?,registrationno=?,color=?,fueltype=?,ratings=?,average=?,remarks=?,capacity=?,status=?,feature=? where vehicleid=?",[req.body.vendorid,req.body.regisno,req.body.color,req.body.fuel,req.body.ratings,req.body.average,req.body.remarks,req.body.capacity,req.body.status,req.body.features,req.body.vehicleid],function(error,result){
   if(error)
   { console.log(error)
      res.status(500).json({status:false,message:'Server Error'})
   }
   else
   {

      res.status(200).json({status:true,message:'Vehicle Updated Successfully'})
   }



  })

});


router.post('/delete_data',function(req, res, next) {
   console.log(req.file)
  pool.query("delete from vehicle where vehicleid=?",[req.body.vehicleid,],function(error,result){
   if(error)
   { console.log(error)
      res.status(500).json({status:false,message:'Server Error'})
   }
   else
   {
      fs.unlinkSync(`D:/paynrent_backend/public/images/${req.body.oldpicture}`)
      res.status(200).json({status:true,message:'model delete Successfully'})
   }



  })

});

module.exports=router;  