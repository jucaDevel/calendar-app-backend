const User = require("../models/User")
const moment = require('moment')
const { Types } = require('mongoose')


const validateUserExist = async ( users ) => {
    users.forEach( async ( { user } ) => {
        const userExist = await User.findOne( {_id:user} );
        if(!userExist){
            throw new Error(`User with id ${user} does not exist`)
        }
    });
}

const isDate = ( date ) => {

    if(!date){
        throw new Error(`Date is required`)
    }

    const isValidDate = moment.isDate(date)
    if(!isValidDate){
        throw new Error(`Date ${date} is not valid`)
    }
}

module.exports = {
    validateUserExist,
    isDate
}