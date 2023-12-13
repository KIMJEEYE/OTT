const Sequelize = require('sequelize');
const Content = require('./Content');
const Coupon = require('./Coupon');
const Movie = require('./Movie');
const Review = require('./Review');
const User = require('./User');
const Genre = require('./Genre');
const MovieGenre = require('./MovieGenre');
const ProdnCo = require('./ProdnCo');
const ProdnCoMovies = require('./ProdnCoMovies');
const PaymentCoupon = require('./PaymentCoupon');
const Payment = require('./Payment');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, {
  ...config,
  logging: true,
});


const models = {
  
  
  Coupon: Coupon.init(sequelize),
  
  Movie: Movie.init(sequelize),
  Content: Content.init(sequelize),
  Review: Review.init(sequelize),
  User: User.init(sequelize),
  Genre: Genre.init(sequelize),
  MovieGenre: MovieGenre.init(sequelize),
  ProdnCo: ProdnCo.init(sequelize),
  Payment: Payment.init(sequelize),
  ProdnCoMovies: ProdnCoMovies.init(sequelize),
  PaymentCoupon: PaymentCoupon.init(sequelize),
};


Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach((model) => {
    model.associate(models);
  });

module.exports = { sequelize, ...models };