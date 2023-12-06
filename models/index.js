const Sequelize = require('sequelize');
const Content = require('./Content');
const Discount = require('./Discount');
const Movie = require('./Movie');
const Payment = require('./Payment');
const Review = require('./Review');
const User = require('./User');
const Genre = require('./Genre');
const MovieGenre = require('./MovieGenre');
const ProdnCo = require('./ProdnCo');
const ProdnCoMovies = require('./ProdnCoMovies');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const models = {
  Content: Content.init(sequelize),
  Discount: Discount.init(sequelize),
  Movie: Movie.init(sequelize),
  Payment: Payment.init(sequelize),
  Review: Review.init(sequelize),
  User: User.init(sequelize),
  Genre: Genre.init(sequelize),
  MovieGenre: MovieGenre.init(sequelize),
  ProdnCo: ProdnCo.init(sequelize),
  ProdnCoMovies: ProdnCoMovies.init(sequelize),
};

Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

module.exports = {sequelize};