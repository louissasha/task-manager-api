//define function to authenticate

//load the token library
const jwt = require("jsonwebtoken");

//load in the user model
const User = require("../models/user.js");

const auth = async (req, res, next) => {
  //   //do something
  //   console.log("Auth middleware");

  //   //call next to conftinue flow
  //   next();

  //try catch block to see if we can get the actual user

  try {
    // check that the token we get from the request header that has been passed in can be validated
    // remove the Bearer portion of the string with replace
    var token = req.header("Authorization").replace("Bearer ", "");

    // decode to see if the token is still valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //thisismynewcourse

    //using the _id value from the token we will match it to the _id of the user we are trying to authenticate
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    //if there was no user found throw error
    if (!user) {
      throw new Error();
    }

    //if the user did indeed get authenticated then we add the user as a property on the the request so that when it does get to the route we can use it
    // from there
    req.user = user;
    req.token = token;

    next();

    console.log(token);
  } catch (e) {
    res.status(401).send({ error: "Please Authenticate", e, token: token });
  }
};

module.exports = auth;
