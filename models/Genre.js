// 장르 관련된 데이터를 처리하는 모델
const Sequelize = require('sequelize');

module.exports = class Genre extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Genre',
            tableName: 'genres',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
};