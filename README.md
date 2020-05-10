# Learn Docker

---

### Mapping localhost running on a port to docker image's localhost port

- `docker run -p 8080:8080 rahulshetty/nodeapp`

- `8080:8080` means redirect the request received locally localhost:8080 to the docker image's localhost:8080

- It doesn't matter what PORT you are accepting from the local machine, but you should redirect to the right port. For example, `5000:8080` will run without any issues on hitting `localhost:5000`

- `rahulshetty/nodeapp` is the tag name so that we don't have to run the container with an id

- To build with a tag, run docker `build -t rahulshetty/nodeapp .`. REMEMBER the `.` at the end is very important.

### Enter the OS

You can either run:

`docker run -it rahulshetty/nodeapp sh`

OR

`docker exec -it <id we get from building or docker ps running id> sh`

Clear the docker containers and cache using
`docker system prune -a`

### Running a container in background

You can use

`docker -d redis` which will output an ID

Run `docker ps` to list the running docker containers in the background

You can stop the running command using

`docker stop <ID>`

### Docker Compose and network connections between various containers

Tired running the commands again and again? Docker compose comes to your rescue. It runs multiple docker commands, starts multiple containers and connects the network link between all containers.

- So, before we used
  `docker run <image>`
  which can be replaced with
  `docker-compose up`

- For building and running the code, before we used
  `docker build .`
  `docker run <image>`
  which can be replaced with
  `docker-compose up --build`
- For running the container in trhe background
  `docker-compose up -d`
- For listing the background processes, run
  `docker-compose ps`
  This works specifically for the containers for the current working directory. Docker compose needs to know the root for listing the running processes. It identifies the root directory by searching for the `.yml` config file
- To stop all the containers
  `docker-compose down`
- What if your server crashed due to some bug or unexpected issue? We should restart it so that the app is up and running right? So, add the option `restart: always` in `docker-compose.yml` config file

<br /><br />

## Building a React Project with Docker (branch: docker-prod)

---

### Docker config for development

- Create a `Dockerfile.dev`
- Docker will not recognise the new docker config file with an extension. So, we can run
  `docker build -f Dockerfile.dev .`
  We provided a custom name of our config file

### Docker volumes

Your changes to a file would not be reflected in the current application as we are copying the files from our local machine and adding it to the docker container. So, any changes to the file is not being copied and hence, we will not see any change in our application.

So, instead of copying, we'll create references to our files using volumes.

`docker run -p 3000:3000 -it -v /app/node_modules -v $(pwd):/app rahulshetty/react-app`

- `-v` stands for volume
- `$(pwd)` means our present working directory being referenced using `:/app`. Whenever we use `:` in between, we are actually mapping or referencing.
- `-v /app/node_modules` we are referencing the `node_modules` present inside the docker container as we do not want to reference the one present in the local machine
- To override the CMD (command) being executed by docker config file, you can run
  `docker run -p 3000:3000 -it -v /app/node_modules -v $(pwd):/app rahulshetty/react-app npm run test`

Now, we specifically picked up the command for testing because, this is the best approach to test a app created using create-react-app if you want to use the existing testing library i.e jest configured by Team React.

The other solution is to create a new service in the docker-compose file but unfortunately, we cannot provide any input to the service and test suites expect inputs like **'Do you wanna start all the tests again? Press a'**

### Production build

- Check the `Dockerfile` and not the `Dockerfile.dev` for comments
- Run `docker build -t rahulshetty/react-app .`
- Run `docker run -p 8080:80 rahulshetty/react-app` to see your app running on nginx

### Travis CI

- Config file `.travis.yml` seems self-explanatory
- Login to Travis CI and you'd see your build passing or failing tests

### AWS Elastic Bean stalk

- Login.
- search for Elastic bean stalk
- Provide a application name
- Provide a tag name to search the application quickly
- Choose `Docker` as the platform
- Let the default options be chosen
- Choose `Sample Application` under application code
- Remember, elastic beanstalk grows as the users on our platform increase and if one container cannot handle the traffic which is identified by the AWS load balancer
- Check `.travis.yml` config for comments about the auto deployment config
- Services -> IAM -> Users -> Add user. Add name as `learn-docker-travis-ci`. Provide programmaric access only (tick the checkbox). Click `Next Permissions`
- `Attach Existing Policies Directly` -> Search for ElasticBeanStalk -> Pick AWSElasticBeanStalkFullAccess -> Add tags if you want to -> Next:Review -> Create User
- Copy the access key and secret key. Download it as you won't get it again.
- Add the environment variables to travic CI by clicking repo settings on Travis CI and then adding the environemnt variables
- Push the changes

## Multi-container application (branch: multi-container-app)

---

### Running 3 containers together

- Look at the docker-compose file. We have added three services we want to run.
- Use `docker-compose up --build --remove-orphans` to clear the previous orphans

### Travis CI Config

- Check the Travis CI config file. Quite self explanatory
- You'd have to add environment variables to Travis CI for logging in to docker.
- The name for the environment variables would be:
  - DOCKER_ID for docker username
  - DOCKER_PASSWORD for docker password
- You might be confused with `echo "$DOCKER_PASSWORD" | docker login -u "DOCKER_ID" --password-stdin`
- Well, let's break it down. I echo the password from the environment variable set in Travis CI and then pass it to the login command using stdin.

