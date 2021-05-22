const mongoose = require('mongoose')


mongoose.connect('mongodb+srv://tanyasamyal:tanya2311@cluster0.dl0px.mongodb.net/users',{
    useNewUrlParser: true, 
    useCreateIndex:true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
mongoose.set("useCreateIndex", true);