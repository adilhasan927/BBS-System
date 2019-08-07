# Build and development instructions

Make sure Git, npm, Node.js, and MongoDB are present on your system. Clone the `bbs-system` repository using git. Issue the `npm install` command in the `bbs-system-backend` and `bbs-system-frontend` directories to install the project dependencies.

A start script, [start.bat](./start.bat) is located in the program root directory. It may be used to start the application for development on Windows. Alternatively, the following platform-agnostic steps can be followed.

Issue the `mongod` command to start the database server. It will by default broadcast on [localhost:27017](http://localhost:27017). Issue the `npm start` command in the `bbs-system-backend` folder to start the backend server. It will by default broadcast on localhost:3200. Issue the `ng serve` command in the `bbs-system-frontend` folder to start the frontend testing server. It will by default broadcast on [localhost:4200](http://localhost:4200).

Alternatively, issueing the `ng build --prod` command will build the frontend application for deployment somewhere other than the testing server, configured for production.

Navigate to [http://127.0.0.1:4200](http://127.0.0.1:4200) to view the application frontend. You will need to disable your browser's CORS protections for the frontend application code to be able to communicate with the backend.

For Chrome on Windows these tasks can be done by running the following command in `cmd.exe`.

```bat
"start chrome.exe http://127.0.0.1:4200 --user-data-dir="C:/Chrome dev session" --disable-web-security
".
```

Using 127.0.0.1 instead of localhost is necessary because Google's reCaptcha service does not support localhost URLs.

Configuration of the application is not currently fully implemented. The backend server port and frontend FQDN can be edited on the backend in the [config.json](./bbs-system-backend/config.json) file. The CORS settings can be edited on the backend in the [app.js](./bbs-system-backend/app.js) file. Changing the reCaptcha site key or the backend server FQDN will require changing hardcoded values in multiple places in the frontend application code.
