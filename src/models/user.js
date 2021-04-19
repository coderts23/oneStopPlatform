const mongoose = require('mongoose')
const validator = require('validator')
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const findOrCreate = require('mongoose-findorcreate')
const passportLocalMongoose = require('passport-local-mongoose');
const app = express()

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema)

const item1 = new Item({
    name: "Welcome to your todolist!"
})

const item2 = new Item({
    name: "Hit the + button to add a new item."
})

const item3 = new Item({
    name: "<-- Hit this to delete an item."
})

const defaultItems = [item1, item2, item3]

const userSchema = new mongoose.Schema({ 
    username: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
},
    password: {
        type: String,
        trim: true,
        minlength: 6,
        validate(value) {
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannont contain "password"')
            }
        }
    },
    items: [itemsSchema]
})





app.use(express.json())

userSchema.plugin(passportLocalMongoose)
userSchema.plugin(findOrCreate)
const User = mongoose.model('User', userSchema)
module.exports = {
    User,
    Item,
    defaultItems
}