/**
 * this file will be responsible for hosting the server routes
 */

//call in express
const express = require("express");

//MIDDLEWARE
//require the mongoose file just to make sure the connection is made and not to pass it to an object
// this will fire off the file so just need to make sure there isnt anything that gets created other than the connection
require("./db/mongoose.js");
// add multer for file uploads like images
/**
 * need to configure it to seew what you would like to upload
 */
const multer = require("multer");
const upload = multer({
  //dest: "images",
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

//MODELS
/* here you can add ur models that will be created from mongoose when the server gets the information from the request*/
const User = require("./models/user.js");
const Task = require("./models/task.js");

//ROUTERS
const userRouter = require("./routers/user.js");
const taskRouter = require("./routers/task.js");

// create an app that will initialize the server
const app = express();

const errorMiddleware = (req, res, next) => {
  throw new Error("This is coming from my middleware");
};

app.post(
  "/upload",
  upload.single("upload"), //errorMiddleware
  (req, res) => {
    // upload.single("upload")
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//initialize the port value for dev and production environnment
// value from Heroku = process.env.PORT
const port = process.env.PORT || 3000;

/**
 * setting for express to automatically parse requests that come in JSON
 * format to an object so that we can uuse it
 * */

//add middlewear before other settings, middle wear has access to req and response and next value
// app.use((req, res, next) => {
//   console.log(req.method, req.path);

//   if (req.method === "GET") {
//     //do something
//     res.send("GET requests are disabled");
//   } else {
//     //do something else
//     next();
//   }

//   // //add call to next in order for the application to continue running the process
//   // // the next function does not need an argument
//   // next();
// });
// app.use((req, res, next) => {
//   //block everything
//   if (req.method) {
//     //do something
//     res.status(503).send("Site is down for maintenance");
//   }
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

//ROUTERS

// // create the router
// const router = new express.Router();

// router.get("/test", (req, res) => {
//   //send
//   res.send("This is from the router");
// });

// app.use(router);

// //setup routes

// //get all the users
// app.get("/users", async (req, res) => {
//   //Target
//   const target = req.body.name;

//   //go in database and get the user list
//   try {
//     //try to get the users in the database
//     const userList = await User.find({});

//     res.status(200).send(userList);
//   } catch (e) {
//     //run if error
//     res.status(500).send(e);
//   }

//   //lookup users
//   //   //We use the User object that we brought in and the method find that is attached to that object
//   //   User.find({ name: target })
//   //     .then((result) => {
//   //       // do something with the result
//   //       res.send(result);
//   //     })
//   //     .catch((error) => {
//   //       res.status(500).send("Service not available");
//   //     });
// });

// app.get("/users/:id", async (req, res) => {
//   //Target
//   //const target = req.params
//   const _id = req.params.id;

//   //ASYNC
//   try {
//     const user = await User.findById(_id);

//     if (!user) {
//       return res.status(404).send();
//     }

//     res.status(200).send(user);
//   } catch (e) {
//     console.log(e);
//     res.status(500).send();
//   }

//   //   User.findById(_id)
//   //     .then((result) => {
//   //       //do soemthing
//   //       if (!result) {
//   //         //if there is no result then we dont want to send anything except a 404
//   //         res.status(404).send();
//   //       }

//   //       //if there is a result then we send the result

//   //       res.send(result);
//   //     })
//   //     .then((e) => {
//   //       // send the error
//   //       res.status(500).send(e);
//   //     });
//   //   console.log(req.params);
// });

// // Add new user
// app.post("/users", async (req, res) => {
//   //console.log(req.body);

//   //create the new user based off the information from the req that just came to the server
//   const user = new User(req.body);

//   // ASYNC
//   try {
//     //add try catch block
//     await user.save();

//     res.status(201).send(user);
//   } catch (e) {
//     // do something with the error
//     res.status(400).send(e);
//   }

//   //   user
//   //     .save()
//   //     .then((result) => {
//   //       console.log("success");
//   //       res.status(201).send(result);
//   //     })
//   //     .catch((error) => {
//   //       console.log(error);
//   //       res.status(400).send(error);
//   //     });

//   //res.send("Testing perfect");
// });

// //update a user
// app.patch("/users/:id", async (req, res) => {
//   // validation to see if the request is trying to update something that they are not supposed to.
//   const updates = Object.keys(req.body);

//   const allowedUpdates = ["name", "email", "password", "age"];

//   //test is the below returns false then there is a item in the body that should not belong there making the request invalid
//   const isValidOperation = updates.every((update) =>
//     allowedUpdates.includes(update)
//   );

//   if (!isValidOperation) {
//     //do something if its falst
//     return res.status(404).send("Invalid update parameters");
//   }
//   //This route will be used to update a user

//   try {
//     // try to get the user data from the find functions
//     const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!user) {
//       // do something if no user came back
//       return res.status(404).send();
//     }

//     res.status(200).send(user);
//   } catch (error) {
//     // run this if something goes wrong
//     res.status(400).send(error);
//   }
// });

// //setup end point to get multiple tasks
// app.get("/tasks", async (req, res) => {
//   //ASYNC

//   try {
//     const tasks = await Task.find({});

//     res.status(200).send(tasks);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send(error);
//   }

//   //   //do something
//   //   Task.find({})
//   //     .then((resolve) => {
//   //       //do something with the items that you found.
//   //       //its possible we get nothing back so we have to setup a clause for that
//   //       if (!resolve) {
//   //         res.status(404).send(resolve);
//   //       }
//   //       res.status(200).send(resolve);
//   //     })
//   //     .catch((error) => {
//   //       //do something with the error that you found
//   //       res.status(500).send(error);
//   //     });
// });

// //setup end point to get a task
// app.get("/tasks/:id", async (req, res) => {
//   //do something with tasks to lookup a single task

//   // extract that di
//   const _id = req.params.id;

//   //ASYNC
//   try {
//     const task = await Task.findById(_id);

//     if (!task) {
//       // if there is no task returned then send the error message
//       return res.status(404).send();
//     }

//     res.status(200).send(task);
//   } catch (error) {
//     //log error
//     res.status(400).send(error);
//   }

//   //   //log parameters from the request that were sent in
//   //   console.log(req.params);
//   //   Task.findOne({ _id: _id })
//   //     .then((resolve) => {
//   //       // in case of an error
//   //       if (!resolve) {
//   //         return res.status(404).send();
//   //       }
//   //       //do somethign if you find the id
//   //       res.status(200).send(resolve);
//   //     })
//   //     .catch((error) => {
//   //       //do something with the error that we got back
//   //       res.status(500).send(error);
//   //     });
// });

// // add new task
// app.post("/tasks", async (req, res) => {
//   //create a new task object
//   const newTask = new Task(req.body);

//   //ASYNC
//   try {
//     await newTask.save();
//     res.status(201).send(task);
//   } catch (error) {
//     //if something went wrong we send back the error
//     res.status(400).send(error);
//   }

//   //   // save the task by using that task method inherited from mongoose model object
//   //   newTask
//   //     .save()
//   //     .then((result) => {
//   //       //do
//   //       res.status(201).send(result);
//   //     })
//   //     .catch((error) => {
//   //       res.status(400).send(error);
//   //     });
// });

// app.patch("/tasks/:id", async (req, res) => {
//   // setup validation for update
//   const allowedUpdateParams = ["description", "completed"];

//   const submittedParams = Object.keys(req.body);

//   const valid = submittedParams.every((element) =>
//     allowedUpdateParams.includes(element)
//   );

//   if (!valid) {
//     // if valid is false then stop the operation
//     return res.status(400).send("This is a bad request");
//   }
//   //get task ID
//   const id = req.params.id;
//   // find a task
//   //update a task
//   try {
//     const task = await Task.findByIdAndUpdate(id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!task) {
//       //send empty task out with a message
//       return res.status(400).send("Invalid task");
//     }

//     res.status(200).send(task);
//   } catch (error) {
//     //do something with error
//     res.status(500).send(error);
//   }
// });

// app.delete("/tasks/:id", async (req, res) => {
//   //delete the task

//   const id = req.params.id;

//   //try and delete the task by id
//   try {
//     // try finding the task
//     const task = await Task.findByIdAndDelete(id);

//     if (!task) {
//       //if task is undefined we send back an error
//       return res.status(400).send("the user was not found");
//     }

//     //code when we do find th user
//     res.status(201).send(task);
//   } catch (error) {
//     //if error we send back error
//     res.status(500).send(error);
//   }
// });

// //delete operations
// app.delete("/users/:id", async (req, res) => {
//   //id
//   const id = req.params.id;
//   //do something
//   try {
//     //attempting to delete the user
//     const user = await User.findByIdAndDelete(id);

//     // if there was a user

//     if (!user) {
//       return res.status(404).send("There was no user found");
//     }

//     res.send(user);
//   } catch (error) {
//     //do something with the error
//     res.status(500).send();
//   }
// });

app.listen(port, () => {
  console.log("Server is listening on port: " + port);
});

//const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const myFunction = async () => {
  // sign method will give you back a token
  const token = jwt.sign({ _id: "abc123" }, "thisismynewcourse", {
    expiresIn: 60,
  });

  console.log(token);

  //verify the token
  const data = jwt.verify(token, "thisismynewcourse");

  console.log(data);

  // // do something
  // const password = "realchocolate!";
  // const hashedPassword = await bcrypt.hash(password, 8);

  // console.log(password);
  // console.log(hashedPassword);

  // const isMatch = await bcrypt.compare("realchocolate!", hashedPassword);
  // console.log(isMatch);
};

myFunction();

//export {myFunction,jwt,taskRouter}
const pet = {
  name: "howy",
};

pet.toJSON = function () {
  console.log(this);
  return {};
};

console.log(JSON.stringify(pet));

//const Task = require("./models/task.js");

// const main = async () => {
//   //do something
//   //find the task by id
//   const task = await Task.findById("623b9cc5265ec962dacd0287");
//   await task.populate("owner");
//   console.log(task.owner);

//   //find a user by their ID
//   const user = await User.findById("623388df6f32f3bc86fd8d06");
//   await user.populate("tasks");
//   console.log(user.tasks);
// };

// main();
