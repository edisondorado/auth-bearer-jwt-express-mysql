module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        password: {
            type: Sequelize.STRING
        }
    }, {
        timestamps: false
    });

    return User;
}
