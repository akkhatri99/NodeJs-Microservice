"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var connectDB = new typeorm_1.DataSource({
    type: "mongodb",
    host: "localhost",
    database: "node_microservice_main",
    entities: [
        "src/entity/*.js"
    ],
    synchronize: true,
    logging: false,
});
connectDB.initialize()
    .then(function () {
    console.log("DataSource has been initialized");
})
    .catch(function (err) {
    console.log("Data Source initialization error ".concat(err));
});
exports.default = connectDB;
