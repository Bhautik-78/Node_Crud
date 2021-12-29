require( "./model" );
const express = require( "express" );

const controller = require( "./controller" );

const validateToken = require("../../middlewares/validateToken");

const router = express.Router( );

router.post("/create", validateToken, controller.createPaymentReport);
router.get("/getPaymentList", validateToken, controller.getPaymentList);
router.get("/getOutStandingReport", validateToken, controller.getOutStandingReport);

module.exports = router;
