import { DataSource } from "typeorm";

const connectDB = new DataSource({
    type: "mongodb",
    host: "localhost",
    database: "node_microservice_main",
    entities: [
        "src/entity/*.js"
    ],
    synchronize: true,
    logging: false,
})

connectDB.initialize()
.then(() => {
    console.log(`DataSource has been initialized`);
})
.catch(err => {
    console.log(`Data Source initialization error ${err}`)
})

export default connectDB;