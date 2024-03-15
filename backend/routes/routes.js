const {Router} = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user');
const Booking = require('../models/booking')
const moment = require('moment');
const session = require('express-session');
const router = Router();
require('dotenv').config({ path: './env.env' });

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

 

 
router.post('/register', async (req, res) => {
    let name = req.body.name
    let email = req.body.email
    let password = req.body.password
    let address1 = req.body.address1
    let address2 = req.body.address2
    let county = req.body.county
    let phone = req.body.phone

    const salt  = await bcrypt.genSalt(10)

    const hashedPassword = await bcrypt.hash(password,salt)

    const record = await User.findOne({email:email})

    if (record){
        return res.status(400).send({
            message:"Email is already registered"
        })
    }else{

    const user = new User({
        //role:role,
        name:name,
        email:email,
        password:hashedPassword,
        address1:address1,
        address2:address2,
        county:county,
        phone:phone,

    })

    const result = await user.save()

    //JWT Token

    const {_id} = await result.toJSON()

    const token = jwt.sign({_id:_id}, "secret")

    res.cookie("jwt",token,{
        httpOnly:true,
        maxAge:24*60*60*1000 //1 day
    })
    
    res.send({
        message:"success"
    })
}
})

const verifyToken = (req, res, next) => {

  const token = req.cookies.jwt;
  
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    jwt.verify(token, 'secret', (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
  
      req.user  =  decoded
      next();
    });
  };
  
   
  router.get('/api/secure-route', verifyToken, (req, res) => {
    
    res.json({ message: 'Secure route accessed successfully' });
  });
  


  router.post("/login", async(req,res) => {
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return res.status(404).send({
            message:"User not found"
        });
    }

    if(!(await bcrypt.compare(req.body.password,user.password))){
        return res.status(400).send({
            message:"Password is incorrect"
        });
    }

    const token = jwt.sign({_id:user._id}, "secret", { expiresIn: '1d' }) 
    res.cookie("jwt", token,{
        httpOnly:true,
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        sameSite: 'strict',
        maxAge:24*60*60*1000 // 1 day 
        })

        res.send({
            message:"success"
        })

});


router.get('/user', async (req,res) => {
    try{
        const cookie = req.cookies['jwt']

        const claims = jwt.verify(cookie,"secret")

        if(!claims){
            return res.status(401).send({
                message:"unauthenticated"
            })
        }

        const user = await User.findOne({_id:claims._id})

        const {password,...data} = await user.toJSON()

        res.send(data)
    }catch(err){
        return res.status(401).send({
            message:'unauthenticated'
        })

    }
})

router.post('/logout',(req,res) => {
  res.cookie("jwt", "", {maxAge:0})

  res.send({
      message:"success"
  })
})



