// 회원 관리에 관련된 데이터를 처리
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            userId:{
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
                primaryKey: true
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            username: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
            },
            dateOfBirth: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            phoneNumber: {
                type: Sequelize.STRING(20),
                allowNull: true,
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

    static associate(models) {
        // User 모델과 다른 모델들 간의 관계 설정
        User.hasMany(models.Content, { foreignKey: 'userId' });
        User.hasMany(models.Coupon, { foreignKey: 'userId' });
        User.hasMany(models.Payment, { foreignKey: 'userId' });
        User.hasMany(models.Review, { foreignKey: 'userId' });
        User.belongsToMany(models.Movie, { through: 'UserMovie', foreignKey: 'userId' });
        User.belongsToMany(models.Coupon, {through: 'UserCoupon', foreignKey: 'userId'});
    }
    
    // 비밀번호 검증 메서드
    validPassword(password) {
        return bcrypt.compareSync(password,this.getDataValue('password'));
    }
};

