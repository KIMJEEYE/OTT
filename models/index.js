const Sequelize = require('sequelize');
const Content = require('./Content');
const Discount = require('./Discount');
const Movie = require('./Movie');
const Payment = require('./Payment');
const Review = require('./Review');
const User = require('./User');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {
  sequelize,
  Content,
  Discount,
  Movie,
  Payment,
  Review,
  User
};

Content.init(sequelize);
Discount.init(sequelize);
Movie.init(sequelize);
Payment.init(sequelize);
Review.init(sequelize);
User.init(sequelize);

// Content.associate(db);
// Discount.associate(db);
// Movie.associate(db);
// Payment.associate(db);
// Review.associate(db);
// User.associate(db);

module.exports = db;
