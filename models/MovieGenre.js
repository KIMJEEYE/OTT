// genre랑 movie 다대다 연결 테이블
const Sequelize = require('sequelize');

module.exports = class MovieGenre extends Sequelize.Model {
    static init(sequelize) {
        return super.init({}, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'MovieGenre',
            tableName: 'movieGenres',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
};
