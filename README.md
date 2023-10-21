This Project is a web application made using React.js for the frontend and Node.js for the backend.
The application is a blog management application with which one can Create, Read, Update and Delete blogs.

## Frontend
The Frontend of the application is built using React.js and all the files are in the [/frontend] folder.
The app enables Create, Write, Update and Delete operations to the authorized users.
When authorized, the user can write blogs, update them and delete with one click of the button.
If not authorized, the user can only read the blog content.

## Backend
The Backend of the application is built with Node.js and all the files are in the [/backend] folder.
Create a 'config.json' file and specify "MongoDB_uri" and "PORT" for the backend.
The Backend runs on localhost at port that you specify in config.json.
All the data is managed on the MongoDB database.
The Node.js backend is in connection with MongoDB Atlas to read, write, update and delete data that is handled on the MongoDB database.

## How to run the App
Firstly, setup the backend on localhost. Follow the steps given below.
> Go to the [/backend] folder and run 'npm i' or 'npm install' command to install dependencies.
> Setup PORT and MongoDB URI before running the application.
> Once the dependencies are installed, run the 'node index.js' command in the terminal.
Note: Make sure to have an internet connection so that the backend can connect to MongoDB Atlas.

After the backend is setup, run the frontend. Follow the steps given below.
> Go to the [/frontend] folder and run 'npm i' or 'npm install' command to install dependencies.
> Once the dependencies are installed, run the 'npm start' command in the terminal.
> The Application will run on the default browser once it is executed successfully.