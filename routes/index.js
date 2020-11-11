var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const UserModel = require("../models/User.model");
const SessionModel = require("../models/Session.model");
const SpiralModel = require("../models/Spiral.model");

const { v4: uuidv4 } = require('uuid');

async function requireSession(req, res) {
  if (!req.headers.authorization) {
    console.log('invalid session');
    res.status(403)
    .type('application/json')
    .send(JSON.stringify({"error": "Not logged in"}));
    return;
  }

  let sessionToken = req.headers.authorization.substring(7);

  let sessionData = await SessionModel.findOne({ token: sessionToken });
  if (sessionData === null) {
    console.log('invalid session');
    res.status(403)
    .type('application/json')
    .send(JSON.stringify({"error": "Not logged in"}));
    return;
  }

  let userData = await UserModel.findOne({ _id: sessionData.userId });
  if (userData === null) {
    res.status(403)
    .type('application/json')
    .send(JSON.stringify({"error": "Not logged in"}));
    return null;
  }

  return { sessionData, userData }
}

async function getRecentSpirals(userId) {

  let results = await SpiralModel.find({ userId: userId });

  return results;
}

function sessionToApi(sessionData) {
  console.log(sessionData);

  return {
    "token": sessionData.token
  };
}

function userToApi(userData, ownUser) {
  return {
    "name": userData.name
  };
}

function spiralToApi(spiralData, ownUser) {
  return {
    "id": spiralData._id,
    "startDate": spiralData.startDate,
    "duration": spiralData.duration,
    "goals": spiralData.goals
  };
}
async function createSession(userId) {
  let token = uuidv4();
  
  let sessionData = await SessionModel.create({
    token,
    userId
  });

  return sessionData;
}

async function getCurrentSpiral(userData) {

  let spiralData = await SpiralModel.findOne({ _id: userData.currentSpiralId });

  if (spiralData === null) {
    return null;
  }

  let spiralStartDate = new Date(spiralData.startDate);
  let spiralStartTs = spiralStartDate.getTime();

  if (Date.now() > spiralStartTs + (spiralData.duration * 1000)) {
    return null;
  }

  return spiralData;
}

/* GET information of the currently logged-in user */
router.get('/', function(req, res, next) {
  res.end('Hoi!');
});

/* POST create new session */
router.post('/auth', async function(req, res, next) {
  // Verify input
  // Check if we have a user with the presented email address
  // Check if the password matches
  // Return user information

  const { email, password } = req.body;

  let userData = await UserModel.findOne({ email: email });
  if (userData === null) {
    console.log('invalid email');
    return;
  }

  let passwordResult = await bcrypt.compare(password, userData.password);
  if (passwordResult !== true) {
    console.log('invalid password');
    return;
  }

  let sessionData = await createSession(userData.id);

  let responseData = {
    "user": userToApi(userData),
    "session": sessionToApi(sessionData)
  };

  res.status(200)
    .type('application/json')
    .send(responseData);

});

/* GET information of the currently logged-in user */
router.post('/users', function(req, res, next) {
  // Verify input
  // Check if we have a user with the presented email address
  // Check if the password matches
  // Return user information


  //let name = "Bram Pelgrom";
  //let email = "bram@mobypicture.com";
  //let password = "Password";

  const { name, email, password } = req.body;

  bcrypt
    .genSalt(10)
    .then((salt) => {
      bcrypt
        .hash(password, salt)
        .then((hashedPassword) => {
          UserModel.create({
            name,
            email,
            password: hashedPassword,
          })
            .then(() => {
              console.log('redirect');

              let userData = {
                name,
                email
              }
            
              res.status(200)
                .type('application/json')
                .send(userData);
            })
            .catch((e) => {
              console.log("Failled to create user in DB");
              console.log(e);
            });
        })
        .catch((e) => {
          console.log("Failled to hash PW");
          console.log(e);
        });
    })
    .catch(() => {
      console.log("Failled to generate salt");
    });
});

