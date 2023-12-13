const Sequelize = require('sequelize');
const { Payment } = require('../models/Payment');
const { Coupon } = require('../models/Coupon');

module.exports = class PaymentCoupon extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                paymentId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                couponId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'PaymentCoupon',
                tableName: 'paymentCoupons',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
                primaryKey: ['couponId', 'paymentId'], 
            }
        );
    }
};
