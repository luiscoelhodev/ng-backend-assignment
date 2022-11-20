# TRYBE <> NG.CASH | TECH CHALLENGE

This API project was developed after a challenge proposed by NG.CASH for the position of junior back-end developer. This challenge is about creating a dockerized application that enables NG users to send each other internal transfers.

## Content
[1. Getting Started](#getting-started)  
    [1.1 Requirements](#requirements)
[2. Download and Installation](#download-and-installation)  
    [2.1 Option 1: Running the project in Production/Staging mode](#option-1-running-the-project-in-productionstaging-mode)  
    [2.2 Option 2: Running the project in development mode](#option-2-running-the-project-in-development-mode)
[3. API Resources](#api-resources)   
    [3.1 Endpoints](#endpoints)   
[4. Technologies](#technologies)   
[5. License](#license)   

---

## Getting Started

The following instructions will help you get a copy of this project up and running on your local machine. You will be able to test it as Production/Staging or Development mode.

Below you will also find relevant information about the API resources available (its endpoints) as well as the main technologies used to build it.

### Requirements

You need to have Docker (for ```docker-compose```) installed on your machine in order to run this project in production mode. If you don't have it or simply want to run this project in development mode, you will need Node.js (LTS version recommended). You can download both in the links below:

- https://nodejs.org/en/download/
- https://www.docker.com/products/docker-desktop/

---

## Download and Installation

Make sure you have Git installed on your machine so you can clone this project by running the following command:
```
git clone https://github.com/luiscoelhodev/ng-backend-assignment.git
```

Alternatively, if you are reading this README after downloading the .zip file, you already have all the necessary files in the root folder so you can move along.

Use the *Option 1* if you want to use the production-ready version of this project with a single docker-compose command. Otherwise, use the *Option 2* if you want to test its development version.  

### Option 1: Running the project in Production/Staging mode

Open up the root folder in a terminal window and run the following command:
```
docker-compose up -d
```
This command will build the API docker image, run its service along with a PostgreSQL service in a docker-compose as two containers sharing a common default network. 

Within its own container, the API service then runs the database migrations and starts up the server, running on port 3000. 

At this point, you should be able to send HTTP requests to http://localhost:3000. There is a test GET endpoint at '/hello'. All the other resources can be found in another section below.

### Option 2: Running the project in development mode

With this optional you won't be using Docker, so you have to make sure PostgreSQL is running locally on your machine because the database integration for the API depends on it.

1. Open the *'.env.example'* file and follow the instructions in it.

2. After setting up your environment variables, run ``` npm install ``` to install all dependencies.

3. ```npx prisma migrate dev``` will hook it up to PostgreSQL, create your database, run all the migrations inside the *'./prisma/migrations'* folder and generate/update the Prisma Client (mainly used for querying the DB).

4. ```npm run dev``` will start up the application, running on port 3000. This script runs the *'index.ts'* file and watches all changes in the code.

5. If you want to build the project, run ```npm run build```, which will create the *'./dist'* folder and run ```npm run start``` to run the built project with the *'index.js'* file.
---

## API Resources  
There's a filled called *'ng-assignment-insomnia-collection.json'* in *'./assets'* that can be imported into Insomnia (https://insomnia.rest/download), a famous open-source API client, which contains a collection of all of this project's endpoints. You can take advantage of this tool and save time send your requests.  
### Endpoints:

1. Auth
- POST /signup
- POST /login

2. Users
- GET /my-balance
- GET /my-transactions

3. Transactions
- POST /send-money
---
## Technologies  
Main technologies in this project:
- [Node.js](https://nodejs.org/en/) - *A JavaScript runtime built on Chrome's V8 JavaScript engine.*
- [Express.js](https://expressjs.com/) - *A minimal and flexible Node.js web application framework.*
- [Docker](https://www.docker.com/) - *A service products that use OS-level virtualization to deliver software in packages called containers.*
- [PostgreSQL](https://www.postgresql.org/) - *An open source object-relational database system.*
- [Typescript](https://www.typescriptlang.org/) - *A strongly typed programming language that builds on JavaScript.*
- [Prisma](https://www.prisma.io/) - *A next-generation Node.js and TypeScript ORM.*

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details.