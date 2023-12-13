const Sequelize = require('sequelize');

module.exports = class Coupon extends Sequelize.Model {
    static init(sequelize) {
        this.sequelizeInstance = sequelize; // 추가: sequelize 참조를 인스턴스 속성에 저장
        return super.init(
            {
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
                },
            },
            {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'Coupon',
                tableName: 'Coupons',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        );
    }

    static async syncModel() {
        try {
            await this.sync();
            console.log('Models synchronized successfully!');
        } catch (error) {
            console.error('Error synchronizing models:', error);
        }
    }
    
    static associate(models) {
        // 다대다 연결
        Coupon.belongsToMany(models.Payment, { through: models.PaymentCoupon, foreignKey: 'couponId' });
        Coupon.belongsToMany(models.User, { through: models.UserCoupon, foreignKey: 'couponId' });
    }

    static async insertCoupon(name, discountRate, discountPeriod) {
        try {
            await this.syncModel();

            const testData = [
                { name: "coupon1", discountRate: 10, discountPeriod: new Date() },
                { name: "coupon2", discountRate: 20, discountPeriod: new Date() },
                { name: "coupon3", discountRate: 30, discountPeriod: new Date() }
            ];

            // testData를 먼저 데이터베이스에 삽입
            await this.bulkCreate(testData);
            console.log('Test coupons inserted successfully!');

            // 사용자가 입력한 데이터를 데이터베이스에 삽입
            const userCoupon = await this.create({
                name: name,
                discountRate: discountRate,
                discountPeriod: discountPeriod
            });

            console.log('Coupon inserted successfully:', userCoupon);
        } catch (error) {
            console.error('Coupon insertion error:', error);
        }
    }
};
