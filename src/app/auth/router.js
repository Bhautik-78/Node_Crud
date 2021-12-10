require( "./model" );
const express = require( "express" );

const controller = require( "./controller" );

const router = express.Router( );

router.post("/login", controller.loginAdmin);
router.post("/create", controller.CreateUser);
router.put("/edit/:id", controller.editUser)
router.post( "/forgetPassword", controller.forgetPassword );
router.get("/getAllUser", controller.getALlUser);
router.get("/getAllUser/:id", controller.getALlUser);
router.put("/changeActiveStatus/:id", controller.ChangeActiveStatus);

module.exports = router;
