
const express = require('express');
const mon = require('./db/mongoose/mongoose.js');
const mongoose = require('mongoose');
const hbs = require('hbs');
const app = express();


let User = require('./db/models/User.js');

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:false}));

app.get('/index', (req, res)=>{
    res.render('index.hbs');
})

app.get('/view', (req, res)=>{
    
    //what do you need to do to get a handle to the collection of users so you can do a find
    //tried many different ways, just can't figure out the right path
    var db = mongoose;
    
    db.find().toArray(function(err, results){
        console.log(results);
    });
    res.render('view.hbs');
})

app.post('/results',(req,res)=>{

    let user = new User(req.body)
    console.log(user);
    user.save().then(()=>{
        res.render('results.hbs', {
            firstName:req.body.firstName, 
            lastName:req.body.lastName, 
            department:req.body.department, 
            startDate:req.body.startDate, 
            jobTitle:req.body.jobTitle, 
            salary:req.body.salary});
    }).catch(function(e){
        res.status(400).send(e);
    })

})

app.listen(3000, ()=>{
    console.log("Running on Port 3000")
});