<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Starbuld Test Task app is a hybrid multi-repo microservice application built using NestJS, PosgreSQL, Redis, and RabbitMQ that has both the user service app and the task app in one repo sharing the same modules but completely different application. It is a simple application that allows users to create tasks and assign them to other users. The application is built using NestJS framework and uses PostgreSQL as the database, Redis as the cache, and RabbitMQ as the message broker. The communication is basically from the task service to the user for authentication and user data request using rabbitmq events, while the user information is stored on redis at the point of logging in for the user to be able to access the tasks and project services. Both service have different databases that are completely not relying on one another and also a database to store the error messages for the task service. The task service also has a cron job that runs every 10 am everyday to check for tasks that are one day due for submission and sends a notification to the user that is assigned to the task.

## Architecture Diagram
<p align="center">
  <img src="https://res.cloudinary.com/taiworoqeeb/image/upload/v1695378610/test.drawio_fhianv.png" />
</p>


## Installation

```bash
$ yarn install
```

## Runing each microservice app

```bash
#User Service
--development
$ yarn start:dev user

--production
$ yarn start:prod user

#Task Service
--development
$ yarn start:dev task

--production
$ yarn start:prod task

```

## API Documentation can be viewed using Swagger API
```bash
# User Service Swagger API
  http://localhost:3000

# Task Service Swagger API
  http://localhost:3001
  ```

## License

Nest is [MIT licensed](LICENSE).
