import logo from './logo.svg';
import React, { Fragment, useCallback, useMemo, useState, useEffect } from 'react'
import './App.css';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import allLocales from '@fullcalendar/core/locales-all';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { cloneDeep } from 'lodash';
import Modal from './Modal';


function App() {

  const [showInputTitle, setShowInputTitle] = useState(false)
  const [title, setTitle] = useState("")
  const [data, setData] = useState('')
  const [modal, setModal] = useState(false)
  const [selInf, setSelInf] = useState()

  const handleDateSelect = (selectInfo) => {
    handleOpen()
    //let calendarApi = selectInfo.view.calendar
    setSelInf(selectInfo)
    //let title = prompt('Please enter a new title for your event')
    //calendarApi.unselect() // clear date selection
    /* 
        if (title.length > 0) {
          calendarApi.addEvent({ // will render immediately. will call handleEventAdd
            title,
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            allDay: selectInfo.allDay
          }, true) // temporary=true, will get overwritten when reducer gives new events
        } */
  }

  const handleOpen = () => {
    setModal(true)
  }
  const handleClose = () => {
    setModal(!modal)
    let calendarApi = selInf.view.calendar
    if (title.length > 0) {
      calendarApi.addEvent({ // will render immediately. will call handleEventAdd
        title,
        start: selInf.startStr,
        end: selInf.endStr,
        allDay: selInf.allDay
      }, true) // temporary=true, will get overwritten when reducer gives new events
    }
  }


  return (
    <>
      {
        modal && <div style={{ zIndex: 15, height: '200px', width: '200px', backgroundColor: 'pink', position: 'absolute', top: '100px', bottom: '100px' }}>
          <p>ESSAI</p>
          <input
            autoFocus
            type="text"
            placeholder="Add Title"
            style={{ width: "90%", marginRight: "10px" }}
            value={title}
            onChange={(e) => setTitle(e.target.value)} />
          <button onClick={() => handleClose()}>Close</button>
        </div>
      }
      <div style={{ zIndex: 10 }}>
        <header >



          <div style={{ width: '95vw' }} >
            <FullCalendar
              //themeSystem='bootstrap5'
              locales={allLocales}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              select={handleDateSelect}
              locale='fr'
              initialEvents={EVENTS}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'timeGridWeek,dayGridMonth,timeGridDay'
              }}
            />
          </div>
        </header >
      </div >
    </>
  );
}

export default App;



let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today


const EVENTS = [
  {
    id: createEventId(),
    title: "Big Meeting",
    allDay: true,
    start: new Date(2022, 11, 1),
    end: new Date(2022, 11, 1),
  },
  {
    id: createEventId(),
    title: "Vacation",
    start: new Date(2022, 11, 7),
    end: new Date(2022, 11, 10),
  },
  {
    id: createEventId(),
    title: "Conference",
    start: new Date(2022, 11, 20),
    end: new Date(2022, 11, 23),
  },
];


function createEventId() {
  return String(eventGuid++)
}
