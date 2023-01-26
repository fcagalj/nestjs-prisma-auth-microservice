# Clipboard Health - Coding Exercise

## Description
Clipboard Health coding exercise, sample NestJS microservice with Prisma ORM and SQLite database. Microservice expose 
REST API for CRUD operations on the database, and require user login to access API.

## API

Before accessing the API, you need to login to the service. Login endpoint is not protected, and returns JWT token that 
enables access to the API.

### Register new user

```bash
curl --location --request POST 'http://localhost:3000/auth/register/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "login": "frane",
    "password": "abcd1234",
    "name": "frane cagalj"
}'
```
### Login

```bash
curl --location --request POST 'http://localhost:3000/auth/login/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "login": "frane",
    "password": "abcd1234"
}'
```

Replace Authorization header with the token you received from the login endpoint to access the API.

### Add employee record

```bash
curl --location --request POST 'http://localhost:3000/employee/' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImZyYW5lIiwiaWF0IjoxNjc0NzQxNTE4LCJleHAiOjE2Nzk5MjU1MTh9.QHO3FTXR6hYoDu8fqnFkB_vB8ZLd3rZ_TfLzxgTyNWI' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Abhishek",
    "salary": 145000,
    "currency": "USD",
    "department": "Engineering",
    "subDepartment": "Platform"
}'
```

### Remove employee record

```bash
curl --location --request DELETE 'http://localhost:3000/employee/4' \
--data-raw ''
```

### Get Summary Statistics (min, max, mean) for all employees

```bash
curl --location --request GET 'http://localhost:3000/statistic-all' \
--data-raw ''
```

### Get Summary Statistics (min, max, mean) for contractors

```bash
curl --location --request GET 'http://localhost:3000/statistic-contractors' \
--data-raw ''
```

### Get Summary Statistics (min, max, mean) by departments

```bash
curl --location --request GET 'http://localhost:3000/statistic-departments' \
--data-raw ''
```

### Get Summary Statistics (min, max, mean) by sub departments

```bash
curl --location --request GET 'http://localhost:3000/statistic-subdepartments' \
--data-raw ''
```

## Technologies

- [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
- [Prisma ORM](https://www.prisma.io/) for database access. 
- SQLite  

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ docker-compose up

# production mode
not implemented
```

## Test

Run tests within the docker container!

```bash
# unit tests
$ yarn test

# e2e tests
not implemented
```

## Author

Frane Cagalj
- [LinkedIn](https://www.linkedin.com/in/frane-cagalj)
- [GitHub](https://github.com/fcagalj)
- [Twitter](https://twitter.com/fcagalj)
- [CV](https://docs.google.com/document/d/1bxLE7zjZpd6YsHXlwznFKo00tl1r-EPBudBQ_py-P00)
