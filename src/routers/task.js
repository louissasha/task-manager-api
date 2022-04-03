//require express

const express = require("express");

//create a new router
const router = new express.Router();

//load in the task model
const Task = require("../models/task.js");

//load in the auth middleware
const auth = require("../middleware/auth.js");

//Routes
//setup end point to get multiple tasks
// GET /tasks?completed=true&limit=10&skip=20
// add limit return x number
// add skip skip the first X number of results
// add sort by as a query string parameter sortBy=createdAt_asc or sortBy=createdAt_desc
router.get("/tasks", auth, async (req, res) => {
  // we can access the parameters of the query straight from the req.query object
  const match = {};
  const sort = {};

  if (req.query.completed) {
    // the query parameter will be a string and not a boolean to what we do is
    // we test the string to be equal to "true" and the result of that will be a boolean
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    //need to split the string for sortby
    const parts = req.query.sortBy.split(":");

    //adding the key value pair to the sort object
    // to be able to use this syntax you have to define it right away
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  console.log(match.completed);
  console.log(sort);
  console.log(sort.createdAt);
  //console.log(sort[createdAt]);
  //ASYNC

  try {
    // // first method to get the tasks when searching for taskes in general
    // const tasks = await Task.find({ owner: req.user._id });

    // second method of getting tasks
    //this can take an object as a parameter to find specific thins
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
        // sort: {
        //   createdAt: 1,
        // },
      },

      // match: {
      //   completed: false,
      // },
    });

    res.status(200).send(req.user.tasks);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }

  //   //do something
  //   Task.find({})
  //     .then((resolve) => {
  //       //do something with the items that you found.
  //       //its possible we get nothing back so we have to setup a clause for that
  //       if (!resolve) {
  //         res.status(404).send(resolve);
  //       }
  //       res.status(200).send(resolve);
  //     })
  //     .catch((error) => {
  //       //do something with the error that you found
  //       res.status(500).send(error);
  //     });
});

//setup end point to get a task
router.get("/tasks/:id", auth, async (req, res) => {
  //do something with tasks to lookup a single task

  // // extract that di
  const _id = req.params.id;

  //ASYNC
  try {
    // const task = await Task.findById(_id);
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      // if there is no task returned then send the error message
      return res.status(404).send();
    }

    res.status(200).send(task);
  } catch (error) {
    //log error
    res.status(400).send(error);
  }

  //   //log parameters from the request that were sent in
  //   console.log(req.params);
  //   Task.findOne({ _id: _id })
  //     .then((resolve) => {
  //       // in case of an error
  //       if (!resolve) {
  //         return res.status(404).send();
  //       }
  //       //do somethign if you find the id
  //       res.status(200).send(resolve);
  //     })
  //     .catch((error) => {
  //       //do something with the error that we got back
  //       res.status(500).send(error);
  //     });
});

// add new task
router.post("/tasks", auth, async (req, res) => {
  //create a new task object
  // const newTask = new Task(req.body);
  console.log("The task path was fired off");

  //create new task that now will include the ID of the user to attach to the task after he is authenticated
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  //ASYNC
  try {
    await task.save();
    res.status(201).send({ task: task, id: req.user._id });
  } catch (error) {
    //if something went wrong we send back the error
    res.status(400).send(error);
  }

  //   // save the task by using that task method inherited from mongoose model object
  //   newTask
  //     .save()
  //     .then((result) => {
  //       //do
  //       res.status(201).send(result);
  //     })
  //     .catch((error) => {
  //       res.status(400).send(error);
  //     });
});

router.patch("/tasks/:id", auth, async (req, res) => {
  // setup validation for update
  const allowedUpdateParams = ["description", "completed"];

  const submittedParams = Object.keys(req.body);

  const valid = submittedParams.every((element) =>
    allowedUpdateParams.includes(element)
  );

  if (!valid) {
    // if valid is false then stop the operation
    return res.status(400).send("This is a bad request");
  }
  //get task ID
  const id = req.params.id;
  // find a task
  //update a task
  try {
    // this way is to find a task using multiple parameters
    const task = await Task.findOne({ _id: id, owner: req.user._id });

    //this way is to find a task by ID only
    // const task = await Task.findById(id);

    // const task = await Task.findByIdAndUpdate(id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    if (!task) {
      //send empty task out with a message
      return res.status(400).send("Invalid task");
    }

    submittedParams.forEach((element) => (task[element] = req.body[element]));

    await task.save();

    res.status(200).send(task);
  } catch (error) {
    //do something with error
    res.status(500).send(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  //delete the task

  const id = req.params.id;

  //try and delete the task by id
  try {
    // try finding the task
    // const task = await Task.findByIdAndDelete(id);

    // need to find the task using multiple parameters
    const task = await Task.findOneAndDelete({ _id: id, owner: req.user._id });

    if (!task) {
      //if task is undefined we send back an error
      return res.status(400).send("the task was not found");
    }

    //code when we do find th user
    res.status(201).send(task);
  } catch (error) {
    //if error we send back error
    res.status(500).send(error);
  }
});

module.exports = router;
