const schemaRouter = require("./schema/router");
const productRouter = require("./product/router");

module.exports = (app) => {
    app.use("/schema", schemaRouter);
    app.use("/product", productRouter);
};
