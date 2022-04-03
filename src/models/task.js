//require mongoose
const mongoose = require("mongoose");

// TEMPLATE FOR THE SCHEMA put it inside of a object
const userSchema = new mongoose.Schema(
  {
    //fields to include inside the model
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      required: false,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      //add link to the the task objects
      ref: "User",
      //default: false,
    },
  },
  {
    timestamps: true,
  }
);

//create the task model with the name of the schema and the template for the schema
const Task = mongoose.model("Tasks", userSchema);

// const Task = mongoose.model("Tasks", {
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
//   owner: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     //add link to the the task objects
//     ref: "User",
//     //default: false,
//   },
// });

// const task1 = new Task({
//   description: "Clean the kitchen",
//   //completed: true,
// });

// task1
//   .save()
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {
//     //log the error
//     console.log(error);
//   });

module.exports = Task;
