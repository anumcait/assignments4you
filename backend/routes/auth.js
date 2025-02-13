const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/',(req,res)=>res.render('index', { message: req.session.message }));

router.get('/auth/login',(req,res)=>res.render('login',{message:''}));

router.get('/dashboard/orderassignment',(req,res)=>res.render('orderassignment',{message:''}));

router.post('/login',authController.login);
router.post('/signup',authController.signup);
//router.post('/dashboard/orderassignment/submit',authController.ordersubmit);
// The route that handles the form submission (POST request)
router.post('/dashboard/orderassignment/submit', authController.ordersubmit);


// async (req, res) => {
//     // Your code to handle form data
//     console.log(req.body);  // Log the form data to debug
//     res.json({ success: true, message: 'Order submitted successfully!' });
//   });


//router.get('/register',(req,res)=>res.render('register'))

 router.get('/dashboard',authController.dashboard);

 router.post('/create-payment-order', authController.makepayment);

router.get('/auth/logout',(req,res)=>res.render('index'))

module.exports = router;
