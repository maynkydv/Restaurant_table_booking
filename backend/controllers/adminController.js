const { User } = require('../models');
const { generateToken } = require('../utils/token');

require('dotenv').config();

// Define user role as admin from customer
// * put  'admin/define' , authenticate 
exports.defineAdmin = async (req, res) => {
  const { userId } = req.user;
  const { ADMIN_KEY } = req.body;
  try {
    if (ADMIN_KEY === process.env.ADMIN_KEY) {
      const user = await User.findByPk(userId);

      if (user) {
        const updatedUser = user;
        updatedUser.role = 'admin';
        user.set(updatedUser);
        await user.save();

        const token = await generateToken({
          userId: user.userId, role: 'admin', email: user.email, name: user.name,
        });
        res.cookie('tokenId', token); // set cookie for authentication

        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } else {
      return res.status(401).json({ message: 'Invalid ADMIN_KEY' });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// get all the users 
// * get   'admin/users'  , authenticate ,  adminAuth
exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.findAll({});

    if (!allUsers) {
      return res.status(400).json({ error: 'No User Found.. ' });
    }
    return res.status(200).json(allUsers);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
