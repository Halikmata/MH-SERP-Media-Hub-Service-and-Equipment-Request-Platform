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

const CalendarRequests = ({ requestData }) => {
    
    if (!requestData) {
        return <p>Loading Request Calendar...</p>
    }

    const [currentYear, setCurrentYear] = useState(new Date().getFullYear()) /* returns int i.e 2024 */
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()) /* returns int at index 0 */
    let total_d = getTotalDays(currentMonth, currentYear)
    
    const present_year = new Date().getFullYear()

    

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
    
    /* const toggleYear = (direction) => { // standby
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
    } */
    
    /* for (let i = 0; i < requestData.length; i++) {
        const color = Math.floor((Math.random() * 200) + 1)
        requestData[i].color = color
    } */

    //console.log(`Days: ${total_d} Month: ${getMonthName(currentYear,currentMonth)} Year: ${currentYear}`)
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
                {/* {Array.from({ length: totalDays }, (_, index) => (
                    occupiedDays.includes(index) ? 
                        <li key={index} className='dayElement' onClick={255} style={{"backgroundColor": `rgb(238,238,${55})`, "cursor": "pointer"}}>{index}</li>
                        : // else
                        <li key={index} className='dayElement' style={{"backgroundColor": `rgb(238,238,238)`}}>{index}</li>
                ))} */}

                {Array.from({ length: total_d + 1}, (_, index) => (
                    <li key={index} className='dayElement' style={{"backgroundColor": `rgb(238,238,238)`}}>{index}</li>
                ))}

            </ul>
            
        </div>
    )
}

export default CalendarRequests