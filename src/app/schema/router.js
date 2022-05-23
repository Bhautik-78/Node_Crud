require( "./model" );
const express = require( "express" );

const controller = require( "./controller" );

const validateToken = require("../../middlewares/validateToken")

const router = express.Router( );

router.get("/get", validateToken, controller.getApplication)
router.get("/get/:id", validateToken, controller.getApplicationForID)
router.get("/getByEan/:eancode", validateToken, controller.getApplicationForEanCode)
router.post("/create", validateToken, controller.createApplication);
router.put("/edit/:id", validateToken, controller.editApplication);
router.delete("/delete/:id", validateToken, controller.deleteApplication)
router.get("/getMaxEnCode", controller.getMaxEnCode)

module.exports = router;
