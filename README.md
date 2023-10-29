# Altschool-second-semester-blog-api-exam

Digital Chronicles API is a simple blog service for reading, and creating blogs.
<br/>
API Docs: https://documenter.getpostman.com/view/25856069/2s9YRGyUus

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Demo

You can try out the live demo of Digital Chronicles at [https://altschool-blog-service.onrender.com/views/welcome](https://altschool-blog-service.onrender.com/views/welcome).

## Features

- Read Blogs.
- Create a blog.
- Sending of mails when successfully sign up
- Sign up with Google Oauth
- Upload files to Cloudinary
- Edit a blog


## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Cloudinary
- Swagger
- Multer
- Nodemailer
- JWT (JSON Web Tokens) for authentication
- Passport for Oauth

## Installation

To run Digital Chronicles locally, follow these steps:


## 1. Clone the repository:

```bash
git clone https://github.com/K-Honsu/Altschool-second-semester-blog-api-exam.git
cd Altschool-second-semester-blog-api-exam
```

## 2. Install the necessary dependencies:

```bash
npm install

```

## 3. Add your .env file:

```bash
PORT= 8080
MONGOOSE_URL=
JWT_SECRET=
EMAIL_USER=
EMAIL_PASSWORD=
CLOUD_NAME=
API_KEY=
API_SECRET=
CLIENT_ID=
CLIENT_SECRET=
COOKIEKEY=
```

## 4. Start The Server:

```bash
node server.js

To use Nodemon
npm nodemon

# package.json -> script
"dev": "nodemon server.js"

npm run dev
```

## 6. Via Docker 
```bash
coming soon
```

## 5. Test On Postman:

```bash
https://documenter.getpostman.com/view/25856069/2s9YRGyUus

OR

https://altschool-blog-service.onrender.com/docs
```