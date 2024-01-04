import * as express from 'express';
import * as cors from 'cors';
import connectDB from '../typeorm';
import * as amqp from 'amqplib/callback_api';
import { Product } from './entity/product';
import axios from 'axios';

const connection = connectDB;
const productRepository = connection.getMongoRepository(Product);

amqp.connect('amqps://flfxguhp:QsHh5enOq0hrhMntYUnH4_8Ke5U7UyGY@moose.rmq.cloudamqp.com/flfxguhp', (error0, connection) => {
    if (error0) {
        console.log("error0")
        throw error0;
    }
    connection.createChannel((error1, channel) => {
        if (error1){
            console.log("error1")
            throw error1
        }
        
        channel.assertQueue('product_created', {durable: false})
        channel.assertQueue('product_updated', {durable: false})
        channel.assertQueue('product_deleted', {durable: false})

        const app = express();

        app.use(cors({
            origin: ['http://localhost:3000','http://localhost:8080','http://localhost:4200']
        }))

        app.use(express.json());

        channel.consume('product_created', async (msg) => {
            const eventProduct: Product = JSON.parse(msg.content.toString());
            const product = new Product();
            product.admin_id = Number(eventProduct.id);
            product.title = eventProduct.title;
            product.image = eventProduct.image;
            product.likes = eventProduct.likes;
            
            await productRepository.save(product);
            console.log('Product Created');
        }, {noAck: true});

        channel.consume('product_updated', async (msg) => {
            const eventProduct : Product = JSON.parse(msg.content.toString());
            const product = await productRepository.findOneBy({
                admin_id: eventProduct.id
            })
            productRepository.merge(product, {
                title: eventProduct.title,
                image: eventProduct.image,
                likes: eventProduct.likes
            });
            await productRepository.save(product);
            console.log('Product Updated')
        }, {noAck: true})

        channel.consume('product_deleted', async (msg) => {
            const admin_id = Number(msg.content.toString());
            await productRepository.deleteOne({admin_id});
            console.log("Product Deleted");
        })

        app.get('/api/products', async (Request, Response) => {
            const product = await productRepository.find();
            return Response.send(product)
        })

        app.post('/api/products/:id/like', async (Request, Response) => {
            const product = await productRepository.findOneBy({
                id: Number(Request.params.id)
            })
            await axios.post(`http://localhost:8000/api/products/${product.admin_id}/like`, {})
            product.likes++;
            await productRepository.save(product);
            return Response.send(product);
        })

        console.log("Listening to port: 8001");

        app.listen(8001);
        process.on('beforeExit', () => {
            console.log('closing Connection')
            connection.close();
        })
    })
})
