# Bahnar Translation Web

This is the frontend repository of Bahnar Translation Web.

---

## Requirements

For development, you will need

- `Node.js`.

## Install

$ npm install

## Running the project locally

$ npm start

## Simple build for production

$ npm run build

## If husky doesn't run, please add the following command and try again

```
$ chmod ug+x .husky/*
$ chmod ug+x .git/hooks/*
```

## Use compatible NodeJS version using Node Version Manager

$ nvm use

## Using Docker
```
docker build -t bahnar_nmt_fe_v2:latest .
docker run -it -p 10009:3000 -d bahnar_nmt_fe_v2:latest -n bahnar_nmt_fe_v2
```