router.post('/bookings', verifyToken, async (req, res) => {
  console.log('Bookings endpoint hit');


  const parsedDate = new Date(req.body.date);
    if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
    }

    if (!req.user._id) {
      return res.status(401).send({ message: 'Not authorized' });
     }
    
    // Check if the selected date and time slot are available
    const isDateTimeAvailable = await checkDateTimeAvailability(req.body.date, req.body.time);
  
    if (!isDateTimeAvailable) {
      return res.status(400).json({ error: 'Selected date and time slot are not available.' });
    }
     
    const booking = new Booking({
      ...req.body,
      user: req.user._id
    });
    
    // Continue with saving the booking if the date and time slot are available
    try {
      const savedBooking = await booking.save();

      await User.findByIdAndUpdate(req.user._id, {
          $push: { appointments: savedBooking._id }
      });

       
      const emailDetails = {
        email: req.body.email,
        date: req.body.date,
        time: req.body.time,
        name: req.body.name,
        carMake: req.body.carMake,  
        carModel: req.body.carModel, 
        registeration: req.body.registeration
         
      };
      await sendConfirmationEmail(emailDetails);

      res.status(201).send({ message: 'Booking created and linked to user successfully. Confirmation email sent.' });
    } catch (error) {
      res.status(500).send({ message: 'Error creating booking or sending email', error: error.message });
    }
});

 
//functiion to send a conofrmation email
async function sendConfirmationEmail(booking ) {

  console.log("Booking object:", booking);
  console.log("Email address to send to:", booking.email);
  const msg = {
    to: booking.email ,  
    from: 'sullivanw202@hotmail.com',  
    subject: 'Booking Confirmation',
    text: `Hi ${booking.name}, your booking on ${booking.date} has been confirmed for your ${booking.carMake} ${booking.carModel}.`,
    html: `<strong>Hi ${booking.name},</strong><br>Your booking on ${booking.date} at ${booking.time} for your ${booking.carMake} ${booking.carModel}(${booking.registeration}) has been confirmed.`,
  };
  
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;  
  }
}

 

  
  
  // Helper function to check date and time slot availability
  async function checkDateTimeAvailability(selectedDate, selectedTime) {
    
     
    try {
      
      console.log('Selected date:', selectedDate);
      console.log('Selected time:', selectedTime);

      // Perform a query to check if the selected date and time slot are already booked
      const existingBooking = await Booking.findOne({ date: selectedDate, time: selectedTime });
  
      // If existingBooking is truthy, the date and time slot are not available
      return !existingBooking;
    } catch (error) {
      console.error('Error checking date and time availability:', error);
      return false; 
    }
}
 

  // Endpoint to check availability for a specific date and time
  router.get('/checkAvailability', async (req, res) => {
    const { date } = req.query;
  
    try {
      // Validate if the date is in a valid format
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      // Perform a query to find existing bookings for the given date
      const existingBookings = await Booking.find({ date: parsedDate });
      
      
      const allTimeSlots = ["8:00 AM - 10:00 AM", "10:00 AM - 12:00 PM", "12:00 PM - 2:00 PM", "2:00 PM - 4:00 PM", "4:00 PM - 6:00 PM"];

      // Filter out the booked time slots
      const availableTimeSlots = allTimeSlots.filter(slot => !existingBookings.some(booking => booking.time === slot));

      res.json({ date, availableTimeSlots });
    } catch (error) {
      console.error('Error checking date and time availability:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/user/details', verifyToken, async (req, res) => {
  try {
    
    const user = await User.findById(req.user._id).select('-password');  
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).send({ message: 'Failed to fetch user details' });
  }
});


router.get('/bookings/user', verifyToken, async (req, res) => {
  try {
      const userId = req.user._id; // Assuming verifyToken middleware adds user to req
      const bookings = await Booking.find({ user: userId });
      res.json(bookings);
  } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error fetching user bookings' });
  }
});

router.delete('/bookings/:id', async (req, res) => {
  try {
      const bookingId = req.params.id;
      const booking = await Booking.findByIdAndDelete(bookingId);

      if (!booking) {
          return res.status(404).send({ message: 'Booking not found' });
      }

      res.send({ message: 'Booking deleted successfully' });
  } catch (error) {
      res.status(500).send({ message: 'Error deleting booking', error: error.message });
  }
});

const authenticateUser = (req, res, next) => {
  
  const isAuthenticated = verifyToken(req); 

  if (isAuthenticated) {
   
    next();
  } else {
    // If not authenticated, send an appropriate HTTP response
    res.status(401).json({ message: 'Not authenticated' });
  }
};



router.get('/user-data', authenticateUser, (req, res) => {
 
  if (req.user) {
    // Send back the user data
    res.json({ authenticated: true, role: req.user.role });
  } else {
    // If no user data, respond to indicate the user is not authenticated
    res.status(404).json({ message: 'User data not found' });
  }
});  


router.get('/bookings/all', verifyToken, async (req, res) => {
  

  try {
    const bookings = await Booking.find().sort({ date: 1 }); // Fetch all bookings sorted by date
    res.json(bookings);
  } catch (error) {
    console.error('Failed to fetch bookings', error);
    res.status(500).send({ message: 'Failed to fetch bookings' });
  }
});
   

  
  
 
module.exports = router