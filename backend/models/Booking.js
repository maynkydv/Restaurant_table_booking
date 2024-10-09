module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define(
    'Booking',
    {
      bookingId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      tableNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: 'Table Number must be an integer.',
          },
          max: {
            args: 20,
            msg: 'Table Number must not exceed 20.',
          },
        }
      },
      restaurantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Restaurants',
          key: 'restaurantId',
        },
      },
      restaurantName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'userId',
        },
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      guestCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isAfterToday(value) {
            const today = new Date().toISOString().split('T')[0]; // in YYYY-MM-DD format
            if (value < today) {
              throw new Error('The date must be today or later.');
            }
          },
        }
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
    },
    { timestamps: false },
  );
  return Booking;
};
