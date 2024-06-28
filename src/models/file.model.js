module.exports = (sequelize, Sequelize) => {
    const File = sequelize.define("file", {
        name: {
            type: Sequelize.STRING
        },
        extension: {
            type: Sequelize.STRING
        },
        mimeType: {
            type: Sequelize.STRING
        },
        size: {
            type: Sequelize.INTEGER
        },
        uploadDate: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    });

    return File;
};