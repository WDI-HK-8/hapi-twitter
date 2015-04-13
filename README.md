Twitter Back-end built with Hapi.js and MongoDB
-

- [Tweets](#tweets)
- [Users](#users)
- [Sessions](#sessions)

<a name="tweets"></a>
## Tweets


##### List all Tweets
    > [GET] /tweets
- Response
```js
[
    {
        _id: "552ba164ba5d0917e86e0fa9",
        message: "Today is awesome!"
    },
    {
        _id: "552ba1b717bfb46ce99fb379",
        message: "Fork the Repo"
    },
    {
        _id: "552ba1c517bfb46ce99fb37a",
        message: "Did you check out Apple Watch?"
    }
]
```


##### Retrieve a Tweet
    > [GET] /tweets/{id}
- Response
```js
{
    _id: "552ba1b717bfb46ce99fb379",
    message: "Fork the Repo"
}
```


##### Create a new Tweet
    > [POST] /tweets
- Parameters
    - message (required, string, max chars: 140)
- Response
```js
{
    "ok": 1,
    "n": 1
}
```


##### Delete a Tweet
    > [DELETE] /tweets/{id}
- Response
```js
{
    "ok": 1,
    "n": 1
}
```

<a name="users"></a>
## Users


##### List all Users
    > [GET] /users
    > [GET] /users/{username}
- Response
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


##### Retrieve a User
    > [GET] /users/{username}
- Response
```js
{
    _id: "552ba10e74bfd2efe6135122",
    username: "fer",
    password: "$2a$10$DT5vwOmlZs.EYLwwBc6Hb.bzNRydIhT6j4M5erzaf3jNbkBX1a/.e"
}
```


##### Create a new Users
    > [POST] /users

- Parameters
    - username (required, string, max chars: 20)
    - password (required, string, max chars: 20)
- Response
```js
{
    "ok": 1,
    "n": 1
}
```


<a name="sessions"></a>
## Sessions


##### Create a new Session





