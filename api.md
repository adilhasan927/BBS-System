# API documentation

## JWT endpoints

Endpoints marked as JWT require JWT authentication to use. The JWT is provided in the `Authorization` request header using the `Bearer` token scheme. The JWT is issued by the server.

POSTing to /api/login or /api/signup returns a JWT with a `username` claim. Email verification links require a JWT with a `username` and an `emailed` claim.

## Captcha endpoints

Captcha endpoints require a captcha to be completed to be used. The JSON-encoded request body should be of the format `{ captchaResponse: ..., ... }`, where `captchaResponse` contains the reCaptcha widget response.

## Endpoints list

## /api/account/email

### POST /api/account/email

JWT: Yes

Captcha: Yes

Query parameters: null

JWT claims required: username, emailed

Other headers: null

Request body: null

Response body: null

Notes: Uses a JWT with an `emailed` claim set to `true`, issued only for email varification.

Usage: Resends email verification link.

## /api/account/profile

### GET /api/account/profile

JWT: Yes

Captcha: No

Query parameters: null

JWT claims required: username

Other headers: null

Request body: null

Response body:

```JSON
{ body: {
  profile: {
    profileText: ..., //string
    profileImage: ... //base64 image/png
  },
  verified: ..., //boolean
}
```

Notes: null
Usage: Returns profile data.

### PUT /api/account/profile

JWT: Yes

Captcha: No

Query parameters: null

JWT claims required: username

Other headers: null

Request body:

```JSON
{
  profile: {
    profileText: ..., //string
    profileImage: ... //base64 image/png
  }
}
```

Response body: null

Notes: Profile image must be 100x100px `image/png` file.

Usage: Sets profile data.

## /api/friends/accepted

### GET /api/friends/accepted

JWT: Yes

Captcha: No

Query parameters: username

JWT claims required: username

Other headers: null

Request body: null

Response body: null

Notes: `username` query param indicates user queried.

Usage: Returns whether queried user is in friends list.

### DELETE /api/friends/accepted

JWT: Yes

Captcha: No

Query parameters: username

JWT claims required: username

Other headers: null

Request body: null

Response body: null

Notes: `username` query param indicates user queried.

Usage: Deletes queried user from friends list.

## /api/comment

### GET /api/comment

JWT: Yes

Captcha: No

Query parameters: PostID, position, limit, listingID

JWT claims required: username

Other headers: null

Request body: null

Response body: null

Notes: `PostID` query param indicates post comments retrieved from.
`position` query param indicates position in list, used for pagination.
`limit` query param indicates number of comments to retrieved, used for pagination.
`listingID` query param indicates name of subforum post is in.

Usage: Gets section of list of comments on post.

### POST /api/comment

JWT: Yes

Captcha: No

Query parameters: PostID, listingID

JWT claims required: username

Other headers: null

Request body:

```JSON
{
  body: ... // string
}
```

Response body: null

Notes: `PostID` query param indicates post comment posted to.
`listingID` query param indicates name of subforum post is in.
`body` JSON field indicates text of comment.

Usage: Posts comment to post.

## /api/post

### GET /api/post

JWT: Yes

Captcha: No

Query parameters: position, limit, listingID

JWT claims required: username

Other headers: null

Request body: null

Response body: null

Notes: `position` query param indicates position in list, used for pagination.
`limit` query param indicates number of posts to retrieved, used for pagination.
`listingID` query param indicates name of subforum post is in.

Usage: Gets section of list of posts in subforum.

### POST /api/post

JWT: Yes

Captcha: No

Query parameters: listingID

JWT claims required: username

Other headers: null

Request body:

```JSON
{
  body: ... // string
}
```

Response body:

```JSON
{
  body: id // string
}
```

Notes: `listingID` query param indicates name of subforum post is to be posted to.
`body` JSON field indicates ID of created post.

Usage: Posts post to subforum.

## /api/files

### GET /api/files

JWT: Yes

Captcha: No

Query parameters: filename

JWT claims required: username

Other headers: null

Request body: null

Response body: binary blob