/* GET information of the currently logged-in user */
router.get('/me/spiral', async function(req, res, next) {
  let { sessionData, userData } = await requireSession(req, res);

  console.log(userData);

  let currentSpiral = await getCurrentSpiral(userData);
  if (currentSpiral === null) {
    res.status(404).send();
    return;
  }

  console.log('OH YEAHH LLo');

  console.log(currentSpiral)

  let responseData = spiralToApi(currentSpiral);
            
  res.status(200)
  .type('application/json')
  .send(responseData);
});


router.post('/me/spiral/cancel', async function(req, res, next) {
  let { sessionData, userData } = await requireSession(req, res);

  let currentSpiral = await getCurrentSpiral(userData);
  if (currentSpiral === null) {
    res.status(404).send();
    return;
  }

  await SpiralModel.deleteOne({_id: currentSpiral._id});

  res.status(204).send();

});

/* POST create new session */
router.post('/me/spiral', async function(req, res, next) {
  let { sessionData, userData } = await requireSession(req, res);

  const { time, goals } = req.body;


  let spiralGoals = goals;

  let timeParts = time.split(':');
  let timeMinutes = parseInt(timeParts[0]);
  let timeSeconds = parseInt(timeParts[1]);

  const totalTimeSeconds = (timeMinutes * 60) + timeSeconds;

  // Check if we don't have an active spiral already
  
  let spiralData = await SpiralModel.create({
    startDate: Date.now(),
    duration: totalTimeSeconds,
    userId: userData._id,
    goals: spiralGoals
  });

  let result = await UserModel.findByIdAndUpdate(userData._id, { $set: {
    currentSpiralId: spiralData._id
    }
  });

  let responseData = spiralToApi(spiralData);
            
  res.status(200)
  .type('application/json')
  .send(responseData);
  
});

/* GET the calendar for the currently logged-in user */
router.get('/me/calendar', function(req, res, next) {
  
});

/* GET the calendar for the currently logged-in user */
router.get('/me/spirals', async function(req, res, next) {

  let { sessionData, userData } = await requireSession(req, res);
  let spirals = await getRecentSpirals(userData._id);

  let responseData = [];

  for (let spiralData of spirals) {
    responseData.push(spiralToApi(spiralData));
  }

  res.status(200)
  .type('application/json')
  .send(responseData);

});

router.get("/me/spiral/:spiralId", async (req, res) => {

  let { sessionData, userData } = await requireSession(req, res);

  let spiralId = req.params.spiralId;
  let spiralData = await SpiralModel.findOne({ _id: spiralId });

  if (spiralData === null || spiralData.userId != userData._id ) {
    res.status(404)
    .type('application/json')
    .send(JSON.stringify({"error": "Not found"}));
    return null;
  }

  res.status(200)
  .type('application/json')
  .send(spiralToApi(spiralData));

});

router.delete("/me/spiral/:spiralId", async (req, res) => {

  let { sessionData, userData } = await requireSession(req, res);

  let spiralId = req.params.spiralId;

  
  
  let spiralData = await SpiralModel.findOne({ _id: spiralId });
  if (spiralData === null || spiralData.userId != userData._id ) {
    res.status(404)
    .type('application/json')
    .send(JSON.stringify({"error": "Not found"}));
    return null;
  }

  await SpiralModel.deleteOne({_id: spiralId});

  res.status(204).send();
});

router.get("/me/spirals/calendar/:startDate/:endDate", (req, res) => {

  let startDate = new Date(req.params.startDate);
  let endDate = new Date(req.params.endDate);

  SpiralModel.find({ startDate: { $gte: startDate, $lt: endDate }  }, null, { sort: { 'date': 'asc' } })
    .then((results) => {
      let responseData = [];
      for (let spiralData of results) {
        responseData.push(spiralToApi(spiralData));
      }

      res.status(200)
        .type('application/json')
        .send(responseData);

    })
    .catch((e) => {
      console.log(e);
      res
        .status(500)
        .send(JSON.stringify({
          message: "Fail to fetch user information",
        }));
    });

});



module.exports = router;