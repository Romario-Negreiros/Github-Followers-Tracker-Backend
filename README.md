<div align="center">
  <h2>👀 Github Followers Tracker 👀</h2>
  <h3>Backend</h3>
</div>

## Overview

Backend repo for the github-follower-tracker bot, that will keep an eye on
a github user's follow or unfollow activity and, send relatories to this user
if any action regarding to it is taken!

## Table of contents

- [Progress](#progress)
- [Packages](#packages)
- [Contributing](#contributing)
- [Useful links](#useful-links)
- [Author](#author)

## Progress

[(Back to top)](#table-of-contents)

- [x] Connect to mongoDB
- [x] Create usersController
- [x] Add user managing routes
- [x] Create bot
  - [x] Check github profile and get follows and unfollows
  - [x] Create pdf report with the changes
  - [x] Send it to the user's email
- [x] Schedule a interval to run the bot for each user
- [x] Handle errors

## Packages

[(Back to top)](#table-of-contents)

- [Express](https://expressjs.com)
- [Mongoose](https://mongoosejs.com)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [Toad-scheduler](https://github.com/kibertoad/toad-scheduler)
- [Pdfkit](https://pdfkit.org)

# Useful links

[(Back to top)](#table-of-contents)

- [Event emitter](https://nodejs.org/api/events.html#events)

## Contributing

[(Back to top)](#table-of-contents)

```bash
    >> Fork this repository

    >> Clone the repository to your local system
    git clone https://github.com/Romario-Negreiros/Github-Followers-Tracker-Backend.git

    >> Create a new branch containing your feature
    git checkout -b feature

    >> Commit your changes
    git commit -m "new feature"

    >> Push to your branch
    git push origin feature

    >> Once you push your changes, click the compare && pull request button in your github

    >> Click the create pull request button

    >> After your pull request\'s merge has been done, you can delete your branch
```

## Author

[(Back to top)](#table-of-contents)

- [LinkedIn](https://www.linkedin.com/in/romario-negreiros-8591b6214)
- [Website](https://romario-negreiros.github.io/Romario-frontend/)
- [Frontend Mentor](https://www.frontendmentor.io/profile/Romario-Negreiros)
