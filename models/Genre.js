// 장르 관련된 데이터를 처리하는 모델
const Sequelize = require('sequelize');
const config = require('../config/config');

module.exports = class Genre extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
                primaryKey: true
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
    static associate(models) {
        Genre.belongsToMany(models.Movie, { through: 'MovieGenre', foreignKey: 'name'});
    }
};

