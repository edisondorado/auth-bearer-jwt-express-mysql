module.exports = (sequelize, Sequelize) => {
    const Token = sequelize.define("token", {
        userId: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        token: {
            type: Sequelize.STRING
        },
        invalidated: {
            type: Sequelize.BOOLEAN,
            defaultValue: false 
        }
    }, {
        timestamps: false
    });

    return Token;
};