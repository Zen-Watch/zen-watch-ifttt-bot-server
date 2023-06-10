# Zen Watch IFTTT Bot Server
A bot server to handle server callbacks from Zen IFTTT without starting from scratch.

## Config files
```
SERVER_PORT=1339
ALLOWED_API_KEY_REAL=
ALLOWED_API_KEY_DEMO=
# ALLOWED_API_KEY_DEMO=1234567890
GMAIL_USER=
GMAIL_PASSWORD=
```
Use the demo key during demp

### Deployment
``` npm install ```
Installs the dependencies for the the app with node command.

``` npm start ```
Starts the app with node command.

``` npm run dev ```
Starts the app with nodemon command, for live reload during development.

### Start the processes with PM2 in production
```
For api-server, run from the root folder: 
npm run build
pm2 start app.config.json
```

### To list, stop or delete the PM2 process
```
pm2 stop <process-name>
pm2 delete <process-name>
pm2 ls
```

### Find and kill a process
```
sudo lsof -i :<PortNumber>
kill -9 <PID>
```

## Find and kill a process
```
sudo lsof -i :1339
kill -9 <PID>