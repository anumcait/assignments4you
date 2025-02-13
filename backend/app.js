const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const Razorpay = require('razorpay');


// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: 'rzp_test_KBJq9jgg10W0QL',  // Replace with your Razorpay key_id
    key_secret: 'mO0bYO3p34qHl6IhWTgEE5CV',  // Replace with your Razorpay secret
  });
  
const app = express();

require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log('MongoDB connected');
}).catch(err =>{
    console.log('Error connecting to MongoDB',err);
})

app.use(session({
    secret:'mysecret',
    resave: false,
    saveUninitialized:true,
    
}))




//Middleware
//app.use(express.static('public')); //serve static files like CSS, JS
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json()); //parse JSON data

app.set('view engine', 'ejs');
// app.set('views',)


//Routes
const authRoutes = require('./routes/auth');
app.use('/',authRoutes);
//app.use(upload.any());

app.get('/',(req,res)=>{
    res.status(200);
    res.send("Welcome to Assignments4you")
})



//Start Server
const PORT = process.env.PORT||3800;
app.listen(PORT,() => console.log(`Server running on port ${PORT}`));
