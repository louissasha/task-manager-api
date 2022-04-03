//require the express library
const express = require("express");

//create the router
const router = new express.Router();

//load in User profile
const User = require("../models/user.js");

//bring in the auth module
const auth = require("../middleware/auth.js");

//email sending client
//bring in the email client to send emails
const { sendWelcomeEmail, sendFeedbackEmail } = require("../emails/account.js");

// bring in sharp to resize an image
const sharp = require("sharp");

//add multer to enable file uploads
const multer = require("multer");
const upload = multer({
  //dest: "images/avatars", removed the destination so that multer wil pass the item along to the rest of the function call inside my route
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    // the information for the file is under the file object
    // if (!file.originalname.endsWith(".pdf")) {
    //   //do something
    //   console.log(file.originalname);
    //   return cb(new Error("Please upload a PDF"));
    // }

    // // USING REGULAR EXPRESSION
    // if (!file.originalname.match(/\.(doc|docx)$/)) {
    //   console.log(file.originalname);
    //   return cb(new Error("Please upload a word document"));
    // }

    // ADD REGULAR EXPRESSION
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      // do something with the rejection
      return cb(new Error("This is not a valid format"));
    }
    // the callback item will have 2 items
    // cb(new Error("File must be a pdf"));
    // cb(undefined, true);
    // cb(undefined, undefined);
    cb(undefined, true);
  },
});

//TEST MIDDLEWARE
const errorMiddleware = (req, res, next) => {
  throw new error("From my middleware");
};

//ROUTES
//setup routes

//get all the users
// add middleware by addint it before the last callback function
router.get("/users", auth, async (req, res) => {
  //Target
  const target = req.body.name;

  //go in database and get the user list
  try {
    //try to get the users in the database
    const userList = await User.find({});

    res.status(200).send(userList);
  } catch (e) {
    //run if error
    res.status(500).send(e);
  }

  //lookup users
  //   //We use the User object that we brought in and the method find that is attached to that object
  //   User.find({ name: target })
  //     .then((result) => {
  //       // do something with the result
  //       res.send(result);
  //     })
  //     .catch((error) => {
  //       res.status(500).send("Service not available");
  //     });
});

router.get("/users/me", auth, async (req, res) => {
  //the auth middleware is going to parse the user for us and since its going
  // to send back a user to the routepoint we just need to send the users data back to confirm they
  // are logged in
  res.status(200).send(req.user);
  // //Target
  // const target = req.body.name;

  // //go in database and get the user list
  // try {
  //   //try to get the users in the database
  //   const userList = await User.find({});

  //   res.status(200).send(userList);
  // } catch (e) {
  //   //run if error
  //   res.status(500).send(e);
  // }

  // //lookup users
  // //   //We use the User object that we brought in and the method find that is attached to that object
  // //   User.find({ name: target })
  // //     .then((result) => {
  // //       // do something with the result
  // //       res.send(result);
  // //     })
  // //     .catch((error) => {
  // //       res.status(500).send("Service not available");
  // //     });
});

router.get("/users/:id", async (req, res) => {
  //Target
  //const target = req.params
  const _id = req.params.id;

  //ASYNC
  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send();
    }

    res.status(200).send(user);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }

  //   User.findById(_id)
  //     .then((result) => {
  //       //do soemthing
  //       if (!result) {
  //         //if there is no result then we dont want to send anything except a 404
  //         res.status(404).send();
  //       }

  //       //if there is a result then we send the result

  //       res.send(result);
  //     })
  //     .then((e) => {
  //       // send the error
  //       res.status(500).send(e);
  //     });
  //   console.log(req.params);
});

//GET IMAGE FROM THE SERVER
router.get("/users/:id/avatar", async (req, res) => {
  //do something
  /**
   * Get user from user id parameter
   * there is a change we will not get the image if the user is wrong therefore we need to use a try catch block
   */

  const _id = req.params.id;

  try {
    // do somthing
    const user = await User.findById(_id);

    console.log(user);

    if (!user || !user.avatar) {
      //do soemthing if there is no user or if there is no user avatar
      throw new Error(); // throwing a new error will will get caught by the catch block and will move the execution to that point
    }

    //we have to tell the requester what they will be getting back we do this with the set method that will adjust the headers
    res.set("Content-Type", "image/png");

    // once we have set the headers we can then send back our response to the request
    res.send(user.avatar);
  } catch (error) {
    //do something with error
    res.status(404).send({ error: error.message });
  }
});

//SIGN IN
router.post("/users/login", async (req, res) => {
  //do soemthing

  try {
    // call new method
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    console.log("Tried the password");

    //add the logic to the token that will be used for the interaction here
    // we are creating a function that will return a token that will be sent to the user
    const token = await user.generateAuthToken();

    res.status(200).send({ user: user, token });
  } catch (error) {
    //send error
    res.status(400).send("Unable to login");
  }
});

// Add new user
router.post("/users", async (req, res) => {
  //console.log(req.body);

  //create the new user based off the information from the req that just came to the server
  const user = new User(req.body);

  // ASYNC
  try {
    //generate the token here
    const token = await user.generateAuthToken(); //function is asynchronous so we ahve to await it

    //add try catch block
    await user.save();

    //send welcome email to the new member on the website
    sendWelcomeEmail(user.email, user.name);

    console.log("User has been saved");

    res.status(201).send({ user, token }); // send will only send back objects  or strings
  } catch (e) {
    // do something with the error
    res.status(400).send(e);
  }

  //   user
  //     .save()
  //     .then((result) => {
  //       console.log("success");
  //       res.status(201).send(result);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       res.status(400).send(error);
  //     });

  //res.send("Testing perfect");
});

