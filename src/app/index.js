const schemaRouter = require("./schema/router");
const productRouter = require("./product/router");

module.exports = (app) => {
    app.use("/api/schema", schemaRouter);
    app.use("/api/product", productRouter);
};
