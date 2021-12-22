const schemaRouter = require("./schema/router");
const productRouter = require("./product/router");
const desPatchNoteRouter = require("./despatchNote/router");
const purChaseOrderRouter = require("./purchaseOrder/router");
const invoiceRouter = require("./invoice/router");
const authRouter = require("./auth/router");
const debitMemoRouter = require("./debitmemo/router");
const creditMemoRouter = require("./creditmemo/router");

module.exports = (app) => {
    app.use("/api/schema", schemaRouter);
    app.use("/api/product", productRouter);
    app.use("/api/desPatchNote", desPatchNoteRouter);
    app.use("/api/purChaseOrder", purChaseOrderRouter);
    app.use("/api/invoice", invoiceRouter);
    app.use("/api/auth", authRouter);
    app.use("/api/debitMemo", debitMemoRouter);
    app.use("/api/creditMemo", creditMemoRouter);
};
