require( "./model" );
const multer =require("multer");
const express = require( "express" );

const controller = require( "./controller" );

const validateToken = require("../../middlewares/validateToken")

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

router.get("/get", validateToken, controller.getApplication)
router.get("/getProductDetails", validateToken, controller.getApplicationFormEAN)
router.post("/create", validateToken, controller.createApplication);
router.put("/edit/:id", validateToken, controller.editApplication);
router.delete("/delete/:id", validateToken, controller.deleteApplication)
router.post("/excelUpload", validateToken, upload.single("file"), controller.uploadExcel)
router.get("/download", controller.downloadExcel)
router.put("/changeStatusPriceApproval",validateToken, controller.changeStatusPriceApproval)
router.get("/getProductByEANCode/:id", controller.getProductByVendorSystem)

module.exports = router;
