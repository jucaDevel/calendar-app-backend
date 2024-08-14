const { connect } = require('mongoose')

const dbConnection = async () => {
    try {
        await connect(process.env.DB_CONNECTION)
        console.log('DB calendar is online');
    } catch (error) {
        console.log(error);
        throw new Error('Error, can not initialize the DB')
    }
}

module.exports = {
    dbConnection
}