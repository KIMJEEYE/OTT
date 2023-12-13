// 콘텐츠 관리에 관련된 데이터를 처리하는 모델
// 콘텐츠 유효 기간 관리, 콘텐츠 업로드, 메타데이터 관리, 스트리밍 서비스 및 보존 기간 관리
// Content.js
const Sequelize = require('sequelize');

module.exports = class Content extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            validityPeriod: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            uploadDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            metadata: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            streamingService: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            retentionPeriod: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Content',
            tableName: 'contents',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(models) {
        Content.belongsTo(models.Movie, { foreignKey: 'movieId', as: 'Movie' });
    }

    // rating이 4.8 이상이면 validityPeriod를 2주 연장하고 retentionPeriod를 설정
    async updateValidityAndRetentionPeriod() {
        if (this.Movie) {
            // 현재 validityPeriod에 2주를 더해서 새로운 유효기간을 설정
            const newValidityPeriod = new Date(this.validityPeriod);
            newValidityPeriod.setDate(newValidityPeriod.getDate() + 14);

            // rating이 4.8 이상이면 validityPeriod를 2주 더 연장
            if (this.Movie.rating >= 4.8) {
                newValidityPeriod.setDate(newValidityPeriod.getDate() + 14);
            }

            // retentionPeriod를 유효기간의 1달 뒤로 설정
            const newRetentionPeriod = new Date(newValidityPeriod);
            newRetentionPeriod.setMonth(newRetentionPeriod.getMonth() + 1);

            // 콘텐츠 모델 업데이트
            await this.update({
                validityPeriod: newValidityPeriod,
                retentionPeriod: newRetentionPeriod,
            });
        }
    }
};
