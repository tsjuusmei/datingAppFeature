# DatingAppFeature
In this repository you will find the whole progress in making a feature for a datingapp. In the beginning we were ask to make jobstories and choose one to make in to a feature. This feature makes it so the user can apply filters on the people they want to come across in the dating app. Later in this project we are going to collaborate to add other functions and make a complete functioning dating app. You can find my progress in my [wiki](https://github.com/annaboomsma/datingAppFeature/wiki)

## Jobstories
_When I'm on a dating app, I want to be able to filter the people who appear in my suggestions, so I can find the one._

## Luvely
Luvely is a dating app where you can filter on gender and sexuality, see who visited and liked you and like users back that have liked you!

![Luvely](https://github.com/tsjuusmei/datingAppFeature/blob/master/documentatie/images/luvely.jpg)


## Getting started
Make a new folder in wich you want to place this repository. (You should always pick a place apart from your own projects to prevent problems).

### Clone this repository 
To clone this repository add this in your terminal:

`git clone https://github.com/tsjuusmei/datingAppFeature.git`

Your computer will now clone this repository. To make sure you're in the right folder add this to your terminal:

`cd datingAppFeature`

### Install packages 
To make sure the application will function completely you have to install all packages so add this to your terminal:

`npm install`

Now your computer will have installed all packages needed for this application. 

### Test if it works
To test if the application works add this to your terminal:

`npm run nodemon`

If the server is running go to [localhost:3000](http://localhost:3000/) in your browser.

## Database 
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

![Database](https://github.com/tsjuusmei/datingAppFeature/blob/master/documentatie/images/database.png)

The available `filters` for `gender` are `"Men"` and `"Women"`. 

The available `filters` for `sexuality` are `"Gay"`, `"Straight"` and `"Bi-sexual"`
