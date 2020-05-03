# Learn Docker

---

### Mapping localhost running on a port to docker image's localhost port

`docker run -p 8080:8080 rahulshetty/nodeapp`

`8080:8080` means redirect the request received locally localhost:8080 to the docker image's localhost:8080

It doesn't matter what PORT you are accepting from the local machine, but you should redirect to the right port. For example, `5000:8080` will run without any issues on hitting `localhost:5000`

`rahulshetty/nodeapp` is the tag name so that we don't have to run the container with an id

To build with a tag, run docker `build -t rahulshetty/nodeapp .`. REMEMBER the `.` at the end is very important.

### Enter the OS

You can either run:

`docker run -it rahulshetty/nodeapp sh`

OR

`docker exec -it <id we get from building or docker ps running id> sh`

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
