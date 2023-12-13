const Sequelize = require('sequelize');
const models = require('../models');

module.exports = class Movie extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            title: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            director: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            year: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            synopsis: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            rating: {
                type: Sequelize.FLOAT,
            },
            prodncoId: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
        }, {
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
        // 다대다 관계 설정
        Movie.belongsToMany(models.User, { through: 'UserMovie' });
        Movie.belongsToMany(models.Genre, { through: 'MovieGenre', foreignKey: 'movieId' });
        Movie.hasMany(models.Review, { foreignKey: 'movieId' });
        Movie.hasOne(models.Content, { foreignKey: 'movieId', as: 'Content' }); // 일대일 관계 설정
    }

    // 리뷰 평점 업데이트 하는 메서드
    static async updateRating(movieId) {
        try {
            const movie = await this.findByPk(movieId, {
                include: models.Review,
            });

            if (!movie) {
                console.error('영화를 찾지 못했습니다.');
                return;
            }

            const reviews = movie.Reviews || []; // Reviews가 없으면 빈 배열로 초기화

            if (reviews.length === 0) {
                console.log('리뷰가 없어 평균 평점을 업데이트하지 않습니다.');
                return;
            }

            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = totalRating / reviews.length;

            await movie.update({ rating: averageRating });

            console.log('영화 평점이 업데이트 되었습니다:', movie);
        } catch (error) {
            console.error('영화 평점을 업데이트하지 못했습니다.:', error);
        }
    }

};