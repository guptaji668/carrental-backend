var express = require('express');
var router = express.Router();
var pool = require('./pool')
var upload = require('./multer');
var fs = require('fs')// yhe file system(fs) file ko remove karne ke liye
var dotenv = require("dotenv");

dotenv.config();

const filepath = process.env.FILEPATH;
// har router me lga denge env ko
// enviroment variable bmaya h  jisme ek jgy ka change kr ne se sab jagy change hp jayega



/* GET users listing. */
router.post('/companysubmit', upload.single('icon'), function (req, res, next) {
   console.log(req.body)
   pool.query("insert into company(categoryid,subcategoryid,companyname,icon)values(?,?,?,?)", [req.body.categoryid, req.body.subcategoryid, req.body.companyname, req.file.filename], function (error, result) {
      if (error) {
         console.log('ERRRRRRRRRRRR', error)
         res.status(500).json({ status: false, message: 'Server Error' })
      }
      else {
         console.log("xxxxxxxxx", result)

         res.status(200).json({ status: true, message: 'company Submitted Successfully' })
      }



   })

});

router.get("/displaycompanylist", function (req, res) {
   pool.query("select * from company", function (error, result) {
      if (error) {
         res.status(500).json({ status: false, message: 'server error' })
      }
      else {
         console.log("rrrrrrrrrrrrrrrrrrrr", result)
         res.status(200).json({ status: true, data: result })
      }
   })
})
router.post('/edit_picture', upload.single('icon'), function (req, res, next) {
   console.log(req.file)
   pool.query("update company set icon=? where categoryid=?", [req.file.filename, req.body.categoryid], function (error, result) {
      if (error) {
         console.log(error)
         res.status(500).json({ status: false, message: 'Server Error' })
      }
      else {
         fs.unlinkSync(`D:/paynrent_backend/public/images/${req.body.oldicon}`)

         res.status(200).json({ status: true, message: 'Icon Updated Successfully' })
      }



   })

});

router.post('/edit_data', function (req, res, next) {
   console.log(req.file)
   pool.query("update company set companyname=? where companyid=?", [req.body.companyname,
   req.body.companyid,], function (error, result) {
      if (error) {
         console.log(error)
         res.status(500).json({ status: false, message: 'Server Error' })
      }
      else {

         res.status(200).json({ status: true, message: 'company Updated Successfully' })
      }



   })

});

router.post('/delete_data', function (req, res, next) {
   console.log(req.file)
   pool.query("delete from company where companyid=?", [req.body.companyid,], function (error, result) {
      if (error) {
         console.log(error)
         res.status(500).json({ status: false, message: 'Server Error' })
      }
      else {
         fs.unlinkSync(`${filepath}/${req.body.oldicon}`)
         res.status(200).json({ status: true, message: 'company delete Successfully' })
      }



   })

});

router.post('/fetch_all_company_by_subcategory', function (req, res) {
   console.log('body', req.body)
   pool.query("select C.*,(select S.subcategoryname from subcategory S where S.subcategoryid=C.subcategoryid) as subcategoryname from company C where C.subcategoryid=?", [req.body.subcategoryid], function (error, result) {
      if (error) {
         console.log(error)
         res.status(500).json({ status: false, message: 'Server Error', result: [] })
      }
      else {
         console.log(result)
         res.status(200).json({ status: true, result: result })
      }


   })

})

module.exports = router;