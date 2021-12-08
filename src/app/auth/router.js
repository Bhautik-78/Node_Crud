require( "./model" );
const express = require( "express" );

const controller = require( "./controller" );

const router = express.Router( );

router.post("/login", controller.loginAdmin);
router.post("/create", controller.CreateUser);

module.exports = router;
