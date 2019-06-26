const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

//create the web app
const app = express();

//enable readying form data
app.use(bodyParser.urlencoded({extended:true}));

//use static files
app.use(express.static('public'));

//root route to render the signup form
app.get('/',(req,res)=>{
    res.sendFile(`${__dirname}/signup.html`)
})

//post route to handle the form data
app.post('/signup',(req,res)=>{
    let firstName = req.body.inputFirstName;
    let lastName = req.body.inputLastName;
    let email = req.body.inputEmail;

    //this is a JS object, needs to be converted to a json object in the body.
    let formData = {
        members: [
            {
                email_address:email,
                status:'subscribed',
                //merge field is An individual merge var and value for a member.
                merge_fields : {
                    FNAME : firstName,
                    LNAME : lastName
                }
            }
        ]
    }
    // The url is the only required option, you can also specify the method and ‘qs’ which is an object containing querystring values (key value pairs) tobe appended to the url. This means the qs object is an object inside of our options object.
    let options = {
        //usX = the data server, based on the api key (last 3 chars).
        url : 'https://<usX>.api.mailchimp.com/3.0/lists/<list_id>',
        method : 'POST',
        headers : {
            'Authorization':'user <apiKey here>'
        },
        body : JSON.stringify(formData)
    };

    // now we start the request to api.
    // remember this takes 2 params (the url or options object, along with the callback that takes a error, response and body.)
    request(options,(error, response, body)=>{
        //look for errors
        if(error){
            res.sendFile(__dirname+'/failure.html'); 
        }else{
            if(response.statusCode === 200){
                res.sendFile(__dirname+'/success.html');
            }else{
                res.sendFile(__dirname+'/failure.html'); 
            }
            
        }

        //or we can use
        // if (!error && response.statusCode == 200) {
        //     res.send('Successfully subscribed');
        //   }
    })
})

app.get('/failure',(req,res)=>{
    res.redirect('/');
})

var port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port,()=>{
    console.log(`listening on port ${port}`);
});