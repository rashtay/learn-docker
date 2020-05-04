# Production environment
# Specify a base image. For example, if you wanna run chrome in a PC you need to install the OS which comes prebundled with some of it's  own tools
# By adding the stage name as builder, we refer to anything after from to be a part of the builder phase
FROM node:alpine as builder

# We do not want our files to be scattered in the root directory of the image
# So, we can specify the root directory to copy our files to the right place
WORKDIR /app

# Copy package.json before copying all files so that we only re-install npm modules if anything changes in package.json
COPY package*.json ./

# Install some dependencies
RUN npm install
RUN npm audit fix

# Copy our files to the container as the container isn't aware of your files
COPY . .

# Command to run
RUN npm run build

# Now we are done with previous build
# Let's start a new build because we are creating a multi-step build for building the app and deploying to nginx
FROM nginx

# EXPOSE 80 is just a way to let users know that our app is running at PORT 80
# It's not helpful for DOCKER at all.
# But ElasticBeanStalk uses picks of this config and runs our application on this port
EXPOSE 80

COPY --from=builder /app/build /usr/share/nginx/html