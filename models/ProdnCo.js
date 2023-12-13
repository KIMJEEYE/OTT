// 제작사 관리에 관련된 데이터를 처리
const Sequelize = require('sequelize');

module.exports = class ProdnCo extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    unique: true,
                },
                ceo: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                homepage: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
            },
            {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'ProdnCo',
                tableName: 'prodnCos',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        );
    }

    static associate(models) {
        ProdnCo.belongsToMany(models.Movie, {
            through: 'ProdnCoMovies',
            foreignKey: 'prodncoId',
        });
    }

    // bulkCreate 메서드 추가
    static async bulkCreate(items) {
        try {
            const createdItems = await ProdnCo.bulkCreate(items);
            return createdItems;
        } catch (error) {
            console.error('Error in bulkCreate:', error);
            throw error;
        }
    }
};
