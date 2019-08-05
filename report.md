# Report on the BBS System project

## Project history

### July 8th, 2019

Work on the BBS System web app project began on this date.
The root folder, `bbs-system`, was created.
A mongodb database, `documents`, was intialised through the Mongodb Compass Community GUI.
A backend folder and a frontend folder were created, and `npm init` run in both. The ExpressJS CLI and Angular CLI were installed through `npm install`.
The backend was scaffolded through the ExpressJS CLI (`express --view pug bbs-system-backend`). The frontend was scaffolded through the Angular CLI (`ng new bbs-system-frontend`).
The `bbs-system` folder was initialised as a git repo (`git init`) and as a Visual Studio Code workspace (VS Code GUI. The intial Git commit was performed (`git add . ; git commit`).

### July 9th, 2019

The first lines of project code were authored on this date. The login and signup page was implemented on the Angualar frontend, and the corresponding backend code on the Express backend.
The two parts communicated through a well-defined API. The API was exposed through ExpressJS router on the backend, with endpoints stored in the `routes` folder. The frontend interacted with it through an Angular service, `api.service.ts`.
The app at this stage was quite minimal, with the login and signup pages missing features such as validation of data, error handling, reCaptcha and email verification.
The database was configured, with collections created and indexed.
Code was written in the backend to interface with the database.

### July 10th, 2019

It became possible to submit content to the databse, with the first iteration of the posting feature implemented. At this point there was no implementation of subforums; rather all posts were made to a single central board.
The codebase was refactored to remove the placeholder code from the automated scaffolding.
The user profiles feature was scaffolded.

### July 11th, 2019

The user profiles API was implemented on the backend, with routes defined corresponding to the API endpoints. The API-handling code was then written in the API service. After this the UI code for the profile page component was written, communicating with the API through the API service.
It is important in a single-page application (SPA) we maintain a seperation between the backend and frontend code. The two parts of the codebase must be written as self-contained programs that can run 
independently of each other, communicating through an API.
It is also important that code handling features that must be provided throughout the app, such as client-side storage, network access, and recording program state, be decoupled from the stateless UI code.
This is done by seperating such features into "services", which are then injected into UI-handling "components" that require them through the Angular dependency injection system.
This practice promotes code reuse and separation of concerns.
Basic CSS styling was also implemented.

### July 12th, 2019

Commenting on posts was implemented. This required significant modifcations to the database structure. As mongodb is a schemaless database, no modification of existing documents was required; only application code needed to be changed.
Pagination of comments and posts was implemented. Pagination of long lists is important, as it keeps data retrieval times from increasing with list length and reduces the retrieval of unnecessary data.
The scaffolding for data validation and sanitisation was done on the backend. The frontend cannot be trusted with such tasks, as an attacker may modify frontend code or directly communicate with API endpoints.
Data validation should still be implemented on the frontend to inform the user of invalid data without necessitating network communication, but upon data submission must be repeated on the backend.
Password confirmation was also implemented on the signup page, as an Angualr. This is used so that the user doesn't mistype their password when setting it, and find themselves unable to log in.

### July 15th, 2019

Captchas were implemented, using Google's reCaptcha service. Captchas are useful to prevent automated attacks, i.e. to deter spambots from creating accounts and spamming the site.
Email verification was implemented. This is used to verify that the email account entered on the signup page actually belongs to the client.
Email verification was implemented using the `nodemailer` module. It is a good idea to delegate features to external libraries or modules if possible, to save programmer time and take advantage of a well-tested and mature codebase.
The application was changed to use JSON Web Tokens (JWTs) for user authentication. JWTs are a form of stateless session management. The backend issues a digitally signed JSON-serialised object, its structure defined by the JWT standard. The frontend stores this and sends it to the backend whenever authentication is required. The backend uses its private or secret key to verify it was indeed issued by the backend.
The JWT can store an expiry date and other claims, which can be read by the backend and frontend and verified by verifying the signature on the JWT.

### July 16th, 2019

The JWT stored a username claim, which the frontend used to find out the username of the current user.
Post comment pages are handled through a post ID associated with every post, derived from the `post._id` field in the corresponding database collection. Creating a new post by sending an HTTP `POST` request to the `/api/post` endpoint returns the `post._id`, which the backend uses to link tot he comments page.
Resending verification emails was implemented. This is important so that the user can still verify their account if the email is deleted or otherwise lost.
Client-side access control was implemented using Angular Guards. This is not to be used as a security feature. Rather, it is to improve the user experience (UX).
Passing of errors from the backend and the frontend was implemented. It is important to handle errors, as application crashes or misbehaviours are detrimental to the UX.
It is also important to notify the user of errors, as silent failures are also detrimental to the US.

## July 17th, 2019

Server-side validation of user-submitted data was implemented.
Profile pictures were implemented. For convenience they were sotred as base64 encoded strings in the database. A file size of 100x100px was specified.
For files larger than 16 MB GridFS can be used to store them in MongoDB, or they can be stored as file paths with the actual files residing in the filesystem.
Caching of HTTP GET requests was scaffolded as an Angular HttpInterceptor. Although the results of HTTP GET requests are already cached in the browser, the requests themselves are not, resulting in errors when attempting to GET data from the server while offline.
True offline capability could be provided by implementing the application as a Progressive Web App (PWA), using Service Workers to serve the app while offline.
Refactoring of independent UI features into distinct components was conducted.

### July 18th, 2019

The caching HttpInterceptor war implemented. It stores the most recent GET request to a resource and returns its result as the server response when the client is offline.
The error-handling code on the backend was modifed to return the correct HTTP status code to the client in the event of an error. Usage of standard HTTP features is part of designing a RESTful API.

### July 19th, 2019

The frontend was modified to make use of the HTTP status code returned by the server in client-side error-handling.
The application was changed to provide the JWT in the `Authorisation` header of an HTTP request, using the `Bearer` token scheme.
The API was changed to be a stateless REST maturity level 2 API.
