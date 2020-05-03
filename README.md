# Mapping localhost running on a port to docker image's localhost port

`docker run -p 8080:8080 rahulshetty/nodeapp`

`8080:8080` means redirect the request received locally localhost:8080 to the docker image's localhost:8080

It doesn't matter what PORT you are accepting from the local machine, but you should redirect to the right port. For example, `5000:8080` will run without any issues on hitting `localhost:5000`

`rahulshetty/nodeapp` is the tag name so that we don't have to run the container with an id

To build with a tag, run docker `build -t rahulshetty/nodeapp .`. REMEMBER the `.` at the end is very important.

# Enter the OS

You can either run:

`docker run -it rahulshetty/nodeapp sh`

OR

`docker exec -it <id we get from building or docker ps running id> sh`
