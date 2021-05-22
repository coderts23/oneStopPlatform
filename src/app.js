const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const path =require('path')
const ejs = require('ejs')
require('./db/mongoose')
const inputs=require('./models/user')
const session = require('express-session')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')
const LocalStrategy = require('passport-local').Strategy


const User=inputs.User
const Item=inputs.Item
const defaultItems=inputs.defaultItems
const app = express()
const port =process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(express.static(publicDirectoryPath))
app.set('view engine', 'ejs')
app.set('views', viewsPath)

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id)
})

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
    done(err, user)
    })
})

//GET ROUTES
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/login', (req, res) => {
    res.render('index')
})

app.get('/signup', (req, res) =>{
    res.render('signup')
})

app.get("/notes", function(req, res) {
    const userID = req.user.username
    User.findOne({username: userID}, function(err, foundUser){
        console.log(foundUser)
        if(!err){
            if(foundUser.items.length===0){
                foundUser.items=defaultItems
            }
            foundUser.save()
            res.render("notes", {userTitle: foundUser.username, newUserItems: foundUser.items})
        }  
    })
})


app.get('/mainpage', function(req, res) {
    res.render('mainpage')
})

app.get("/logout", function(req, res){
    req.logout()
    res.redirect("/")
})

//POST ROUTES
app.post("/signup", function(req, res) {

    User.register({username: req.body.username}, req.body.password, function(err, user){
        if(err){
            console.log(err)
            res.redirect("signup")
        } else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/mainpage")
            })
        }
    })
})

app.post("/login", function(req, res) {
    
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })

    req.login(user, function(err) {
        if(err) {
            console.log(err)
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/mainpage")
            })
        }
    })
})

app.post("/delete", function(req, res){
    const userID=req.user.username
    const checkedItemId = req.body.checkbox;
    console.log(checkedItemId)
    User.findOneAndUpdate({username: userID},{$pull: {items: {_id: checkedItemId}}},function(err, foundUser){
        if(!err){
            res.redirect("/notes")
        }
    })
})

app.post("/notes", function(req, res){
    const userID = req.user.username
    const itemName = req.body.newItem
    const item = new Item({
    name: itemName
    })
    User.findOne({username: userID}, function(err, foundUser){
        foundUser.items.push(item);
        foundUser.save()
        res.redirect("/notes")
    })
  })


app.listen(port, () => {
    console.log('Server is up on port 3000.')
})
