const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Order = require('../models/Orders');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, path.join(__dirname, '..', 'public', 'uploads')); 
    },
    filename: function(req,file,cb){
       // cb(null,file.originalname+Date.now()+path.extname(file.originalname));
       cb(null,file.originalname);
    }
});
const upload = multer({storage: storage}).array('files', 10);



//var upload = multer({dest: 'uploads/'});

//Login Function

exports.login = async(req,res)=>{
    const {email,password} = req.body;

    const existingUser = await User.findOne({email});

    if(existingUser){

        //Compare the entered password with the hashed password in the database
        const isMatch = await bcrypt.compare(password,existingUser.password)
    
        if(isMatch){
           // req.session.user = User;
           req.session.user = {
            _id:existingUser.id,
            username:existingUser.username,
            email:existingUser.email
           }
            console.log(req.session.user);
            //res.render('dashboard',{username:req.session.user.username});
            return res.redirect('/dashboard')
        }
        else{
            //If the password don't match, return an error
            return res.render('login',{message:'Incorrect password'})
        }
        
    }
    else{
       return res.render('login',{message:'login details not found'}) ;
    }
}


//Signup function

exports.signup = async(req,res)=>{
    const { username, mobile, email, password} = req.body;

    try{
        //check if the user already exists
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.render('login',{message:'Email is already registered'})
        }

        //Hash the password before saving to database

        const hashedPassword = await bcrypt.hash(password,10); //10 is the salt rounds 

        //Create a new user
        const newUser = new User({
            username,
            mobile,
            email,
            password: hashedPassword,
            isActive: true, //set isActive to true by default
            lastLogin: new Date()
        });

        //Save the user to the database

        await newUser.save();

        //Redirect to login page or send a success message

        res.redirect('/auth/login');


    } catch(error){
        console.log(error);
        res.render('login',{message:'Something went wrong, please try again later'})
    }

}


//Authenticate User
exports.dashboard= async (req,res)=>{
  
  if(req.session.user){
    try{
        const orders = await Order.find();
        const pendingOrders = await Order.countDocuments({orderStatus:"pending"});
        const ongoingOrders = await Order.countDocuments({orderStatus:"ongoing"});
        const deliverOrders = await Order.countDocuments({orderStatus:"delivered"});
        
    console.log(ongoingOrders);
    res.render('dashboard',{ username:req.session.user.username,orders,pendingOrders,ongoingOrders,deliverOrders});
    }
    catch(error){
        console.log(error);
        res.status(500).send("Error fetching orders");
    }
  }

};

const getNextOrderId = async () => {
    try {
        const orders = await Order.find();
        console.log(orders);

        if (orders.length === 0) { // Check if orders is empty
            return 1001; // If no orders exist, start with orderId 1001
        } else {
            const maxOrderId = await Order.findOne().sort({ orderId: -1 }).limit(1);
            console.log('max number here ' + maxOrderId.orderId);
            return parseInt(maxOrderId.orderId, 10) + 1; // Increment the highest orderId by 1
        }
    } catch (error) {
        console.log('Error getting next orderId', error);
        throw error;
    }
};
// const upload = require('multer')({
//     storage: multer.diskStorage({
//       destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Define where you want to store the uploaded files
//       },
//       filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname); // Generate a unique name for the file
//       }
//     })
//   }); // Define the multer upload instance
exports.ordersubmit = async (req,res)=>{
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).send({ message: 'Error uploading files', error: err });
        }
    const {subject,wordCount,university,deadline,pages,description} =req.body;
    const files = req.files.map(file => file.originalname);
    console.log('rquest here subject', subject);
    if(req.session.user){
        try{
            const orders = await Order.find();
            const nextOrderId = await getNextOrderId();

            // if(orders){

            //     return res.render('dashboard',{message:'order already exist!'})
            // }
            // else{

                const newOrder = new Order({
                    orderId:nextOrderId,
                    subject,
                    university,
                    deadline,
                    wordCount,
                    pages,
                    orderStatus:'pending',
                    description,
                    files:files

                })

                await newOrder.save();
               // res.render('dashboard',{message:"Order created successful",username:req.session.user.username,orders});
               res.redirect('/dashboard');
          //  }
            


        }
        catch(error){
            console.log(error);
        }
    }
});
}

exports.makepayment = async (req, res) => {
    try {
      const orderAmount = req.body.amount * 100;  // Amount in paise (1 INR = 100 paise)
      const orderOptions = {
        amount: orderAmount, // amount in paise
        currency: "INR",
        receipt: `receipt_${new Date().getTime()}`,
        notes: {
          orderId: req.body.orderId // Add order ID or other notes if needed
        },
      };
  
      // Create Razorpay Order
      razorpay.orders.create(orderOptions, (err, order) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        // Send the order details to the client
        res.json(order);
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

