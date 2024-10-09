const { Op } = require('sequelize');
const { Booking, Restaurant } = require('../models');

// get all the bookings of user
// *  get  'user/booking' , authenticate
exports.getBookingOfUser = async (req, res) => {
  try {
    const { userId } = req.user;

    const bookings = await Booking.findAll({
      where: { userId },
      include: [
        {
          model: Restaurant,
          as: 'Restaurant',
          attributes: ['name', 'location'],
        },
      ],
    });

    if (!bookings.length) {
      return res.status(404).json({ message: 'No bookings found for this customer.' });
    }

    return res.status(200).json({ success: true, bookings });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Book a table for user - generate a table number, create entry in booking Table 
// *  post  'user/booking' , authenticate
exports.bookTable = async (req, res) => {
  try {
    const {
      restaurantId, restaurantName, userName, date, startTime, endTime, guestCount,
    } = req.body;
    const { userId } = req.user;

    const availableTable = await checkTableAvailability(restaurantId, date, startTime, endTime);

    if (typeof availableTable === 'string') {
      return res.status(409).json({ message: availableTable }); // No tables available
    }

    const booking = await Booking.create({
      userId,
      userName,
      restaurantId,
      restaurantName,
      tableNumber: availableTable,
      date,
      startTime,
      endTime,
      guestCount,
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    if (error.name === `SequelizeValidationError` || error.name=== `SequelizeUniqueConstraintError` ) {
      return res.status(400).json({ errors: error.errors.map(err => err.message) });
    }
    return res.status(500).json({ error: 'An error occurred while creating the booking.' });
  }
};

// Delete the booking entry from booking table
// *  delete  'user/booking' , authenticate
exports.deleteBooking = async (req, res) => {
  try {
    const { userId } = req.user;
    const { bookingId } = req.body;

    const booking = await Booking.findOne({ where: { bookingId, userId } });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found or doesn't belong to the customer." });
    }

    await Booking.destroy({ where: { bookingId } });

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all the booking of the Restaurant
// * get 'admin/restaurant/:id/bookings',    authenticate
exports.getBookingOfRestaurant = async (req, res) => {
  try {
    const  restaurantId  = req.params.id;

    const bookings = await Booking.findAll({
      where: {
        restaurantId,
      },
    });

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ---------------------------------------*----------------------------

// function to check the Table Availability
// check availability and give the available table number else return a message of unavailbility
async function checkTableAvailability(rest_id, date, requestedStartTime, requestedEndTime) {
  try {
    const restaurant = await Restaurant.findOne({
      where: { restaurantId: rest_id },
      attributes: ['tableCount'],
    });

    if (!restaurant) {
      return ('Restaurant not found');
    }

    const totalTables = restaurant.tableCount;

    // finds all the table of the given restaurant that are already booken for the 
    // selected time frame
    const bookedTables = await Booking.findAll({
      where: {
        restaurantId: rest_id,
        date,
        [Op.or]: [
          {
            startTime: {
              [Op.between]: [requestedStartTime, requestedEndTime],
            },
          },
          {
            endTime: {
              [Op.between]: [requestedStartTime, requestedEndTime],
            },
          },
          {
            [Op.and]: [ //condition if requested Time slot is in between of the booking entry 
              { startTime: { [Op.lt]: requestedEndTime } },
              { endTime: { [Op.gt]: requestedStartTime } },
            ],
          },
        ],
      },
      attributes: ['tableNumber'],
    });

    // store all the table numbers that are booked
    const bookedTableNumbers = bookedTables.map((booking) => { return booking.tableNumber; });

    //find if any table number is not booked in requested time and is under total table of the restaurant
    for (let i = 1; i <= totalTables; i++) {
      if (!bookedTableNumbers.includes(i)) {
        return i;
      }
    }
    return 'No tables available at the specified time.';
  } catch (error) {
    console.log(error);
    return ('Error checking table availability', error);
  }
}
