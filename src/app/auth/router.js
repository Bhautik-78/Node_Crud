require( "./model" );
const express = require( "express" );
const multer =require("multer");

const controller = require( "./controller" );

const router = express.Router( );
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "./uploads/userimage")
    },
    filename (req, file, cb) {
        cb(null , file.originalname)
    }
})
const upload = multer({storage})

router.post("/login", controller.loginAdmin);
router.post("/create", upload.single("file"), controller.CreateUser);
router.put("/edit/:id", upload.single("file"), controller.editUser)
router.post( "/forgetPassword", controller.forgetPassword );
router.get("/getAllUser", controller.getALlUser);
router.get("/getAllUser/:id", controller.getALlUser);
router.put("/changeActiveStatus/:id", controller.ChangeActiveStatus);

module.exports = router;
