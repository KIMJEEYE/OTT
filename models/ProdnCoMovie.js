// ProdnCo랑 movie 다대다 연결 테이블
const Sequelize = require('sequelize');

module.exports = class ProdnCoMovies extends Sequelize.Model {
    static init(sequelize) {
        return super.init({}, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'ProdncoMovies',
            tableName: 'prodncoMovies',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
};
