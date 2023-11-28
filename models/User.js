// 회원 관리에 관련된 데이터를 처리
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            username: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING(40),
                allowNull: false,
            },
            dateOfBirth: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            phoneNumber: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        },{
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    // // 비밀번호 검증 메서드
    // validPassword(password) {
    //     return bcrypt.compareSync(password,this.getDataValue('password'));
    // }
};

