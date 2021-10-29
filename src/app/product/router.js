require( "./model" );
const express = require( "express" );

const controller = require( "./controller" );

const router = express.Router( );

router.post("/get", controller.getApplication)
router.post("/create", controller.createApplication);
router.put("/edit/:id", controller.editApplication);
router.delete("/delete/:id", controller.deleteApplication)

module.exports = router;