//log out of all the TOKENS
router.post("/users/logoutAll", auth, async (req, res) => {
  //do something
  //find the user and remove all the tokens that are inside the token array
  // save the user
  try {
    // we have access to the user from the middleware
    req.user.tokens = [];

    // save the new user data that has been emptied out
    await req.user.save();

    //send the empty array of tokens
    res.status(200).send(req.user);
  } catch (e) {
    // do something with the error
    res.status(500).send(e);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  //create a route where users can sign out of the application
  // we need to target the specific token they used so we have to go to the auth module and make sure it gets passed on
  try {
    //we have to find the token remove it
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();

    res.status(200).send();
  } catch (e) {
    //do something if there was an error thrown
    res.status(500).send(e);
  }
});

//add pictures
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatars"),
  async (req, res) => {
    // the multer function will attach the file to the req object under the property req.file
    // req.user.avatar = req.file.buffer;

    // USING SHARP TO CONVERT THE IMAGE FIRST BEFORE WE SAVE IT TO THE DATABASE
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    //save the new buffer for the avatar
    req.user.avatar = buffer;
    await req.user.save();
    res.status(200).send("The file was created");
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//update a user
router.patch("/users/me", auth, async (req, res) => {
  // validation to see if the request is trying to update something that they are not supposed to.
  const updates = Object.keys(req.body);

  const allowedUpdates = ["name", "email", "password", "age"];

  //test is the below returns false then there is a item in the body that should not belong there making the request invalid
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    //do something if its falst
    return res.status(404).send("Invalid update parameters");
  }
  //This route will be used to update a user

  try {
    //find the user and return an object with this its values
    //const user = await User.findById(req.user._id);
    const user = req.user;

    //dynamically each field that needs to be updated will update the relevant field inside the use object
    updates.forEach((update) => (user[update] = req.body[update]));

    //await saving the user
    await user.save();

    // try to get the user data from the find functions
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    // if (!user) {
    //   // do something if no user came back
    //   return res.status(404).send();
    // }

    res.status(200).send(user);
  } catch (error) {
    // run this if something goes wrong
    res.status(400).send(error);
  }
});

//update a user
router.patch("/users/:id", async (req, res) => {
  // validation to see if the request is trying to update something that they are not supposed to.
  const updates = Object.keys(req.body);

  const allowedUpdates = ["name", "email", "password", "age"];

  //test is the below returns false then there is a item in the body that should not belong there making the request invalid
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    //do something if its falst
    return res.status(404).send("Invalid update parameters");
  }
  //This route will be used to update a user

  try {
    //find the user and return an object with this its values
    const user = await User.findById(req.params.id);

    //dynamically each field that needs to be updated will update the relevant field inside the use object
    updates.forEach((update) => (user[update] = req.body[update]));

    //await saving the user
    await user.save();

    // try to get the user data from the find functions
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    if (!user) {
      // do something if no user came back
      return res.status(404).send();
    }

    res.status(200).send(user);
  } catch (error) {
    // run this if something goes wrong
    res.status(400).send(error);
  }
});

// router.delete("users/me/avatar", (req, res) => {
//   res.send("this was a test");
// });

router.delete(
  "/users/me/avatar",
  auth,
  // upload.single("avatars"),
  async (req, res) => {
    //do something
    /**
     * Get the user from auth
     * replace the avatar attacted to this user with an anpty field:l undefined
     * save the user
     * return with status code
     */

    // pull the user
    const user = req.user;

    //log user
    console.log(user);

    //remove the avatar that is currently on the user
    user.avatar = undefined;

    // save the user profile
    await user.save();

    //send back a confirmation
    res.status(200).send("the avatar was removed.");
  }
  // (error, req, res, next) => {
  //   //do something if there is and error
  //   res.status(400).send({ error: error.message });
  // }
);

//delete operations
router.delete("/users/me", auth, async (req, res) => {
  //id
  // const id = req.params.id;

  // //need to get the ID from the middleware
  // const id = req.user._id;

  // //do something
  // try {
  //   //attempting to delete the user
  //   const user = await User.findByIdAndDelete(id);

  //   // if there was a user

  //   if (!user) {
  //     return res.status(404).send("There was no user found");
  //   }

  //   res.send(user);
  // } catch (error) {
  //   //do something with the error
  //   res.status(500).send();
  // }
  try {
    // get the user from the middleware and delete him
    await req.user.remove();

    //send feedback email
    sendFeedbackEmail(req.user.email, req.user.name);
    res.status(201).send(req.user);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

//delete operations
router.delete("/users/:id", auth, async (req, res) => {
  //id
  const id = req.params.id;
  //do something
  try {
    //attempting to delete the user
    const user = await User.findByIdAndDelete(id);

    // if there was a user

    if (!user) {
      return res.status(404).send("There was no user found");
    }

    res.send(user);
  } catch (error) {
    //do something with the error
    res.status(500).send();
  }
});

// //setup some endpoints
// router.get("/test", (req, res) => {
//   //send message
//   res.send("From a new file");
// });

module.exports = router;
