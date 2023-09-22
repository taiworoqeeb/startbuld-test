import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { terminate } from '../utils/error';
import * as morgan from 'morgan'
import { logger } from '../utils/logger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL as string],
      queue: 'user_queue',
      queueOptions: {
        durable: false
      },
      prefetchCount: 1,
    },
  })
  app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ')}, {stream: {
      write: function(message: any){
        logger.http(message);
        return true
      }
    }}))

  app.use(helmet())
  app.enableCors();

  const config = new DocumentBuilder()
  .setTitle('User API')
  .setDescription('User API description')
  .setVersion('1.0')
  .addBearerAuth(
    {
      description: `Please enter token in following format: JWT without Bearer`,
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header'
    },
    'Authorization', // This name here is important for matching up with @ApiBearerAuth() in your controller!
  )
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.useGlobalPipes(new ValidationPipe({
    forbidUnknownValues: false
  }));

  const port = process.env.PORT || 3000;

  await app.startAllMicroservices();
  await app.listen(port, () => {
    logger.info(`User service is running on port ${port}`);
  });

  const errorHandler = terminate(app)

  process.on('uncaughtException', errorHandler(1, 'Unexpected Error'))    //programmer error
  process.on('unhandledRejection', errorHandler(1, 'Unhandled Promise'))  //unhandled promise error
  process.on('SIGTERM', errorHandler(0, 'SIGTERM'))   //on a successful termination
  process.on('SIGINT', errorHandler(0, 'SIGINT')) //interrupted proce
  process.on('exit', errorHandler(0, 'exit')) //exit event

}
bootstrap();
