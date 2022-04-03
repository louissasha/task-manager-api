// CRUD
/**
 * CREATE
 * READ
 * UPDATE
 * DELETE
 */

//require mongodb object
const { ObjectId } = require("mongodb");
const mongodb = require("mongodb");

// create mongo client to create the connection
const MongoClient = mongodb.MongoClient;

// //CREATE NEW OBJECT IDS
// const { onjectID } = mongodb;

// //const id = new ObjectID();

// console.log(id.getTimestamp());
// console.log(id);

//SETUP THE CONNECTION URL
const connectionURL = "mongodb://127.0.0.1:27017";

const databaseName = "task-manager";

// //initialize the connection with mongoClient
MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    //here is the callback function that will be fired when the connection is made
    if (error) {
      //do something
      return console.log("unable to connect to the database");
    } else {
      //do something else
      console.log("Connection successful");

      //create the database by using it in the code
      const db = client.db(databaseName);

      db.collection("users")
        .updateOne(
          {
            _id: ObjectId("622cfbd13732f515229cb740"),
          },
          {
            //update operators
            $set: { name: "Johnny" },
          }
        )
        .then((value) => {
          console.log(value);
        });

      const updateDocument = db
        .collection("users")
        .updateOne(
          { _id: ObjectId("622cfbb56651b4ba9e0cdbb3") },
          { $set: { name: "Sarah" } }
        );

      updateDocument
        .then((result) => {
          //do something with the promise returned argument
          console.log(result);
        })
        .catch((error) => {
          //do something with the error if any
          console.log(error);
        });

      //ObjectId("622cd5c6508e6bec322432f0")
      db.collection("users")
        .updateOne(
          {
            _id: ObjectId("622cd5c6508e6bec322432f0"),
          },
          {
            //update operators
            $inc: { age: 1 },
          }
        )
        .then((value) => {
          console.log(value);
        });

      db.collection("Tasks")
        .updateMany({ completed: false }, { $set: { completed: true } })
        .then((resolve) => {
          //do something with what we get back from the resolved promise
          console.log(resolve);
        })
        .catch((error) => {
          //do something with the error
          console.log(error);
        });

      db.collection("users")
        .deleteMany({ age: 36 })
        .then((result) => {
          //do something with result
          console.log(result);
        })
        .catch((error) => {
          //do something with error
          console.log(error);
        });

      db.collection("Tasks")
        .deleteOne({ description: "go to gym" })
        .then((result) => {
          //do something with the result
          console.log(result);
        })
        .catch((reason) => {
          console.log(reason);
        });

      // // how to find one record
      // db.collection("users").findOne(
      //   { _id: new ObjectID("622ceaf27ef1fb027de9ee71") },
      //   (error, result) => {
      //     //do something with error
      //     if (error) {
      //       return console.log(error);
      //     }

      //     console.log(result);
      //   }
      // );

      // db.collection("users")
      //   .find({ age: { $gt: 7 } })
      //   .toArray((error, result) => {
      //     //do something
      //     console.log(result);
      //   });

      // db.collection("Tasks").findOne(
      //   { _id: new ObjectID("622cee10056469c0c026fcce") },
      //   (error, result) => {
      //     //do something
      //     if (error) {
      //       return console.log(error);
      //     }

      //     console.log(result);
      //   }
      // );

      // db.collection("Tasks")
      //   .find({ completed: false })
      //   .toArray((error, result) => {
      //     //do something
      //     if (error) {
      //       return console.log(error);
      //     } else {
      //       return console.log(result);
      //     }
      //   });

      //   db.collection("users").insertOne(
      //     { name: "Tommy", age: 23, job: "Dealer", _id: id },
      //     (error, result) => {
      //       //do something for error
      //       if (error) {
      //         //log the error
      //         return console.log(error);
      //       }

      //       console.log(result.insertedId);
      //     }
      //   );

      //   db.collection("users").insertOne(
      //     {
      //       name: "Sasha",
      //       age: 37,
      //       job: "developer",
      //     },
      //     (error, result) => {
      //       if (error) {
      //         //callback if there was an error
      //         return console.log(error, "Unable to insert the user");
      //       }
      //       // run this code if things went well
      //       console.log(result.acknowledged); // ops is an array of documents
      //       console.log(result.insertedId); //ops is no longer an property or result

      //       console.log(
      //         db
      //           .collection("users")
      //           .findOne(result.insertedId)
      //           .then((value) => console.log(value))
      //       );
      //     }
      //   );

      //   db.collection("users").insertMany(
      //     [
      //       {
      //         name: "Seb",
      //         age: 28,
      //         job: "tech",
      //       },
      //       {
      //         name: "john",
      //         age: 31,
      //         job: "service",
      //       },
      //     ],
      //     (error, result) => {
      //       //if error log error
      //       if (error) {
      //         return console.log("There was an error", error);
      //       }

      //       console.log(result.insertedIds);
      //     }
      //   );

      //   //insert 3 new tasks
      //   // inside a task collection
      //   // each document need tohave a description string and compelted boolean value
      //   db.collection("Tasks").insertMany(
      //     //inser multiple tasks from an array
      //     [
      //       { catergory: "work", description: "Finish Test", completed: false },
      //       { catergory: "life", description: "go to gym", completed: false },
      //       { catergory: "work", description: "get new job", completed: false },
      //     ],
      //     (error, result) => {
      //       //on error do something
      //       if (error) {
      //         return console.log("there was an error ", error);
      //       }

      //       console.log(result.insertedIds);
      //     }
      //   );

      //enter some new stuff
    }
  }
);
