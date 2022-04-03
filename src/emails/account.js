//send test email

//import sendgrid

const sgMail = require("@sendgrid/mail");

//se tthe api key

//const sendgridAPIKey = process.env.SENDGRID_API_KEY;
//set the api key to the sgMail object
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//setup function to send the email that we will be exporting
const sendWelcomeEmail = (email, name) => {
  //use the send mail function from the sgMail object
  sgMail.send({
    to: email,
    from: "louissasha@gmail.com",
    subject: "Welcome email",
    text: `Welcome to the app, ${name}.  Let me know how you like the app`,
  });
};

//cancellelation email
const sendFeedbackEmail = (email, name) => {
  //use the send mail function from the sgMail object
  sgMail.send({
    to: email,
    from: "louissasha@gmail.com",
    subject: "Feedback email",
    text: `Sorry for losing you ${name}, please let us know what we can do better with some feedback :)`,
  });
};

//SEND EMAIL
// sgMail.send({
//   to: "louissasha@gmail.com",
//   from: "louissasha@gmail.com",
//   subject: "This is my first automated email.",
//   text: "This is a confirmation that this email was sent to you.",
// });

module.exports = { sendWelcomeEmail, sendFeedbackEmail };

// const testFunction = ({ number1, number2 }) => {
//   //this is  test function
//   console.log(number1, number2);
// };

// testFunction({ number1: 1, number2: 2 });
