import * as express from 'express';
import * as cors from 'cors';
import connectDB from '../typeorm';
import { Product } from './entity/product';
import * as amqp from 'amqplib/callback_api';

const connection = connectDB;
const productRepository = connection.getRepository(Product);

amqp.connect('amqps://flfxguhp:QsHh5enOq0hrhMntYUnH4_8Ke5U7UyGY@moose.rmq.cloudamqp.com/flfxguhp', (error0, connection) => {
    if(error0){
        throw error0;
    }
    connection.createChannel((error1, channel) => {
        if(error1) {
            throw error1;
        }

                    
            const app = express();

            app.use(cors({
                origin: ['http://localhost:3000','http://localhost:8080','http://localhost:4200']
            }))

            app.use(express.json());


            app.get('/api/products', async (Request, Response) => {
                const products = await productRepository.find();
                Response.json(products);
            })


            app.post('/api/products', async (Request, Response) => {
            const product = await productRepository.create(Request.body);
            const result = await productRepository.save(product);
            channel.sendToQueue('product_created', Buffer.from(JSON.stringify(result)));
            return Response.send(result);  
            })

            app.get('/api/products/:id', async (Request, Response) => {
                const id = Number(Request.params.id);
                const product = await productRepository.findOneBy({
                    id: id
                });
                return Response.send(product);
            })

            app.put('/api/products/:id', async (Request, Response) => {
                const id = Number(Request.params.id);
                const product : Product = await productRepository.findOneBy({
                    id: id
                });
                productRepository.merge(product, Request.body);
                const result = await productRepository.save(product);
                channel.sendToQueue('product_updated', Buffer.from(JSON.stringify(result)));
                return Response.send(result);
            })

            app.delete('/api/products/:id', async (Request, Response) => {
                const result = await productRepository.delete(Number(Request.params.id));
                channel.sendToQueue('product_deleted', Buffer.from(Request.params.id));
                return Response.send(result);
            })

            app.post('api/products/:id/like', async (Request, Response) => {
                const product = await productRepository.findOneBy({
                    id: Number(Request.params.id)
                })
                product.likes++;
                const result = await productRepository.save(product);
                return Response.send(result);
            })

            console.log("Listening to port: 8000");

            app.listen(8000);

            process.on('beforeExit', () => {
                console.log('closing Connection')
                connection.close();
            })
    })
})