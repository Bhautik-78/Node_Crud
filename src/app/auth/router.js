require( "./model" );
const express = require( "express" );
const multer =require("multer");

const controller = require( "./controller" );

const validateToken = require("../../middlewares/validateToken")

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

const multipleFile = upload.fields([
    {name:"avatar"},  //maxCount:1
    {name:"panpicture"},  //maxCount:1
    {name:"gstpicture"},  //maxCount:1
    {name:"cancelledchequepic"},  //maxCount:1
    {name:"coincorporation"}  //maxCount:1
])

router.post("/login", controller.loginAdmin);
router.post("/create", multipleFile, controller.CreateUser);
router.put("/edit/:id", multipleFile, controller.editUser)
router.post( "/forgetPassword", controller.forgetPassword );
router.get("/getAllUser", controller.getALlUser);
router.get("/getAllUser/:id", controller.getALlUser);
router.put("/changeActiveStatus/:id", controller.ChangeActiveStatus);
router.get("/getCountDetail",validateToken, controller.getCountDetail);
router.get("/user",controller.getUser);
router.get("/user/:id",controller.getUserById);
router.get("/syncCall",controller.syncCallForUSer);
router.get("/getCountry",controller.getCountry);
router.get("/getState/:id",controller.getState);
router.post("/createUser",controller.vendorCreateUser);

module.exports = router;
