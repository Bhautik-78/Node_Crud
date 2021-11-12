require( "./model" );
const multer =require("multer");
const express = require( "express" );

const controller = require( "./controller" );

const router = express.Router( );
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "./uploads")
    },
    filename (req, file, cb) {
        cb(null , file.originalname)
    }
})

const upload = multer({ storage })

router.get("/get", controller.getApplication)
router.get("/getProductDetails", controller.getApplicationFormEAN)
router.post("/create", controller.createApplication);
router.put("/edit/:id", controller.editApplication);
router.delete("/delete/:id", controller.deleteApplication)
router.post("/excelUpload" , upload.single("file"), controller.uploadExcel)

module.exports = router;
