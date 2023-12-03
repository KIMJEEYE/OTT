// 영화 정보에 관련된 데이터 처리

const Sequelize = require('sequelize');

module.exports = class Movie extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            director: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            year: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            synopsis: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
        },{
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Movie',
            tableName: 'movies',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(models) {
        Movie.belongsToMany(models.User, { through: 'UserMovie' });
        Movie.hasMany(models.Review);
      }
};
