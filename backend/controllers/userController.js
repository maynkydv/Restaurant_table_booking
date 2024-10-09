const { User, Booking } = require('../models');
const { generateToken } = require('../utils/token');

// used to create a user entry in User table also send token 
// * post 'user/register'
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    user.role = 'customer';

    const token = await generateToken({
      userId: user.userId, role: user.role, email: user.email, name: user.name,
    });

    res.cookie('tokenId', token);
    res.status(201).json({ success: true, user: user, jwtToken: token });
  } catch (error) {
    if (error.name === `SequelizeValidationError` || error.name === `SequelizeUniqueConstraintError`) {
      return res.status(400).json({ errors: error.errors.map(err => err.message) });
    }
    return res.status(500).json({ error: 'An error occurred while creating the User.' });
  }
};

//validate the credentials and send the token for authentication
// * post  'user/login'
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'invalid email' });
    }

    const isMatch = await user.validPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = await generateToken({
      userId: user.userId, role: user.role, email: user.email, name: user.name,
    });

    res.cookie('tokenId', token);
    res.status(200).json({ success: true, message: 'Successfully logged in', jwtToken: token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get User details with its booking details 
// * get  'user/', authenticate
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      include: [
        {
          model: Booking,
          as: "Bookings",
        },
      ],
    });


    if (user) {
      user.password = "****"; // to ensure the even the password hash is not sent to client
      res.status(200).json(user);
    } else {
      res.status(401).json({ message: "Please Login First" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update User details 
// * put  'user/' , authenticate
exports.updateUser = async (req, res) => {
  const { userId } = req.user;
  try {
    const user = await User.findByPk(userId);
    const updatedUser = req.body;
    updatedUser.role = user.role; // ensure that role doesnot got changed
    if (user) {
      user.set(updatedUser);
      await user.save();
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    if (error.name === `SequelizeValidationError` || error.name === `SequelizeUniqueConstraintError`) {
      return res.status(400).json({ errors: error.errors.map(err => err.message) });
    }
    return res.status(500).json({ error: 'An error occurred while creating the booking.' });
  }
};

// Delete the user Profile i.e. user details 
// * delete 'user/'  , authenticate
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { userId: req.user.userId },
    });
    if (deleted) {
      res.clearCookie('tokenId').status(200).json({ message: 'user deleted successfully' });
    } else {
      res.status(401).json({ message: 'Please Login First' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
