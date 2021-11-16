require( "./model" );
const express = require( "express" );

const controller = require( "./controller" );

const router = express.Router( );

router.post("/create", controller.createApplication);
router.get("/get", controller.getApplication)
router.get("/get/:id", controller.getApplicationForID)
router.put("/edit/:id", controller.editApplication);
router.delete("/delete/:id", controller.deleteApplication)

module.exports = router;
