# COJ - (Collaborative Online Judge)
Collaborative online judge system is a formun-like web application that allows mutiple users to add coding problems and collaborate on one coding problems simutanesouly just like a Google Doc. Unlike Google Doc, collaborative online judge system comes with an executor server which will executes the code submitted by users.

Three major components:

- oj-client : Angular2-based front end with bootstrap
- oj-server : node.js backend platform with express middleware
- executor : Flask server with Docker Engine API

COJ also provides [RESTful APIs](https://github.com/yitongw2/COJ/blob/master/README.md#restful-api-documentaion) for obtaining, fetching and searching coding problems as well as executing user-submitted code. 

Tech Stack = {Angular2, Node.js, Express, MongoDB, Redis, Javascript, Python, Nginx, Socket.io}

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

### Prerequisites

Things you need to install the software and how to install them are listed below. However, theses instructions are only for **Linux Ubuntu 16.04**.

**Install Node.js**
```
sudo apt-get update
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Install npm**
```
sudo apt-get install npm
```

**Install nodemon**
```
sudo apt-get install nodemon
```
**Install git**
```
sudo apt-get install git
```
**Install angular/cli**
```
sudo npm install -g @angular/cli@latest
```
**Install Redis (version 3.2.6)**
```
wget http://download.redis.io/releases/redis-3.2.6.tar.gz
tar xzf redis-3.2.6.tar.gz
cd redis-3.2.6
make
sudo make install
cd utils
sudo ./install_server.sh
```

**Install Python3 (should be already installed in ubuntu)**
```
sudo apt-get install python3.6
```
**Install pip3 for python3**
pip is the package management tool used for python packages
```
sudo apt-get update
sudo apt-get -y install python3-pip
```
**Install Flask**
```
sudo pip3 install Flask
```
**Install Docker**
```
curl -fsSL https://get.docker.com/ | sh

#Setup docker permission:
sudo usermod -aG docker $(whoami)
#(you need to logout and login again after set permission)

#To start docker when the system boots
sudo systemctl enable docker
```
**Install Nginx**

Nginx is used for reversed proxy that redirects request sent to port 80 to port 3000, where oj-server will be listening

_For ubuntu 16.04:_
Add following two lines into /etc/apt/sources.list
```
deb http://nginx.org/packages/ubuntu/ xenial nginx
deb-src http://nginx.org/packages/ubuntu/ xenial nginx
```
Then run:
```
sudo apt-get update
sudo apt-get install nginx
```
**Set up Nginx - reversed proxy**

Make directories for our configuration files
```
cd /etc/nginx
mkdir sites-available
mkdir sites-enabled
cd sites-enabled
```
In directory 'sites-enabled', create a file named 'custom.conf' and copy the following content into the file
```
server {
  listen 80;
  server_name coj;
  location / {
    proxy_set_header  X-Real-IP  $remote_addr;
    proxy_set_header  Host       $http_host;
    proxy_pass        http://127.0.0.1:3000;
  }
}
```
Then, link the config file in sites enabled (this will make it seem like the file is actually copied insites-enabled)
```
sudo ln -s /etc/nginx/sites-available/custom /etc/nginx/sites-enabled/custom
```
Finally, change the nginx configuration file (location: /etc/nginx/nginx.conf) to use your custom configuration
```
cd /etc/nginx
# or use any editor you prefer (emac, nano)
sudo vim nginx.conf
```
In nginx.conf, change the line 
```
'include /etc/nginx/conf.d/\*;' 
```
to 
```
'include /etc/nginx/sites-enabled/\*;'
```
**Set up Nginx - load balancer**

Optionally, you can set up a load balancer which distributes client requests among several backend servers on different ips. 

add the following content to your custom configuration file
```
upstream backend {
   server backend.example.com;
   server XXXX.XXXX.XXXX.XXXX;
   ...
}
```
The list of servers are the backend servers that nginx will redistribute client requests to. 
### Installing
Running the application on a local machine is simple. There is bash script named init.sh in the root folder which will initialize whatever the project needs. 

Simply run the bash script init.sh
```
./init.sh
```

An example of running init.sh

![example-running-init](https://user-images.githubusercontent.com/13974845/36451005-774243dc-1644-11e8-99ec-bfb59b37e2d9.png)

**Alternatively, you can run different components separately**

---
*Build oj-client*

```
cd oj-client
ng build
```
This will build the whole front end into a folder named public at root level

if you are developing new features in front end and want to monitor real-time changes, use watch option
```
ng build --watch
```

---

*Fire up oj-server*

first go to oj-server directory
```
cd oj-server
```
use npm 
```
npm start
```
or use nodemon for development
```
nodemon server.js
```

---

*Fire up executor*

first go to exxcutor directory
```
cd executor
```
build docker image from Dockerfile
```
docker build -< Dockerfile
```
run flask app
```
python3 executor_server.py
```
## RESTful API documentaion

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

Add additional notes about how to deploy this on a live system

## Built With

* [Angular2]()
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
