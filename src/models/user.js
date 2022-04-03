//require mongoose
const mongoose = require("mongoose");

//insert validator
const validator = require("validator");

//require bcrypt
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

//load in the tasks
const Task = require("./task");

//bring in the email client to send emails
const { sendWelcomeEmail } = require("../emails/account.js");

//create schema for user from mongoose
const userSchema = new mongoose.Schema(
  {
    // configure the type and validation needed for each field
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a positive number");
        }
      },
    },
    email: {
      type: String,
      //unique: true,
      required: true,
      validate(value) {
        //do something to validate the value
        if (!validator.isEmail(value)) {
          //do something if the email is incorrect
          throw new Error("The email is not valid");
        }
      },
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 7,
      trim: true,
      //match: "password",
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          //throw error if the value cins the word password
          throw new Error("The password contains the word password.");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

//ADD VIRTUAL RELATIONSHIP KEYS
userSchema.virtual("tasks", {
  // the ref is to the schema
  ref: "Tasks",
  localField: "_id", // this is the key on this object that we will use for the relationship
  foreignField: "owner", // name on the field on the other object that will create the relationshit
});

//ADD MIDDLEWEAR TO THE SCHEMA

//create a property to add to the user profile. methods for the upper case U user model because we use this class to look for a user in the database
userSchema.statics.findByCredentials = async (email, password) => {
  //first we have to find the user and since the password stored int he databse is hashed then we will have use the email to located the target
  const user = await User.findOne({ email: email });

  //if there is no user we need a condition to stop the function
  if (!user) {
    //need to throw an error and stop execution since there was no user returned
    throw new Error("Unable to login");
  }

  //if we do find the user
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    // what happens when it doesnt work
    throw new Error("Unable to login");
  }

  return user;

  // //do something
  // // find them by the email
  // const user = await User.findOne({ email });

  // if (!user) {
  //   //throw error to stop execution
  //   throw new Error("Unable to find the user ");
  // }

  // //check to see if hash password is a match
  // const isMatch = await bcrypt.compare(password, user.password);

  // if (!isMatch) {
  //   throw new Error("Unable to login");
  // }

  // return user;
};

//Add new function to the user schema so that we can get access to the method on the userSchema (userSchedma.methods for methods on the unndividual user and instance )

userSchema.methods.toJSON = function () {
  //since we are adding this method to the individual instance we get access to "this" object which is the object itself but we have to use a function calls
  //this cannot be accessed with an arrow function
  const user = this;

  // we pass the user into a new object so that we can manipulate it without making any changes to the actual object
  const userObject = user.toObject();

  //use the delete operator to delete the property from the object
  delete userObject.password;
  delete userObject.tokens;

  // in order to speed up the process of serving users back from a fetch we are going to remove the avatar data from being returned when we lookup a user
  delete userObject.avatar;

  return userObject;
};

//we add the method to authenticate on the Schema itself so that when a new object gets created the function will be added to the methods
// for this method we already have the user himself
userSchema.methods.generateAuthToken = async function () {
  // we are not using an arror function because we will need to use the this property
  // the reason we are putting this into user is to make it more readable
  const user = this;

  //create the token
  //payload is what we will use to identify the token so we use the ID from the returned user and convert that to a string
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET); //thisismynewcourse

  //add the token to the list of tokens for that user
  //concat will return a new array therefore we need to save it in as the new array value and not just call the function without saving it to a variable
  user.tokens = user.tokens.concat({ token: token });

  //call the save function so that the changes get saved to the database since its asynchronous we will await it fist
  await user.save();

  //return the token
  return token;
};

//hash the password before saving
userSchema.pre("save", async function (next) {
  //do something
  const user = this;

  console.log(user);

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  //we end the action by running next()
  next();
});

// Delete user tasks when user is removed
userSchema.pre("remove", async function (next) {
  // do something with the middleware

  //accesss the object with the this variable
  const user = this;

  //delete multiple tasks using the owen field
  //user the task.deletemany
  await Task.deleteMany({ owner: user._id });

  next();
});

//create the first model for the collection items
const User = mongoose.model("User", userSchema);

// this is how you create a new User

// const me = new User({
//   name: "         Nanny",
//   age: "21",
//   email: "test@hotmial.IO",
//   password: "wertgwPasword",
// });

// me.save()
//   .then((result) => {
//     //return the resolved promise
//     console.log(result);
//   })
//   .catch((error) => {
//     //catch error
//     console.log(error);
//   });

module.exports = User;
