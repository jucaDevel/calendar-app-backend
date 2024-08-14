const { response, request } = require("express")
const CalendarEvent = require("../models/CalendarEvent")


const getAllEventsByUser = async (req = request, res = response) => {
    const userId = req.params.userId
    try {
        const events = await CalendarEvent.find({'users.user':userId}).populate('users.user','name')
        if(events.length === 0){
            res.status(400).json({
                ok: false,
                msg:'No hay eventos'
            })    
        }
        else{
            res.status(200).json({
                ok: true,
                data: events
            })
        }
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg:'ERROR_OCURRED'
        })
    }
}

const updateEvent = async (req, res = response) => {
    const idEvent = req.params.id
    try {
        const event = await CalendarEvent.findById(idEvent)
        if(!event){
            res.status(401).json({
                ok: false,
                msg:'EVENT_NOT_EXIST'
            })
        }

        const newEvent = await CalendarEvent.findByIdAndUpdate(idEvent, {...req.body}, { new:true })

        res.status(200).json({
            ok: true,
            data: newEvent
        })

    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg:'ERROR_OCURRED'
        })
    }
}

const createEvent = async (req, res = response) => {
    const calendarEvent = new CalendarEvent(req.body)
    try {
        await calendarEvent.save()

        return res.status(200).json({
            ok: true,
            msg: 'EVENT_CREATED',
            data: calendarEvent
        })
    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg:'ERROR_OCURRED'
        })
    }
}

const removeEvent = async (req, res = response) => {
    const idEvent = req.params.id
    try {
        const event = await CalendarEvent.findById(idEvent)
        if(!event){
            res.status(401).json({
                ok: false,
                msg:'EVENT_NOT_EXIST'
            })
        }

        const newEvent = await CalendarEvent.findByIdAndUpdate(idEvent, { status:0 }, { new:true })

        res.status(200).json({
            ok: true,
            data: newEvent
        })

    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg:'ERROR_OCURRED'
        })
    }
}

module.exports = {
    getAllEventsByUser,
    updateEvent,
    createEvent,
    removeEvent
}