require( "./model" );
const express = require( "express" );

const controller = require( "./controller" );

const router = express.Router( );

router.post("/login", controller.loginAdmin);
router.post("/create", controller.CreateUser);
router.get("/getAllUser", controller.getALlUser);
router.get("/getAllUser/:id", controller.getALlUser);

module.exports = router;
