# Specify a base image. For example, if you wanna run chrome in a PC you need to install the OS which comes prebundled with some of it's  own tools
FROM node:alpine

# We do not want our files to be scattered in the root directory of the image
# So, we can specify the root directory to copy our files to the right place
WORKDIR /usr/app

# Copy our files to the container as the container isn't aware of your files
COPY ./ ./

# Install some dependencies
RUN npm install

# Default commands
CMD ["npm", "start"]