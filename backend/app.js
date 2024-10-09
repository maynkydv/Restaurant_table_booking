const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();

// to handle Api calls from frontend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// call on /images/__restaurant_name__ will make img of restaurant available on frontend
app.use('/image' ,express.static('./public/images/restaurant'));

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);


//data base connection
const connectDB = async () => {
  try {
    // await sequelize.sync();
    await sequelize.sync({ alter: true });
    console.log('---- Database Connected ---- ');
  } catch (error) {
    console.log(error);
  }
};

// test api to test server working 
app.get('/', (req, res) => { return res.send('working'); });

const PORT = 5000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server Started on PORT ${PORT} , http://localhost:${PORT}/`);
});
