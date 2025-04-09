## Description

BE: NestJS (11.5)

FE: Laravel (12) + VueJS

## API setup
1. Go to ``api/`` directory
2. Run 
```bash
$ npm run install
```
3. Setup environment variables in .env
4. Run
```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## FrontEnd setup
1. Go to ``docker/`` directory
2. Run
```bash
$ docker-compose up -d
```
3. Go to ``fe/`` directory
4. Copy .env.example to .env. Setup environment variables in .env
5. Run
```bash
$ npm install
$ npm run build
```
5. Go to ``php`` container
6. Run
```bash
$ composer install
```
