# Open Closet-Backend

This project is an application that manages items such as clothes and accessories that you have with data, and shares them with other users.

Project Link: [https://quizzical-panini-3b7a85.netlify.app/]

Test Account
Email: test@test.com
Password: TestPassword

Frontend : [https://github.com/Kazumakr/MERN_OpenCloset_frontend]

## Table of Contents (Optional)

- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [References](#references)

## Description

I built this project for three reasons:
1: I want to see what clothes I have in my closet while shopping.
2: I want to see what kind of clothes other people have.
3: I want to see my friends' sizes and what kind of clothes they like (e.g. colors, brands, etc.) when choosing gifts for them.

It would also be useful for community creation and marketing purposes because of its social media features such as follow, comment, and like.

Through this project, I learned the knowledge for creating social media and e-commerce sites, such as follow feature, search and sort functions.

Since this is the second project in the MERN stack, I learned how to handle an image file with GridFs and how to use the relation schema through the previous project.

### Built With

- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)
- [Node.js](https://nodejs.org/)

## Features

- Add an item
- Delete an item
- Edit an item
- Get items(by category,subcategory,color, searchTerm)
- Sort items(newest, lowest price, highest price)
- Likes/Unlikes
- Follow/Unfollow
- Comment
- Get following user's items
- Get liked items
- Authentification(SignUp/Login)
- Get users(by height, gender, searchTerm)
- Edit user information
- Delete a user
- Upload an image to MongoDB
- Delete an image

## Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Kazumakr/MERN_OpenCloset_backend
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Enter your MONGO_URL in `.env`. You can get it from here(https://cloud.mongodb.com)
   ```shell
   MONGO_URL = "ENTER YOUR CONNECTION STRING";
   ```
4. start
   ```sh
   npm start
   ```

## Usage

## User

### Create a new user(sign up)

`POST /api/auth/register`

### Login

`POST /api/auth/login`

### Get all users

`GET /api/users/`

### Search users(e.g. Username: Tom, minHeight: 170cm, maxHeight: 176cm, Gender: Male)

`GET /api/users/?search=Tom`
`GET /api/users/?minheight=170&maxheight=176`
`GET /api/users/?gender=Male`

### Get single user

`GET /api/users/:id/`

### Update user infomation

`PUT /api/users/:id/`

### Delete user

`DELETE /api/users/:id/`

### Follow user(:id=ID of the user to be followed)

You need a request body {userId:current user's ID}

`POST /api/users/:id/follow`

### Unfollow user(:id=ID of the user to be unfollowed)

You need a request body {userId:current user's ID}

`POST /api/users/:id/unfollow`

## Item

### Create a new item

`POST /api/items/`

### Update an item information

`PUT /api/items/:id`

### Delete an item

`DELETE /api/items/:id`

### Get a specific user's items

`GET /api/items/filteritem/:id`

### Get a single item by id

`GET /api/items/:id`

### Search items(e.g. Category: clothing, Subcategory: tops, Color: white, Itemname: Jacket, Sort: newest)

`GET /api/items/filteritem/:id/?category=clothing`
`GET /api/items/filteritem/:id/?subcategory=tops`
`GET /api/items/filteritem/:id/?color=white`
`GET /api/items/filteritem/:id/?search=Jacket`
`GET /api/items/filteritem/:id/?sort=newest`

### Add a comment to an item

You need a request body {comment: content of a comment ,username: current user's name, userId: current user's ID,}

`PUT /api/items/:id/comments`

### like

You need a request body {userId:current user's ID}

`PUT /api/items/:id/likes`

### unlike

You need a request body {userId:current user's ID}

`PUT /api/items/:id/unlikes`

### Get liked items

`GET /api/items/likeditems/:id`

## Image

### Upload an image to DB

`POST /api/upload/`

### Get an image from DB

`GET /api/image/:filename`

### Delete an image from DB

`DELETE /api/image/:filename`

## License

License under the [MIT License](LICENSE)

## References

- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)
- [Node.js](https://nodejs.org/)
- [Font Awesome](https://fontawesome.com)
- [React Icons](https://react-icons.github.io/react-icons/search)
- [Qiita](https://qiita.com)
- [stack overflow](https://stackoverflow.com)
- [BezKoder](https://www.bezkoder.com)
- [YouTube](https://www.youtube.com)
- [DEV Community](https://dev.to)
- [MDN](https://developer.mozilla.org/)
- [HTML DOM](https://htmldom.dev/)
- [mongoose](https://mongoosejs.com/)
- [Medium](https://medium.com/)
