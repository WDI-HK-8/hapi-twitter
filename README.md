# Twitter Back-end built with Hapi.js and MongoDB

## Installation & Running

```
$ npm install
$ node .
```

## Deploy on Heroku
```
$ heroku create
$ git push heroku master
```

## Instructions (step-by-step)
- [Getting Started](instructions/getting_started.md)
- [Users](instructions/users.md)
- [Sessions](instructions/sessions.md)
- [Tweets](instructions/tweets.md)

## API Documentation

### [Tweets](#tweets)
| Method | Path | Description |
|---|---|---|
| GET | /tweets | List all tweets |
| GET | /users/{username}/tweets | List all Tweets of a specific user |
| GET | /tweets/{id} | Retrieve a tweet |
| POST | /tweets | Create a new tweet (require user authentication) |
| DELETE | /tweets/{id} | Delete a Tweet (require user authentication) |

### [Users](#users)
| Method | Path | Description |
|---|---|---|
| GET | /users | List all users |
| GET | /users/{username} | Retrieve a user |
| POST | /users | Create a new user |

### [Sessions](#sessions)
| Method | Path | Description |
|---|---|---|
| POST | /sessions | Create a new session |
| GET | /authenticated | Check if you are authenticated |
| DELETE | /sessions | Delete a Session (Logout) |


<a name="tweets"></a>
## Tweets
### List all Tweets

> [GET] /tweets

**Response**
```js
[
    {
        _id: "552ba164ba5d0917e86e0fa9",
        message: "Today is awesome!",
        user_id: "ABC"
    },
    {
        _id: "552ba1b717bfb46ce99fb379",
        message: "Fork the Repo",
        user_id: "ABC"
    },
    {
        _id: "552ba1c517bfb46ce99fb37a",
        message: "Did you check out Apple Watch?",
        user_id: "EFG"
    }
]
```

### List all Tweets of a specific user

> [GET] /users/{username}/tweets

**Response**
```js
[
    {
        _id: "552ba164ba5d0917e86e0fa9",
        message: "Today is awesome!",
        user_id: "ABC"
    },
    {
        _id: "552ba1b717bfb46ce99fb379",
        message: "Fork the Repo",
        user_id: "ABC"
    }
]
```

### Retrieve a Tweet
> [GET] /tweets/{id}

**Response**
```js
{
    _id: "552ba1b717bfb46ce99fb379",
    message: "Fork the Repo"
}
```

### Create a new Tweet
> [POST] /tweets

- Parameters
    - message (required, string, max chars: 140)

**Response**
```js
{
    "ok": 1,
    "n": 1
}
```

### Delete a Tweet
> [DELETE] /tweets/{id}

**Response**
```js
{
    "ok": 1,
    "n": 1
}
```

<a name="users"></a>
## Users

### List all Users
> [GET] /users

**Response**
```js
[
    {
        _id: "552ba10574bfd2efe6135121",
        username: "harry",
        password: "$2a$10$6a4wcV6DQL3ys1nWus240e5EQxcK6EcXTwcyrr3Bd5Squelayf/5W"
    },
    {
        _id: "552ba10e74bfd2efe6135122",
        username: "fer",
        password: "$2a$10$DT5vwOmlZs.EYLwwBc6Hb.bzNRydIhT6j4M5erzaf3jNbkBX1a/.e"
    }
]
```

### Retrieve a User
> [GET] /users/{username}

**Response**
```js
{
    _id: "552ba10e74bfd2efe6135122",
    username: "fer",
    password: "$2a$10$DT5vwOmlZs.EYLwwBc6Hb.bzNRydIhT6j4M5erzaf3jNbkBX1a/.e"
}
```

### Create a new Users
> [POST] /users

- Parameters
    - username (required, string, max chars: 20)
    - password (required, string, max chars: 20)

**Response**
```js
{
    "ok": 1,
    "n": 1
}
```

<a name="sessions"></a>
## Sessions

### Create a new Session
> [POST] /sessions
 
- Parameters
    - username (required, string, max chars: 20)
    - password (required, string, max chars: 20)

**Response**
```js
{
    "message:": "Authenticated"
}
```

### Check if you are authenticated
> [GET] /authenticated

**Response**
```js
// if authenticated
{
    "authenticated": true,
    "message": "Authorized"
}

// if not authenticated
{
    "authenticated": false,
    "message": "Unauthorized"
}
```

### Delete a Session (Logout)
> [DELETE] /sessions

**Response**
```js
// if already logged out
{
    "message": "Already logged out"
}

// if successfully logged out
{
    "ok": 1,
    "n": 1
}
```