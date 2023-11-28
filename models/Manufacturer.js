// 제작사 관리에 관련된 데이터를 처리
const  Sequelize = require('sequelize');

module.exports = class Manufacturer extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            productionCompany: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            representative: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            phoneNumber: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            homepage: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            address: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            filmography: {
                type: Sequelize.STRING,
                allowNull: true,
            },
        },{
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Manufacturer',
            tableName: 'manufacturers',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
};
