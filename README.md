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
PRIVATE_KEY=
ALCHEMY_API_KEY=
```
Use the demo key during demp

### Deployment
``` npm install --legacy-peer-deps ```
Installs the dependencies for the the app with node command. 
For now, use the `legacy-peer-deps` to resolve conflicts between libraraies due to version mismatch of dependencies. For ex, SIWE and Ethers.
Over the long-term, we would refactor the code to remove the need for using the above flag.

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

## Find and delete a process
```
sudo lsof -i :1339
kill -9 <PID>