Notes: `filename` query parameter indicates name of file to get.
Response will be binary blob encoding `image/png` file.

Usage: Gets user-uploaded file from server.

### POST /api/files

JWT: Yes

Captcha: No

Query parameters: null

JWT claims required: username

Other headers: null

Request body: `multipart/form-data` file

Response body: string

Notes: 2MB file size limit.
File should be in `image/png` format to be displayed correctly.
Response will be filename of uploaded file.

Usage: Uploads file to server.

## /api/forums

### POST /api/forums

JWT: Yes

Captcha: Yes

Query parameters: null

JWT claims required: username

Other headers: null

Request body:

```JSON
{
  listingID: ..., // string
  description: ... // string
}
```

Response body: null

Notes: `listingID` request body field indicates subforum name.
`description` request body field indicates subforum description.
Subforum names must use the `main.[forumname]` format.

Usage: Creates subforum.

## /api/login

### POST /api/login

JWT: No

Captcha: Yes

Query parameters: null

JWT claims required: null

Other headers: Authorization (Basic)

Request body: null

Response body:

```JSON
{
  body: token // string
}
```

Notes: Username and password provided in the `Authorization` header using the `Basic` scheme.

JWT returned as `body` field of response body.

JWT has `username` claim defined, conferring access to auth-requiring endpoints other than `/api/account/email`.

Usage: Logs user in, returning JWT.

## /api/signup

### POST /api/signup

JWT: No

Captcha: Yes

Query parameters: null

JWT claims required: null

Other headers: null

Request body:

```JSON
{
  credentials: {
    username: ..., // string
    password: ..., // string
    email: ... // string
  }
}
```

Response body:

```JSON
{
  body: token // string
}
```

Notes: Account credentials provided in the `credentials` field of the request body.
JWT returned as `body` field of response body.
JWT has `username` claim defined, conferring access to auth-requiring endpoints other than `/api/account/email`.

Usage: Creates user account, returning JWT.

## Sockets API

Socket.IO is used for the real-time messaging service. The default path of '/socket.io' is used

Upon connection establishment the client should emit the `listen` event, authenticating themselves for room access. They should then emit the `joinConversation` event to join a conversation room.

The `sendMessages` event should be used to send messages. The client should listen for the `messages` event to receive messages; `getMessages` should only be used to read message history, not as some kind of real-time polling mechanism.

Ordering messages with regards to age is the responsibility of the client; for this purpose a `timestamp` field is included in each message.

## listen

Takes JWT with `username` claim as argument and authenticates user.

Should be emitted whenever the `connection` event is.

## joinConversation

Takes username of user client requests to chat with as argument.

Should be emitted whenever the client requests to join a conversation with a user.

Joining a conversation is required to send and receive events related to it. A conversation with a user can only be joined if the username is in the client's friends list. A client may be in only one conversation at a time. Joined rooms are cleared upon disconnection.

## messages

Given list of messages as argument. Emitted by the server whenever messages are to be sent to a client.

This may be emitted if the client is sent a message by another client. It may also be emitted as the result of the client emitting the `getMessages` event. The message list of a message event is ordered by timestamp, but message events may not be emitted in order.

## getMessages

Takes a location object as argument. The location object has the following structure.

```JSON
{
  position: ..., // number
  limit: ... // number
}
```

Position specifies an offset from the latest message, at which to retrieve messages. Limit specifies how many messages to retrieve. This is used for retrieval of past messages.

Emission of a `getMessages` event by the client results in the server emitting a `messages` event with the specified messages.

## sendMessages

Takes a message object as argument. The message object has the following structure.

```JSON
{
  timestamp: ..., // number
  from: ..., // string
  body: ..., // string
  filename: ... // string
}
```

The `timestamp` field does not determine the timestamp of the stored message; it is overwritten by the server with the server-determined timestamp upon receipt.

Emission of a `sendMessage` event by the client results in the server emitting a `messages` event containing the message in its associated messages array.

Although currently an independent `messages` event is emitted for each `sendMessage` event, with a singleton messages array containing the message, this behaviour is subject to change and should not be relied upon.
