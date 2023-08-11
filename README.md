# Dependencies

## Frontend (React, NodeJS)

### Install dependencies using
```
npm install

# OR, if you are in the root directory
cd frontend && npm install
```

### Deploy (development) using
```
npm start

# OR, if you are in the root directory
cd frontend && npm start
```

### Deploy (production) using
```
npm run build

# OR, if you are in the root directory
cd frontend && npm run build
```

Above command will export entire react app as static files to /server/static folder.

### Configuration
See [./frontend/.env](./frontend/.env) for configuration options

## Backend (Django, Python)

### Deploy (development) using
```
python manage.py runserver

# OR, if you are in the root directory
cd server && python manage.py runserver
```

Visit `http://localhost:8000/client/index.html` to access client portal.
Visit `http://localhost:8000/admin` to access admin portal.
