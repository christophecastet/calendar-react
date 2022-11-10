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

  const [title, setTitle] = useState("")
  const [modalTitle, setModalTitle] = useState('')
  const [deleteEvent, setDeleteEvents] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedInfo, setSelectedInfo] = useState()
  const [currentEvents, setCurrentEvents] = useState([])
  const [clickedInfo, setClickedInfo] = useState()
  const [checkedChantier, setCheckedChantier] = useState(false)
  const [checkedInter, setCheckedInter] = useState(false)
  const handleDateSelect = (selectInfo) => {
    handleOpen()
    setSelectedInfo(selectInfo)
    //calendarApi.unselect() // clear date selection
  }

  const handleOpen = () => {
    setTitle('')
    setModalTitle("Saisir un nom d'événement")
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(!showModal)
    let calendarApi = selectedInfo.view.calendar
    if (title.length > 0) {
      calendarApi.addEvent({ // will render immediately. will call handleEventAdd
        title,
        start: selectedInfo.startStr,
        end: selectedInfo.endStr,
        allDay: selectedInfo.allDay,
        backgroundColor: checkedChantier ? 'red' : 'green'
      }, true) // temporary=true, will get overwritten when reducer gives new events
    }
  }



  const handleEventClick = (clickInfo) => {
    setModalTitle("Supprimer événement?")
    setDeleteEvents(!deleteEvent)
    setShowModal(true)
    setClickedInfo(clickInfo)

  }


  const handleEvents = (events) => {
    setCurrentEvents(events)
  }

  const handleDelete = () => {
    setDeleted(true)
    setShowModal(false)
    setDeleteEvents(!deleteEvent)
  }

  const handleChange = (target) => {
    if (target == 'chantier') {
      setCheckedChantier(true)
      setCheckedInter(false)
    } else {
      setCheckedInter(true)
      setCheckedChantier(false)
    }
  }

  useEffect(() => {
    if (deleted) {
      clickedInfo.event.remove()
    }
  }, [deleted])


  return (
    <>
      {
        showModal && <div style={{ zIndex: 15, height: '40%', width: '20%', backgroundColor: 'pink', position: 'absolute', top: '30vh', right: '42vw' }}>
          <p>{modalTitle}</p>
          {
            !deleteEvent &&
            <>
              <input
                autoFocus
                type="text"
                placeholder="Add Title"
                style={{ width: "90%", marginRight: "10px" }}
                value={title}
                onChange={(e) => setTitle(e.target.value)} />
              <input type='checkbox' checked={checkedChantier} onChange={() => handleChange('chantier')} /> chantier
              <input type='checkbox' checked={checkedInter} onChange={() => handleChange('inter')} /> inter
            </>
          }
          {
            !deleteEvent ?
              <button onClick={() => handleClose()}>Valider</button>
              :
              <button onClick={() => handleDelete()}>Valider</button>
          }
        </div>
      }
      <div style={{ zIndex: 10 }}>
        <header >
          <div style={{ width: '95vw' }} >
            <FullCalendar
              //themeSystem='bootstrap5'
              views={{
                timeGrid: {
                  dayMaxEventRows: 6, // min value
                },
              }}
              locales={allLocales}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              dayMaxEventRows={true}
              select={handleDateSelect}
              eventClick={handleEventClick}
              eventsSet={handleEvents}
              weekNumbers={true}
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
    backgroundColor: 'pink'
  },
  {
    id: createEventId(),
    title: "Vacation",
    start: new Date(2022, 11, 7),
    end: new Date(2022, 11, 10),
    backgroundColor: 'green'
  },
  {
    id: createEventId(),
    title: "Conference",
    start: new Date(2022, 11, 20),
    end: new Date(2022, 11, 23),
    backgroundColor: 'red'
  },
];


function createEventId() {
  return String(eventGuid++)
}
