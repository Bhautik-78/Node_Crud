require( "./model" );
const express = require( "express" );
const multer =require("multer");

const controller = require( "./controller" );

const validateToken = require("../../middlewares/validateToken")

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "./uploads")
    },
    filename (req, file, cb) {
        cb(null , file.originalname)
    }
});

const upload = multer({ storage });

router.post("/create",validateToken,  controller.createApplication);
router.get("/get",validateToken,  controller.getApplication);
router.get("/get/:id",validateToken, controller.getApplicationForID);
router.put("/edit/:id",validateToken, controller.editApplication);
router.delete("/delete/:id",validateToken, controller.deleteApplication);
router.get("/download", controller.downloadExcel);
router.post("/excelUpload",validateToken, upload.single("file"), controller.uploadExcel);
router.get("/getInvoiceNumList", validateToken, controller.getInvoiceNumList)
router.get("/getInvoiceValue/:id", validateToken, controller.getInvoiceValue)

module.exports = router;
