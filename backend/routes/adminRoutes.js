const express = require('express');
const multer = require('multer');
const path = require('path');

// file upload middleware 
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname ,'../public/images/restaurant'));  
  },
  filename: function(req, file, cb) {
    const restaurantName = req.body.name ;
    const sanitizedRestaurantName = restaurantName.replace(/\s+/g, '_').toLowerCase();
    cb(null, `${sanitizedRestaurantName}.png`); // rename the file on restaurant name
  }
});

const upload = multer({
  storage: storage,
});


const router = express.Router();
// midlleware for token verification
const authenticate = require('../middlewares/authenticate');
// after token verification, check role for admin authorisation
const adminAuth = require('../middlewares/adminAuth');
const bookingController = require('../controllers/bookingController');
const restaurantController = require('../controllers/restaurantController');
const adminController = require('../controllers/adminController');

// Become Admin
router.put('/define', authenticate, adminController.defineAdmin);

// fetch all User
router.get('/users', authenticate, adminAuth, adminController.getAllUsers);

// Restaurant Related
router.post('/restaurant', authenticate, adminAuth, upload.single('myImage'), restaurantController.addRestaurant);
router.put('/restaurant', authenticate, adminAuth, restaurantController.updateRestaurant);

// Restaurant Updation of owner, deletion of restaurant
router.post('/restaurant/addowner', authenticate, adminAuth,  restaurantController.addOwnerToRestaurant);
// router.delete('/restaurant/remove',authenticate,adminAuth,restaurantController.removeRestaurant);
// remove ownership of user form this restaurant
router.delete('/restaurant/delete', authenticate, adminAuth, restaurantController.deleteRestaurant);

// Booking Related
router.get('/restaurant/:id/bookings', authenticate, adminAuth, bookingController.getBookingOfRestaurant);

// router.get('/restaurant/:id',authenticate, adminAuth,restaurantController.getRestaurantDetails);

module.exports = router;
