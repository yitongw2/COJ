# COJ - (Collaborative Online Judge)
Collaborative online judge system is a forum-like web application that allows multiple users to add coding problems and collaborate on one coding problems simultaneously just like a Google Doc. Unlike Google Doc, collaborative online judge system comes with an executor server which will execute the code submitted by users.

Three major components:

- oj-client : Angular2-based front end with bootstrap
- oj-server : node.js backend platform with express middleware
- executor-server: Flask server with Docker Engine API

The project is accompanied with complete dockerization for the benefit of deployment. Make sure to set up docker before running this app on your machine.

COJ also provides [RESTful APIs](https://github.com/yitongw2/COJ/blob/master/README.md#restful-api-documentation) for obtaining, fetching and searching coding problems as well as executing user-submitted code. 

Tech Stack = {Angular, Node.js, Express, MongoDB, Redis, Javascript, Python, Nginx, Socket.io, Docker}

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

**Clone this repo into local machine**
```
git clone https://github.com/yitongw2/COJ.git
```

or 

```
git clone git@github.com:yitongw2/COJ.git
```

### Dockerization

To fully use the power of docker, I have dockerized the whole COJ application with multiple containers. A snippet of how the application is composed using docker-compose is shown below:

```
version: '3'
services:
  coj:
    build: .
    links:
        - redis
        - executor-server
    ports:
        - "3000:3000"
  executor-server:
    build: ./executor-server
    # mount the docker socket to the container so that they will share the same docker deamon
    volumes:
        # mount docker socket so that the container that executes user code share the same docker deamon
        - /var/run/docker.sock:/var/run/docker.sock
        # mount tmp folder where the user code will be stored so that the inner container will have access to it
        - /tmp:/tmp
    ports:
        - "5000:5000"
  redis:
    image: "redis"
```

### Prerequisites

Since it is fully dockerized, installing all the necessary libraries and tools are extremely easy with docker-compose build.

**Install Docker**
```
curl -fsSL https://get.docker.com/ | sh

#Setup docker permission:
sudo usermod -aG docker $(whoami)
#(you need to logout and login again after set permission)

#To start docker when the system boots
sudo systemctl enable docker
```

### Installing
Running the application on a local machine is simple. Since the application is already dockerized with docker-compose.yml, just build and run it with docker-compose.

```
docker-compose build
docker-compose up
```


## RESTful API documentation

---
### /problems
Methods:
* GET
* POST
* PUT

#### GET Request

```
GET https://your-address/api/v1/problems
```
**Parameters**

None

**Response Body**
```
[
    {
        "_id":"5a72f592734d1d71dd53c4fc",
        "id":1,
        "name":"a",
        "desc":"a",
        "difficulty":"easy"
    },
    {
        "_id":"5a739c8bb78cf7127c541d3c",
        "id":2
        "name":"100Sum",
        "desc":"100a0a0a0",
        "difficulty":"hard"
    }
    ...
]
```

#### POST Request
```
POST https://your-address/api/v1/problems
```
**Body**
```
    {
        "name":"100Sum",
        "desc":"100a0a0a0",
        "difficulty":"hard"
    }
```
**Response Body**
```
    {
        "name":"100Sum",
        "desc":"100a0a0a0",
        "difficulty":"hard"
    }
```
#### PUT Request
```
PUT https://your-address/api/v1/problems
```
**Body**
```
    {
        "name":"100Sum",
        "desc":"100a0a0a0",
        "difficulty":"easy"
    }
```
**Response Body**
```
    {
        "name":"100Sum",
        "desc":"100a0a0a0",
        "difficulty":"hard"
    }
```
return the old data that has been modified.
#### 
----
### /problems/{id}
Methods:
* GET
#### GET Request
```
GET https://your-address/api/v1/problems/{id}
```
**Parameters**

None

**Response Body**
```
{
    "_id":"5a72f592734d1d71dd53c4fc",
    "id":1,
    "name":"a",
    "desc":"a",
    "difficulty":"easy"
}
```
---
### /search
Methods:
* GET

#### GET Request
```
GET https://your-address/api/v1/search
```
**Parameters**

| Name          | Type          | Description  |
| ------------- | ------------- | ------------ |
| name          | string        | the name of the problem to be matched |
| id            | int           | the id of the problem |
| difficulty    | string        | the difficulty level to be matched |

**Response Body**
example for request */search?difficulty=easy*
```
[
    {
        "_id":"5a72f592734d1d71dd53c4fc",
        "id":1,
        "name":"a",
        "desc":"a",
        "difficulty":"easy"
    },
    {
        "_id":"5a739c8bb78cf7127c541d3c",
        "id":2
        "name":"100Sum",
        "desc":"100a0a0a0",
        "difficulty":"easy"
    }
    ...
]
```

## Deployment

The whole system can be deployed in various ways depending how much resources you have. Some examples are provided below.

Notice that MongoDB is separated into a different server on MLab because we are using the free Database-as-a-Service for MongoDB provided by MLab.

#### All-in-One

![alt-img](https://user-images.githubusercontent.com/13974845/36519479-a22f7022-1740-11e8-9c18-37eb50d6674f.png)

The simplest way is just to run different components on the same machine. OJ-client doesn't need to be running (pre-built before running). OJ-server is running on port 3000 while executor is running on port 5000. Above them all, Nginx acts as a proxy server that directs requests (-> port 80) to (-> port 3000) where the oj-server is running.

#### Load Balancer - OJ-Server

![vauvwzu9ijiu 1](https://user-images.githubusercontent.com/13974845/36520184-69da5864-1744-11e8-8440-8a08af8a3e29.png)

This type of deployment is most helpful when your application is having a lot of users simultaneously. In other words, a lot of requests per second or per day. 

However, This will require an additional implementation of **[master-slave redis databases](https://redis.io/topics/replication)** since Redis is used to store buffers of user code in case a user leave accidentally.

#### Load Balancer - Executor

![vauvwzu9ijiu 2](https://user-images.githubusercontent.com/13974845/36520494-1c614d66-1746-11e8-9088-a2118b1a28a0.png)

This type of deployment is most helpful when users are submitting and executing code very frequently since the workload of the executor is now being distributed among multiple machines.

To set up Nginx in order to work like that, simply add another server configuration targeting port 5000 for Nginx.

## Built With

* [Angular]()
* [Docker]()
* [Node.js]()
* [Express]()
* [MongoDB]()
* [Redis]()
* [Python]()
* [ACE]()
* [Socket.io]()
* [Nginx]() 


## Versioning

We use [git](https://git-scm.com/) for versioning. For the versions available, see the [tags on this repository](https://github.com/yitongw2/COJ). 

## Authors

* **Yitong Wu**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Adapted from CS503 project of Bittiger.com 

## Additional
This markdown file is created using dillinger.io, which is a great online markdown editor tool.
