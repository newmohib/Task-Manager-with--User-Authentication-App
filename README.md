### Run The Task Manager App

### Pre Requirements install

- node >= 20
- local or remote MySQL Database
- install MySQL database Client/you can also use CLI
- install git

#### Clone the codebase

```
- git clone https://github.com/newmohib/Task-Manager-with--User-Authentication-App.git
```

- migration sql file got to ./src/migrations/script.sql:
- create a database
- run this sql file or content using your mysql DB Clint
- update .env.dev file evironment variable for this as for you configuration

```
    APP_SECRET ='mysecretkey'

    DB_COLLECTION_NAME='/amazon_demo'
    DB_ERROR_COLLECTION_NAME='/error_amazon_demo'
    MYSQL_URL='mysql://user:password@host:3306/db'

    APP_URL='http://localhost:8000'

    ADMIN_APP_URL='http://localhost:3000'
    # Port
    PORT=8000
    ADMIN_END_PORT= 4000
    # Mail Config

    SMTP_HOST=
    SMTP_PORT=
    SMTP_USER=
    SMTP_PASS=''
    SMTP_SECURE=true
```

- for frontend configuration:
- copy .env.example to .env file
- update backend Environment variable

```
 REACT_APP_API_URL=http://localhost:8000

```

##### install back end and frontend for both open tow Terminal

```
- backend: npm i
- frontend:
- cd client
- npm i
```

##### Run the application for local

```
- backend: npm run dev
- fronend: npm start
```

##### Deploy the server and run (VPS)

```
- frontend build: npm run build
- global install pm2: npm i -g pm2
- Run: npm run prod
```
