const mongoose = require('mongoose')


mongoose.connect('mongodb://localhost:27017/users',{
    useNewUrlParser: true, 
    useCreateIndex:true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
mongoose.set("useCreateIndex", true);