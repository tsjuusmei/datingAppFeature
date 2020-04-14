
# Luvely
Luvely is a dating app where users can create an account, filter on gender and sexuality, see who visited and liked you and like users back that have liked you!
![Luvely](https://github.com/tsjuusmei/datingAppFeature/blob/develop/documentatie/images/luvely.png?raw=true)

## Jobstories
_When I'm on a dating app, I want to be able to filter the people who appear in my suggestions, so I can find the one. (Anna)_ 

_When I'm on a dating app, I want to make a profile, so other users know what my interests are. (Inju)_


_When I'm on a dating website, I want to be able to check how many visitors and/or like I've had, so I can know if anyone is interested in me. (Guus)_

## Getting started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Technical requirements
To run this project you'll need [Nodejs](https://nodejs.org/en/download/), [Git](https://git-scm.com/downloads), [Any code editor](https://code.visualstudio.com/download) and [MongoDB](https://www.mongodb.com/cloud/atlas/register)

### Installing
First you'll need to clone the repository. You can choose a destination by running cd and you can clone this repository by running the command clone
```
cd [ENTER YOUR PATH HERE]
git clone https://github.com/tsjuusmei/datingAppFeature.git
```
You'll need to install the modules. You can do this by running the following line
```cmd
npm install
```

### Setting up the database

This is the structure of the MongoDB Atlas database:

```
_id: Object ID("")
firstName: ""
lastName: ""
email: ""
password: ""
age: null
hair: ""
gender: ""
sexuality: ""
image: ""
filter: Object
   gender: ""
   sexuality: ""
likedby: Array
   0: ObjectIdOfUser
   1: ObjectIdOfUser
visitedBy: Array
   0: ObjectIdOfUser
   1: ObjectIdOfUser
   2: ObjectIdOfUser
   3: ObjectIdOfUser
}
```

It should look like this in MongoDB Compass

![Database](https://github.com/tsjuusmei/datingAppFeature/blob/develop/documentatie/images/database.png?raw=true)

The available `filters` for `gender` are `"Men"` and `"Women"`. 

The available `filters` for `sexuality` are `"Gay"`, `"Straight"` and `"Bi-sexual"`

### Test if it works

To test if the application works you can run the following command. If the applicaton works it will say `Example app listening on port3000`
```cmd
npm run dev
```
To test if you've correctly connected to the database you can go to the [register](http://localhost:3000/register) page by typing http://localhost:3000/register in your browser. Once on this page, you can fill in the form and send it. If it shows in the database, you've correctly connected. You can use [Compass](https://www.mongodb.com/download-center/compass) for easy visual acces to your database.

## Packages used
* [Express](https://www.npmjs.com/package/express) - Used to setup the server
* [MongoDB](https://www.npmjs.com/package/mongodb) - Used to setup the database
* [Body-parser](https://www.npmjs.com/package/body-parser) - Used to refer to html elements
* [Express-session](https://www.npmjs.com/package/express-session) - Used to identify the current user
* [Bcrypt](https://www.npmjs.com/package/bcrypt) - Used to hash passwords
* [Multer](https://www.npmjs.com/package/multer) - Used to upload images
* [Dotenv](https://www.npmjs.com/package/dotenv) - Used to protect sensitive information
* [Ejs](https://www.npmjs.com/package/ejs) - Used for templating
* [Nodemon](https://www.npmjs.com/package/nodemon) - Used for auto refreshing the server

## License
This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/tsjuusmei/datingAppFeature/blob/master/LICENSE) file for details

If the server is running go to [localhost:3000](http://localhost:3000/) in your browser.

