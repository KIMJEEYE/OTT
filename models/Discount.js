// 할인 관리에 관련된 데이터를 처리

const Sequelize = require('sequelize');

module.exports = class Discount extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            name: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            discountRate: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            discountPeriod: {
                type: Sequelize.DATE,
                allowNull: false,
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Discount',
            tableName: 'discounts',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(models) {
        Discount.belongsTo(models.User);
      }
};
