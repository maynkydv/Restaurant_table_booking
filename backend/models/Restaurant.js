module.exports = (sequelize, DataTypes) => {
  const Restaurant = sequelize.define(
    'Restaurant',
    {
      restaurantId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'Restaurant with this name already exists. Please use a different name.',
        }
      },
      // email: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      //   // unique: true,
      // },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tableCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: 'Table count must be an integer.',
          },
          min: {
            args: 3,
            msg: 'Table count must be at least 3.',
          },
          max: {
            args: 20,
            msg: 'Table count must not exceed 20.',
          },
        }
      },
    },
    { timestamps: false },
  );
  return Restaurant;
};
