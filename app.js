// jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public")); // for making the use of the 'static' files in our project like some componenets of CSS
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  // console.log(firstName, lastName, email);
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/a0298ccfe0";

  const options = {
    method: "POST",
    auth: "rihan:210512e9e730d4680be39dba95bd0868-us21"
  }
  const request = https.request(url, options, function(response) {

    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }
    else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res){
  res.redirect("/");
});

// this is a dynamic PORT which will be define by Heroku on the go || on local host (port) 3000
app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
});

// API key
// 210512e9e730d4680be39dba95bd0868-us21
// Audience or List id
// a0298ccfe0
