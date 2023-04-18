const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const https = require('https');
const path = require('path')
const { response, json } = require("express");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname , 'public')))
app.listen(port, () => {
  console.log("server up and running");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
  console.log("hello");
});

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data)
  const url = 'https://us21.api.mailchimp.com/3.0/lists/7ace8f4a87'
  const options = {
    method:"POST",
    auth:"tulsi1:c17506d32db2583031863313db127908-us21"
  }
  const request = https.request(url,options,(response)=>{
    if(response.statusCode===200){
      res.sendFile(__dirname + "/success.html")
    } else {
      res.sendFile(__dirname + "/failure.html")
    }
    response.on('data',(data)=>{
    console.log(JSON.parse(data))
    })
  })
  request.write(jsonData)
  request.end()

});



app.post('/failure',(req,res)=>{
  res.redirect('/')
})

// audience id = 7ace8f4a87
// api key c17506d32db2583031863313db127908-us21
