require( "./model" );
const express = require( "express" );

const controller = require( "./controller" );

const validateToken = require("../../middlewares/validateToken")

const router = express.Router( );

router.get("/getAllUserDebitMemo",validateToken, controller.getAllUserDebitMemo);
router.post("/AddUserDebitMemo",validateToken, controller.AddUserDebitMemo);
router.put("/ChangeUserDebitMemo/:id",validateToken, controller.ChangeUserDebitMemo);
router.delete("/removeUserDebitMemo/:id",validateToken, controller.removeUserDebitMemo);

module.exports = router;
