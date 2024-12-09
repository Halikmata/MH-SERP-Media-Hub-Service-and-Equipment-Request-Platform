import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
const localizer = momentLocalizer(moment);

const MyCalendar = ({ requestData }) => {
    const [events, setEvents] = useState([])
  

    useEffect(() => {
        if (requestData != null) {
            let list_events = new Array()
        
            for (let i = 0; i < requestData.length; i++) {
                list_events.push({ // add details here.
                    title: requestData[i].event_name,
                    location: requestData[i].event_location,
                    full_details: requestData[i],
                    start: new Date(Date.parse(requestData[i].event_start)).getTime(),
                    end: new Date(Date.parse(requestData[i].event_end)).getTime(),
                    allDay: true
                })
            }
            setEvents(list_events)
        }
    }, [requestData])
    
    const selectEvent = (event) => { //toggle events here.
        console.log(event.full_details)
    }

    const event = ({event}) => { // modify event designs here.
        return (
            <div>
                Event: {event.title}
                <br />
                Location: {event.location}
            </div>
        )
    }
    
  return (
    <div style={{ height: 800 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        components={{event:event}}
        onSelectEvent={selectEvent}
      />
    </div>
  )
}

export default MyCalendar;