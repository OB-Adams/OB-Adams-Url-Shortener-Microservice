# URL Shortener Microservice

## Overview

This project provides a simple URL shortening service. Users can post a URL to get a shortened version and use it to redirect to the original URL.

## Features

- Shorten URLs: Post a URL to receive a shortened version.
- Redirect Shortened URLs: Access the shortened URL to be redirected to the original URL.
- Default Data: Includes a default entry in the MongoDB database.

## Endpoints

### POST /api/shorturl

- Description: Shortens a URL and returns the shortened version.
- Request Body:
   {
    "url": "https://example.com"
  }
  - Response:
   {
    "original_url": "https://example.com",
    "shorturl": "abc123"
  }
  
### GET /api/shorturl/:shorturl

- Description: Redirects to the original URL based on the shortened URL.
- URL Parameters:
  - shorturl: The shortened URL identifier.
- Response: Redirects to the original URL.

### GET /api/hello

- Description: Simple endpoint to check if the API is running.
- Response:
   {
    "greeting": "hello API"
  }
  
## Installation and Setup

1. Clone the Repository:
```
git clone https://github.com/OB-Adams/Url-Shortener-Microservice.git
cd Url-Shortener-Microservice
```
   
2. Install Dependencies:
```
npm install
```
   
3. Set Up Environment Variables:
   Create a .env file in the root directory and add the following:
```
PORT=3000
MONGO_URL=<your-mongodb-connection-string>
```
   
4. Run the Server:
```
npm start
```
   
## Database

This project uses MongoDB to store URL mappings.

### Default Data

Upon starting the server, a default entry with:
- original_url: "https://www.github.com/OB-AdAMS/"
- shorturl: "1"

will be created if it does not already exist.

## Project Structure

- server.js: Main server file with API endpoints.
- public/: Contains static files, including index.html.

## Dependencies

- express: Web framework for Node.js.
- mongodb: MongoDB Node.js Driver.
- crypto: Module for generating unique short URLs.
- cors: Middleware for enabling Cross-Origin Resource Sharing.
- body-parser: Middleware for parsing request bodies.

## Environment Variables

- PORT: Port number for the server.
- MONGO_URL: Connection string for MongoDB.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Express](https://expressjs.com/)