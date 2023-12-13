const Sequelize = require('sequelize');

module.exports = class UserCoupon extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users', // 'Users' 테이블을 참조
                    key: 'Id',
                },
            },
            couponId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Coupons', // 'Coupons' 테이블을 참조
                    key: 'Id',
                },
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'UserCoupon',
            tableName: 'userCoupons',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        }
        );
    }
};
