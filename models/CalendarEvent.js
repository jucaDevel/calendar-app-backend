const {Schema, model} = require('mongoose')

const userSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    _id: false
})

const CalendarEventSchema = Schema({
    title: {
        type: 'String',
        required: true
    },
    notes:{
        type: 'String'
    },
    start:{
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    status:{
        type: 'Number',
        required: true,
        default: 1
    },
    users: {
        type: [userSchema],
        default: undefined
    }
})

CalendarEventSchema.methods.toJSON = function() {
    const {__v, _id, ...calendarEvents} = this.toObject();
    calendarEvents.id = _id;
    return calendarEvents
}

module.exports = model('CalendarEvent', CalendarEventSchema)