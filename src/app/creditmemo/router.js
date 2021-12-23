require( "./model" );
const express = require( "express" );

const controller = require( "./controller" );

const validateToken = require("../../middlewares/validateToken")

const router = express.Router( );

router.get("/getAllUserCreditMemo",validateToken, controller.getAllUserCreditMemo);
router.get("/getAllUserCreditMemo/:id", validateToken, controller.getUserCreditMemoForID);
router.post("/AddUserCreditMemo",validateToken, controller.AddUserCreditMemo);
router.put("/ChangeUserCreditMemo/:id",validateToken, controller.ChangeUserCreditMemo);
router.delete("/removeUserCreditMemo/:id",validateToken, controller.removeUserCreditMemo);

module.exports = router;
