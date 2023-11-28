// 콘텐츠 관리에 관련된 데이터를 처리하는 모델
// 콘텐츠 유효 기간 관리, 콘텐츠 업로드, 메타데이터 관리, 스트리밍 서비스 및 보존 기간 관리
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
}