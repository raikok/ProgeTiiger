FROM node:16.15.1-stretch-slim as builder
WORKDIR /app

RUN apt-get update
RUN apt-get install -y python3-pip
RUN --mount=type=cache,target=/root/.cache pip3 install pandas openpyxl

COPY ./package.json ./
RUN npm i
COPY . /app
CMD ["npm", "run", "start"]