### AWS Config

- We create a `Dockerrun.aws.json` file as opposed to directly pushing to elastic beanstalk. Where there are multiple docker container elastic bean stalk doesn't know what it's supposed to do. Hence, using the Elastic Container Service (ECS) we'll let the server know we are gonna use multiple docker container.
- The hostname that you see in the config picks the hostname from the services we run using the docker-compose config. For example, using "client" as hostname is automatically replaced with the actual hostname of the server running the client (react app).
- The essential property determines the importance of the container. If it's set to true and if the container fails, all the conatiners in the group would fail with the container.
- We do not need the hostname for nginx as no other container is using the hostname of nginx. In fact, nginx is using the name of other services/container in it's default.conf. Even if you add it's not a problem. But, remember no in is reaching out to `nginx` or `worker`
- `hostPort` refers to the port to be opened on the machine (in our case aws server) and we map that to the port specified in the container using `containerPort`
- `containerPort` refers to the port to be opened inside the container residing in the machine
- `link` property helps in creating the links in the prod server environment. It's easier for us to refer to `client` and `server` containers in our docker configs. But, for ECS to underdstand the link between different project folders, we specify it in the links property.
- Now, we haven't done any configuration related to Postgres database or redis
- We handle it using AWS Relational Database Service (RDS) and AWS Elastic Cache. Note, it has got nothing to do with docker. Usually, we should use these services for database or caching
- Watch the video 156 from the course `Docker and Kubernetes: The Complete Guide` for more details

## AWS Platform Config for deployment

- Headover to https://eu-west-1.console.aws.amazon.com/elasticbeanstalk/home?region=eu-west-1#/gettingStarted
- Provide the application name
- Choose Docker
- And then Multi-container Docker
- For connecting RDS and AWS Elastic Cache, we need to configure Virtual Private Cloud. By default, you are allotted one.
- Search for VPC by clicking on services.
- You'll find a default VPC
- Now, we also need a security group (firewall). It'll disallow requests from any other domain or you can also allow requests from all domain. By default, a security group will be created for your application. If you searched for VPC, you'd find the security group in the same side menu where VPC label has been placed.
- Search for RDS in services
- Create database
- Choose the database of choice
- Once you choose postgres, at the bottom fill in the necessary details
- Store the credentials as you'd need it later on to log in to postgres
- Click `Next`
- Select `Create New VPC security group`
- Add the database name
- Click `Next`
- It'll start building it
- Now, create AWS Elastic Cache (search in services)
- Click on Redis
- Click `Create`
- Choose the cluster engine as redis
- In Redis settings sections, provide the name and then click on `node type`. Switch to t2.micro as the default one is very expensive. Then choose, `cache.t2.micro`
- Change `Number of replicas` to 0
- Next up is the `Advanced Settings` section
- As `redis group` as the name of the subnet-group
- Select the default VPC ID
- Click Create
- Search for VPC -> Side Menu -> Security -> Security Groups
- Create security group
- Provide the name tag
- Provide the description
- Select the default VPC
- Click on Create
- Select the newly created Security Group
- Click Inbound
- Edit
- Custom TCP Rule
- Port Range (5432-6379) (Port ranges for postgres and redis)
- Source - Select the security group created. This would allow any container using the same security group
- Now, choose Elastic cache from service. Click Redis. Select the database you created. Click Modify. Click `edit` to edit the VPC group. Let the default be selected and select the new security group you have created`
- Search for RDS. Click Instances. Select your instance. Scroll to details. Note it. Scroll to the top. Click modify -> Network and Security -> Let the default be selected and add the newly created security group -> Continue.
- Search for Elastic Bean Stalk -> Your docker environment -> Configuration from Side menu -> Instances -> Modify -> EC2 Security Groups -> Your security group -> Save it
- Search for Elastic Bean Stalk -> Your docker environment -> Configuration from Side menu -> Software -> Modify -> Environment Properties
  - REDIS_HOST -> The value will be the Elastic Cache redis domain name (Search for elastic cache -> redis -> Click the arrow next to your instance and you'll get the domain name. DO NOT COPY THE PORT NUMBER WITH THE URL)
  - REDIS_PORT -> Now, you can spcify the port for redis (default 6379)
  - PG_USER -> Whatever you had set while configuring postgres
  - PG_PASSWORD -> Whatever you had set while configuring postgres
  - PG_HOST -> (Services -> RDS -> <Your Db Instance> -> Connect -> Copy the url without the port)
  - PG_PORT -> 5432
  - PG_DATABASE -> Name of the database
- For adding the `AWS_ACCESS_KEY` and `AWS_SECRET_KEY` in travis.yml file, follow the below given steps:
  - Search for `IAM` in services
  - Click on `Users` from the sidemenu
  - Add User
  - Add a username
  - Access type - `Programmatic Access`
  - Next
  - Attach existing policies
  - Search for `beanstalk`
  - Add all the elactic bean stalk options which has a type of `AWS managed`
  - Next -> Create User
  - You'll get the access key ID and the secret key
  - Add the ID and secret key as environment properties in travis CI. Go to your project -> More options -> Settings -> Environment Variables
