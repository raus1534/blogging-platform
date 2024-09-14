# Blogging Platform Backend (APIs)

Welcome to the backend folder of our Blogging Platform project. This folder contains all the necessary components and configurations for the server-side implementation of our application.

## Installation

To get started with the backend development environment, follow these steps:

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

#### Mongo DB URL

`MONGO_URI`

#### [JWT](https://jwt.io/) Secret Key:

`JWT_SECRET`

#### [Mailtrap](https://mailtrap.io/) For Email-Notification

`MAILTRAP_USER`
`MAILTRAP_PASS`

#### [Cloudinary](https://cloudinary.com/) For File Storage

`CLOUD_NAME`
`CLOUD_KEY`  
`CLOUD_SECRET`

#### Extra

`VERIFICATION_EMAIL`
`SIGN_IN_URL`
`PASSWORD_RESET_LINK:https://localhost:3000/api/reset-password`

## Run Locally

Install dependencies

```bash
  npm i
```

Start the server

```bash
  npm run server
```
