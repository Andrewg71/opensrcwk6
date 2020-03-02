
const express = require('express');
require('./db/mongoose/mongoose.js');
const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
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
    //console.log( mongoose.connection.collection('users').find() ); 
    //what do you need to do to get a handle to the collection of users so you can do a find
    //tried many different ways, just can't figure out the right path
    var db = mongoose.connection.collection('users');
    
    db.find().toArray(function(err, results){
        res.render('view.hbs', {results: results});
    });
})

app.get('/delete/:id', (req, res)=>{
    console.log(req.params.id);
    // mongo db code to remove person with id req.params.id
    var db = mongoose.connection.collection('users');

    db.deleteOne( {"_id": ObjectId(req.params.id)} );
    res.redirect('/view');
})

// add update route that takes in an ID, but does not redirect, and renders an update page
// update page should start as a clone of index (with input boxes)
//  /update/:id
// render update.hbs
// 
app.get('/update/:id', (req, res)=>{
    var db = mongoose.connection.collection('users');
    db.findOne({"_id": ObjectId(req.params.id)}, function(err, found){
        console.log(found);
        res.render('update.hbs', {found: found});
    });
})

app.post('/update_now',(req,res)=>{
    var db = mongoose.connection.collection('users');
    console.log(req.body.id);
    db.findOneAndUpdate(
        {"_id": ObjectId(req.body.id)}, 
        {$set: {
            firstName:req.body.firstName, 
            lastName:req.body.lastName, 
            department:req.body.department, 
            startDate:req.body.startDate, 
            jobTitle:req.body.jobTitle, 
            salary:req.body.salary
        }},
        {},
        function(err, found){
            console.log(found);
            res.redirect('/view');
        }
    );

    /*
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
    */


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





