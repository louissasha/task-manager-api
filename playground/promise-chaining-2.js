//connect uing require mongoose
require("../src/db/mongoose.js");

//loat in the Task class
const Task = require("../src/models/task.js");

//chaing two promises together
// find and id and update it and then next promise return all id what that same field
// Task.findByIdAndUpdate("622e7234e8a00e7794ff2430", { completed: true })
//   .then((resolve) => {
//     //do something with the resolve
//     console.log(resolve);

//     // add another promise at the end to chain the promises
//     return Task.countDocuments({ completed: true });
//   })
//   .then((resolve) => {
//     //do something with the reslvoed promise
//     console.log(resolve);
//   })
//   .catch((e) => console.log(e));

const deleteTaskAndCount = async (id, query) => {
  //take in id of task to remove
  //use await to delete the task and count up the incomplete tasks
  // return the counf
  //call the functions and then attach the then catch to log the details

  const target = await Task.findByIdAndRemove(id);

  const count = await Task.countDocuments({ completed: query });

  return count;
};

deleteTaskAndCount("622e2a1384c028d0bfa88c5d", false)
  .then((resolve) => {
    //do something
    console.log(resolve);
  })
  .catch((e) => {
    console.log("e", e);
  });
