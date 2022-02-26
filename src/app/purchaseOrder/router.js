require( "./model" );
const express = require( "express" );

const controller = require( "./controller" );

const validateToken = require("../../middlewares/validateToken")

const router = express.Router( );

router.post("/create", validateToken, controller.createApplication);
router.get("/get", validateToken, controller.getApplication)
router.get("/get/:id", validateToken, controller.getApplicationForID)
router.put("/edit/:id", validateToken, controller.editApplication);
router.delete("/delete/:id", validateToken, controller.deleteApplication)
router.post("/serviceOrder", controller.purchaseOrder)

module.exports = router;
