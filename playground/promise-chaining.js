//require mongoose to have the connection when this starts
require("../src/db/mongoose");

const User = require("../src/models/user.js");

// User.findByIdAndUpdate("622e4031184e8a1a754fb122", { age: 1 })
//   .then((user) => {
//     //do something
//     console.log(user);
//     return User.countDocuments({ age: 1 });
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((e) => {
//     //do some thing with erorr
//     console.log(e);
//   });

const updateAgeAndCount = async (id, age) => {
  // do soemthing
  // the method will find the id and then update the id
  const user = await User.findByIdAndUpdate(id, { age });
  const count = await User.countDocuments({ age: age });
  return count;
};

updateAgeAndCount("622e259a9adf6ce5aa686b0f", 2)
  .then((resolve) => {
    //do something
    console.log(resolve);
  })
  .catch((e) => {
    console.log(e);
  });
