// ProdnCo랑 movie 다대다 연결 테이블
const Sequelize = require('sequelize');

module.exports = class ProdnCoMovies extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            movieId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Movies', // 'Movies' 테이블을 참조
                    key: 'id',
                },
            },
            prodoncoId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'ProdnCos', // 'ProdnCos' 테이블을 참조
                    key: 'id',
                },
            },
        }, {
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
