import React, { useState, useEffect } from 'react'
import './App.css';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import allLocales from '@fullcalendar/core/locales-all';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { cloneDeep } from 'lodash';


function App() {

  const EVENTS = [
    {
      id: 'chantier',
      title: "Big Meeting",
      allDay: true,
      start: new Date(2022, 11, 1),
      end: new Date(2022, 11, 1),
      backgroundColor: 'red'
    },
    {
      id: 'inter',
      title: "Vacation",
      start: new Date(2022, 11, 7),
      end: new Date(2022, 11, 10),
      backgroundColor: 'green'
    },
    {
      id: 'chantier',
      title: "Conference",
      start: new Date(2022, 11, 20),
      end: new Date(2022, 11, 23),
      backgroundColor: 'red'
    },
  ];

  const [title, setTitle] = useState("") // attribution d'un titre à l'événement
  const [modalTitle, setModalTitle] = useState('') // attribution du titre de la modale
  const [target, setTarget] = useState('') // set le target chantier ou inter

  const [deleteEvent, setDeleteEvents] = useState(false) //flag pour afficher le bon bouton
  const [deleted, setDeleted] = useState(false) // flag pour le UE si true alors on déclenche la fn delete
  const [showModal, setShowModal] = useState(false) // flag pour ouvrir la modale
  const [checkedChantier, setCheckedChantier] = useState(false) // checkBox chantier
  const [checkedInter, setCheckedInter] = useState(false) // checkBox inter
  const [isValueSelected, setIsValueSelected] = useState(false) // flag pour le UE qui filtre les events

  const [selectedInfo, setSelectedInfo] = useState() // variable contenant les infos des cases du calendrier
  const [clickedInfo, setClickedInfo] = useState() // variable contenant les infos de la case cliqué
  const [choice, setChoice] = useState() // valeur sélectionnée du dropDown
  const [currentEvents, setCurrentEvents] = useState([]) // événement courant

  const [events, setEvents] = useState(EVENTS)

  // lors de la selection des cases du calendrier :
  // => déclenche la fn qui gère la modale 
  // => attribution des infos relatives aux cases sélectionnées dans une variable
  const handleDateSelect = (selectInfo) => {
    handleOpen()
    setSelectedInfo(selectInfo)
    //calendarApi.unselect() // clear date selection
  }


  // => ouvre la modale
  // => set un titre à la modale
  // => reset le titre de l'event
  const handleOpen = () => {
    setTitle('')
    setModalTitle("Saisir un nom d'événement")
    setShowModal(true)
  }

  // lors de l'action Valider
  // => fermeture de la modale
  // => ajout de l'event au calendrier
  const handleClose = () => {
    setShowModal(!showModal)
    let calendarApi = selectedInfo.view.calendar
    if (title.length > 0) {
      calendarApi.addEvent({ // will render immediately. will call handleEventAdd
        id: target,
        title,
        start: selectedInfo.startStr,
        end: selectedInfo.endStr,
        allDay: selectedInfo.allDay,
        backgroundColor: checkedChantier ? 'red' : 'green'
      }, true) // temporary=true, will get overwritten when reducer gives new events
      // ajout a hook envent

    }
  }

  // permet la suppression d'un event
  // => ajoute un titre à la modale
  // => ouvre la modale
  // => set les infos de la case cliqué 
  const handleEventClick = (clickInfo) => {
    setModalTitle("Supprimer événement?")
    setDeleteEvents(!deleteEvent)
    setShowModal(true)
    setClickedInfo(clickInfo)

  }

  // permet de drag n drop et de redimensionner l'event
  const handleEvents = (events) => {
    setCurrentEvents(events)
  }

  // => set le flag deleted a true pour l'écouter dans un use state
  // => set le flag d'affichage deletedEvents pour afficher le bon boutton
  const handleDelete = () => {
    setDeleted(true)
    setShowModal(false)
    setDeleteEvents(!deleteEvent)
  }

  // => gestion des check box de la modale
  const handleChange = (target) => {
    if (target == 'chantier') {
      setCheckedChantier(true)
      setCheckedInter(false)


    } else {
      setCheckedInter(true)
      setCheckedChantier(false)
    }
    setTarget(target)
  }

  // gestion des filtres
  const handleSelectOption = (e) => {
    console.log('E', e.target.value)
    setChoice(e.target.value)
    setIsValueSelected(true)
  }

  // déclenche la fn de suppression d'event 
  useEffect(() => {
    if (deleted) {
      clickedInfo.event.remove()
    }
  }, [deleted])

  useEffect(() => {
    if (isValueSelected) {
      console.log('choice', choice)
      let ev = events.filter(e =>
        //console.log('e', e),
        e.id === choice
      )
      setEvents(ev)
      setIsValueSelected(false)
    }
  }, [isValueSelected])
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
          <div>
            <label htmlFor="event">Choisir un événement:</label>
            <select value={choice} name="event" id="event" onChange={(c) => handleSelectOption(c)}  >
              <option value="chantier" >Chantier</option>
              <option value="inter">Inter</option>
            </select>
            <button onClick={() => setEvents(EVENTS)} style={{ marginLeft: '15px' }}>RESET</button>
          </div>

          <div style={{ width: '95vw', marginTop: '15px' }} >
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
              eventClick={handleEventClick} //to delete
              eventsSet={handleEvents}
              weekNumbers={true}
              locale='fr'
              events={events}
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







