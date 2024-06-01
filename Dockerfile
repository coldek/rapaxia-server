FROM node as base
WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
RUN sudo add-apt-repository ppa:thomas-schiex/blender && apt-get update && apt-get install python3.8 && apt-get install blender=2.93.2
RUN npm ci
COPY . .