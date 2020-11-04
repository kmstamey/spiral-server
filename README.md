#  Spiral  #

# Description
 Does your mind spiral out of control when you have too much to do? Get rid of those fears with spiral! Spiral is an app that allows you to plan out your days to help you accomplish your goals. By using a calendar to track your to dos and a countdown clock, it makes focusing much easier!

# User Stories

* As a user, I want to be able to access the homepage and be able to sign up or login.
* As a user, I want to see an error page when an error happens.
* As a user, I can create an account and log in
* As a user, By logging in I can see my user profile, which I can edit and delete the account.
* As a user, I can log out, which will also be done when I delete the account
* As a user, I can search for friends to study together
* As a user, I can create events/goals
* As a user, I can edit and delete events I have created
* As a user, Events can be seen by date and type of information
* As a user, I can edit my goals
* As a user, I can delete my goals


# Backlog


# Client - routes
* / = home
* /signup = signup
* /signin = signin
* /profile = my profile
* /friends = my friends
* /profile/:userId = profile of another user
* /start-countdown = start countdown
  
  
 # Pages
*  Home Page (public)
* Sign up Page (public)
* User profile (user only)
* Edit user profile (user only)
* Feed page (user only)
* Event-finder page (user only)
* Event-description page (user only)
* Create-event page (user only)
* 404 Page (public)

# Components
* Search component
* Navbar
* AddForm
* EditForm
* SignIn
* SignUp

# Services
* Auth Service
* auth.login(user)
* auth.signup(user)
* auth.logout()

# Server

# Models

*User Model
* username - String // required
* email - String // required & unique
* password - String // required
* userAvatar - type: String

*Events Model
* createdBy - type: ObjectId // required: true
* textComment - type: String // required: true
* Comments - type: Array of Strings // required: true
* Date - type: Number // required: true
* Topics - type: Array of Strings // required: true
* NumberOfPeople - type: Array of objectIds // required: true

# Backend Routes
* GET /auth

* POST /auth/signup body: username email password

* POST /auth/login body: username password

* POST /auth/logout body: (empty)

* GET /event

* POST /event body:Event , event counter, text comment, time, place, number of people

* GET /event/:id

* DELETE /event/:id

* EDIT /event/:id

* GET /feed

# Links

# Deployment: 

# Github Client https://github.com/kmstamey/spiral-client 

# Github Server https://github.com/kmstamey/spiral-server

# Slides

# trello : https://trello.com/b/MrGw1vIi/spiral-project-3 
