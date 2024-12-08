import './CalendarRequests.css'
import React, { useState, useEffect } from 'react';

function getTotalDays(month, year) {
    return new Date(year, month + 1, 0).getDate()
}

function getMonthName(year, monthInt) {
    return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
        new Date(year, monthInt)
    );
}

function isOccupied(date, requestData) {
    for (let i = 0; i < requestData.length; i++) {
        const startDate = new Date(requestData[i].event_start)
        const endDate = new Date(requestData[i].event_end)
        const currentDate = date
        
        if (currentDate >= startDate && currentDate <= endDate) {
        return true
        }
    }
    return false
}
  
const CalendarRequests = ({ requestData }) => {
    
    if (!requestData) {
        return <p>Loading Request Calendar...</p>
    }

    const [currentYear, setCurrentYear] = useState(new Date().getFullYear()) /* returns int i.e 2024 */
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()) /* returns int at index 0 */
    let total_d = getTotalDays(currentMonth, currentYear)
    const color = [50,100,150] // three sets of different color that iterates for occupied days.

    function updateDays() {
        const total_days = getTotalDays(currentMonth, currentYear)
        total_d = total_days
    }

    const toggleMonth = (direction) => {
        switch (direction) {
          case "prev":
            if (currentMonth > 0) {
                setCurrentMonth(currentMonth - 1)
            }
            else {
                setCurrentMonth(11)
                setCurrentYear(currentYear - 1)
            }
            break
          case "next":
            if (currentMonth < 11) {
                setCurrentMonth(currentMonth + 1)
            } else {
                setCurrentMonth(0)
                setCurrentYear(currentYear + 1)
            }
            break
        }
        updateDays()
    }
    
    const toggleYear = (direction) => { // standby
    switch (direction) {
        case "prev":
            if ((present_year - currentYear) < 20) {
                setCurrentYear(currentYear - 1)
            }
            break
        case "next":
            if (present_year > currentYear) {
                setCurrentYear(currentYear + 1)
            }
            break
        }
        updateDays()
    } 

    return (
        <div>

            <div className='month'>
                <ul>
                    <li onClick={() => toggleMonth("prev")} className="prev">&#10094;</li>
                    <li onClick={() => toggleMonth("next")} className="next">&#10095;</li>
                    <li>
                    {getMonthName(currentYear, currentMonth)}<br/>
                    <span>{currentYear}</span>
                    {/* <li onClick={() => toggleYear("prev")} className="prev">&#10094;</li>
                    <li onClick={() => toggleYear("next")} className="next">&#10095;</li> */} {/* put these to left and right side of the current year. */}
                    </li>
                </ul>
            </div>
            
            <ul className="weekdays">
                <li>Mo</li>
                <li>Tu</li>
                <li>We</li>
                <li>Th</li>
                <li>Fr</li>
                <li>Sa</li>
                <li>Su</li>
            </ul>

            <ul className='days'>
                {Array.from({ length: total_d}, (_, index) => (
                    isOccupied(new Date(currentYear, currentMonth, index), requestData) ?
                    <li key={index + 1} className='dayElement' style={{"backgroundColor": `rgb(238,238,${(index + 1) % 2 == 0 ? color[0] : color[2]})`, "cursor": "pointer"}}>{index + 1}</li>
                        :
                    <li key={index + 1} className='dayElement' style={{"backgroundColor": `rgb(238,238,238)`}}>{index + 1}</li>
                ))}
            </ul>
            
        </div>
    )
}

export default CalendarRequests