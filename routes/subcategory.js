var express = require('express');
var router = express.Router();
var pool=require('./pool')
var upload=require('./multer');
var fs=require('fs')// yhe file system(fs) file ko remove karne ke liye
 
/* GET users listing. */
router.post('/subcategorysubmit',upload.single('icon'),function(req, res, next) {
     console.log(req.body)
    pool.query("insert into subcategory(categoryid,subcategoryname,icon,priority)values(?,?,?,?)",[req.body.categoryid,req.body.subcategoryname,req.file.filename,req.body.priority],function(error,result){
     if(error)
     { console.log('ERRRRRRRRRRRR',error)
        res.status(500).json({status:false,message:'Server Error'})
     }
     else
     {

        res.status(200).json({status:true,message:'SubCategory Submitted Successfully'})
     }



    })
  
});

router.get("/displayallsubcategory",function(req,res){
   pool.query("select * from subcategory",function(error,result){
      if(error){
         res.status(500).json({status:true,message:'server error'})
      }
      else{
         console.log("rrrrrrrrrrrrrrrrrrrr",result)
         res.status(200).json({status:true,data:result})
      }
   })
})

router.post('/edit_picture',upload.single('icon'),function(req, res, next) {
   console.log(req.file)
  pool.query("update subcategory set icon=? where subcategoryid=?",[req.file.filename,req.body.subcategoryid],function(error,result){
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
  pool.query("update subcategory set subcategoryname=?,priority=? where subcategoryid=?",[req.body.subcategoryname ,
    req.body.priority,req.body.subcategoryid,],function(error,result){
   if(error)
   { console.log(error)
      res.status(500).json({status:false,message:'Server Error'})
   }
   else
   {

      res.status(200).json({status:true,message:'subcategory Updated Successfully'})
   }



  })

});

router.post('/delete_data',function(req, res, next) {
   console.log(req.file)
  pool.query("delete from subcategory where subcategoryid=?",[req.body.subcategoryid,],function(error,result){
   if(error)
   { console.log(error)
      res.status(500).json({status:false,message:'Server Error'})
   }
   else
   {
      fs.unlinkSync(`D:/paynrent_backend/public/images/${req.body.oldicon}`)
      res.status(200).json({status:true,message:'subcategory delete Successfully'})
   }



  })

});


router.post('/fetch_all_subcategory_by_category',function(req,res){
   pool.query("select S.*,(select C.categoryname from category C where C.categoryid=S.categoryid) as categoryname from subcategory S where S.categoryid=?",[req.body.categoryid],function(error,result){
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
   


//company me categorydrpdown se subcategory fil karne ke liye

module.exports = router;