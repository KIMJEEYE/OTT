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

    async updateValidityAndRetentionPeriod() {
        if (this.Movie) {
            const newValidityPeriod = new Date(this.validityPeriod);
            newValidityPeriod.setDate(newValidityPeriod.getDate() + 14);

            if (this.Movie.rating >= 4.8) {
                newValidityPeriod.setDate(newValidityPeriod.getDate() + 14);
            }

            const newRetentionPeriod = new Date(newValidityPeriod);
            newRetentionPeriod.setMonth(newRetentionPeriod.getMonth() + 1);

            await this.update({
                validityPeriod: newValidityPeriod,
                retentionPeriod: newRetentionPeriod,
            });
        }
    }
};
