const { Restaurant, Restaurant_Owner, User } = require('../models');
const path = require('path');

// to add the restaurant to restaurant table 
// * post 'admin/restaurant'  , authenticate, adminAuth
exports.addRestaurant = async (req, res) => {
  try {
    const { userId ,name , ...restaurantDetails } = req.body;

    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(403).json({ message: `User with userId ${userId} doesn't exist` });
    }
    
    const restaurant = await Restaurant.create({
      name,
      ...restaurantDetails,
    });

    try {
      await Restaurant_Owner.create({
        restaurantId: restaurant.restaurantId,
        restaurantName: restaurant.name,
        userId,
        userName: user.name,
      });
    } catch (error) {
      console.error('Error creating Restaurant_Owner:', error);
      return res.status(400).json({ error: 'Failed to create restaurant owner relationship.' });
    }

    res.status(201).json({ success: true, restaurant });
  } catch (error) {
    if (error.name === `SequelizeValidationError` || error.name=== `SequelizeUniqueConstraintError` ) {
      return res.status(400).json({ errors: error.errors.map(err => err.message) });
    }
    return res.status(500).json({ error: 'An error occurred while creating the booking.' });
  }
};

// To update the restaurant details
// * put 'admin/restaurant'  , authenticate, adminAuth
exports.updateRestaurant = async (req, res) => {
  const { restaurantId } = req.body;
  try {
    const restaurant = await Restaurant.findByPk(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: `Unable to Find Restaurant with restaurantId ${restaurantId}` });
    }

    const updatedDetails = req.body;
    restaurant.set(updatedDetails);
    await restaurant.save();
    res.status(200).json(restaurant);
  } catch (error) {
    if (error.name === `SequelizeValidationError` || error.name=== `SequelizeUniqueConstraintError` ) {
      return res.status(400).json({ errors: error.errors.map(err => err.message) });
    }
    return res.status(500).json({ error: 'An error occurred while creating the booking.' });
  }
};

// To add the restaurant owner
// * post  'admin/restaurant/addowner'   authenticate, adminAuth,
exports.addOwnerToRestaurant = async (req, res) => {
  try {
    const { restaurantId, newOwnerId } = req.body;

    const restaurant = await Restaurant.findOne({
      where: {
        restaurantId,
      },
    });

    if (!restaurant) {
      return res.status(404).json({ message: `Unable to Find Restaurant with restaurantId ${restaurantId}` });
    }

    const newOwner = await User.findByPk(newOwnerId);
    if (!newOwner) {
      return res.status(404).json({ message: 'New owner not found' });
    }

    const existingOwnership = await Restaurant_Owner.findOne({
      where: {
        restaurantId: restaurant.restaurantId,
        userId: newOwner.userId,
      },
    });
    if (existingOwnership) { // ensure that no multiple entry of restaurant with same owner userId
      return res.status(400).json({ message: 'This owner is already associated with the restaurant' });
    }
    await Restaurant_Owner.create({
      restaurantId: restaurant.restaurantId,
      restaurantName: restaurant.name,
      userId: newOwner.userId,
      userName: newOwner.name,
    });
    res.status(201).json({
      success: true,
      message: `Owner with ID ${newOwnerId} has been added to the Owner list of restaurant with restaurantId ${restaurantId}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// to remove the owner of the restaurant
// * delete  'admin/restaurant/remove'  ,authenticate, adminAuth
exports.removeRestaurant = async (req, res) => {
  try {
    const { restaurantId, ownerId } = req.body;

    const deleted = await Restaurant_Owner.destroy({
      where: {
        restaurantId,
        userId: ownerId,
      },
    });

    if (deleted) {
      res.status(200).json({ message: 'Ownership removed successfully' });
    } else {
      res.status(404).json({ message: 'Ownership not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// to remove the restaurant 
// * delete 'user/restaurant/delete'  , authenticate, adminAuth
exports.deleteRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.body;

    const deleted = await Restaurant.destroy({
      where: {
        restaurantId,
      },
    });
    if (!deleted) {
      res.status(404).json({ message: 'Restaurant Deletion Unsuccessful' });
    } else {
      res.status(200).json({ message: 'Restaurant deleted successfully' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get all the restaurant from restaurant table
// * get 'user/restaurant'
exports.getAllRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findAll({});
    if (!restaurant) {
      return res.status(404).json({ message: 'No Restaurants are Found' });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ msg: 'this here', error: error.message });
  }
};
