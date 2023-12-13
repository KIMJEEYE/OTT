const Sequelize = require('sequelize');
module.exports = class Review extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            movieId: { 
                type: Sequelize.INTEGER, 
                allowNull: false,
            },
            rating: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Review',
            tableName: 'reviews',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(models) {
        Review.belongsTo(models.Movie, { foreignKey: 'movieId', as: 'Movie' });
    }
};
