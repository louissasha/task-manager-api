//call in the mongood rep

const mongoose = require("mongoose");

const validator = require("validator");

/**
 * create the connection string for mongoose to connect the database
 * at the end of the mondoDB connection string we add the database name right in there right away
 *
 */
const connectionURL = process.env.MONGODB_URL;

console.log(connectionURL); //"mongodb://127.0.0.1:27017/task-manager-api";

//connect to the database
mongoose.connect(connectionURL, {
  useNewUrlParser: true,
  //useCreateIndex: true,
});

// const Tasks = mongoose.model("Tasks", {
//   //fields to include inside the model
//   description: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   completed: {
//     type: Boolean,
//     required: false,
//     default: false,
//   },
// });

// const task = new Tasks({
//   description: "Clean the kitchen",
//   //completed: true,
// });

// task
//   .save()
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {
//     //log the error
//     console.log(error);
//   });
