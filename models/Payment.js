// 결제 처리에 관련된 데이터를 처리

const Sequelize = require('sequelize');

module.exports = class Payment extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            paymentDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            paymentMethod: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            paymentAmount: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        },{
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Payment',
            tableName: 'payments',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(models) {
        Payment.belongsTo(models.User);
      }
};
