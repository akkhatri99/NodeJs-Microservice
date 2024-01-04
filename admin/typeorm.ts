import { DataSource } from "typeorm";

const connectDB = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "dev.123",
    database: "node_microservice_admin",
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