import React, { useState, useEffect, useRef, memo } from 'react'
import './App.css';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { Draggable } from '@fullcalendar/interaction'
import allLocales from '@fullcalendar/core/locales-all';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { cloneDeep } from 'lodash';
import { Calendar } from '@fullcalendar/core';


function App() {
  // générateur d'id
  let eventGuid = 0
  function createEventId() {
    return String(eventGuid++)
  }
  // Model
  const EVENTS = [
    {
      id: createEventId(),
      title: "Big Meeting",
      allDay: true,
      start: new Date(2022, 11, 1),
      end: new Date(2022, 11, 1),
      backgroundColor: 'red',
      description: 'chantier'
    },
    {
      id: createEventId(),
      title: "Vacation",
      start: new Date(2022, 11, 7),
      end: new Date(2022, 11, 10),
      backgroundColor: 'green',
      description: 'inter'
    },
    {
      id: createEventId(),
      title: "Conference",
      start: new Date(2022, 11, 20),
      end: new Date(2022, 11, 23),
      backgroundColor: 'red',
      description: 'chantier'
    },
    {
      id: createEventId(),
      title: "Big Meeting",
      allDay: true,
      start: new Date(2022, 11, 3),
      end: new Date(2022, 11, 3),
      backgroundColor: 'pink',
      display: 'background',
      description: 'réunion'
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
  const [draggableEvents, setDraggableEvents] = useState([
    { title: "Event 1", id: "1" },
    { title: "Event 2", id: "2" },
    { title: "Event 3", id: "3" },
    { title: "Event 4", id: "4" },
    { title: "Event 5", id: "5" }
  ])
  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" }) // event via date picker
  const calendarRef = useRef();
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
        id: createEventId(),
        title,
        start: selectedInfo.startStr,
        end: selectedInfo.endStr,
        allDay: selectedInfo.allDay,
        backgroundColor: checkedChantier ? 'red' : 'green',
        description: selectedInfo.description
      }, true) // temporary=true, will get overwritten when reducer gives new events
      // dans le model local, ajout de la data à  la volé 
      setEvents(events => [...events, {
        id: createEventId,
        title: title,
        start: selectedInfo.startStr,
        end: selectedInfo.endStr,
        backgroundColor: checkedChantier ? 'red' : 'green',
        description: selectedInfo.description
      }])
    }
  }

  // permet la suppression ou l'édition d'un event
  // => ajoute un titre à la modale
  // => ouvre la modale
  // => set les infos de la case cliqué 
  const handleEventClick = (clickInfo) => {
    setModalTitle("Supprimer/éditer événement?")
    setDeleteEvents(!deleteEvent)
    setShowModal(true)
    setClickedInfo(clickInfo)
    setTarget('')
    setTitle('')
    setCheckedInter(false)


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

  // ajout avec date picker
  function handleAddEvent() {
    //console.log('calendarRef', calendarRef.current.select())
    var calendarApi = calendarRef.current.getApi()
    console.log('cal', newEvent)
    calendarApi.addEvent(newEvent)
    //let calendarApi = selectedInfo.view.calendar
    if (newEvent.title.length > 0) {

      // dans le model local, ajout de la data à  la volé 
      setEvents(events => [...events, {
        id: createEventId,
        title: newEvent.title,
        start: newEvent.startStr,
        end: newEvent.endStr,
      }])
    }
  }


  // déclenche la fn de suppression d'event 
  useEffect(() => {
    if (deleted) {
      if (target !== 'edit') {
        clickedInfo.event.remove()
      } else {
        clickedInfo.event.setProp('title', title)
      }
    }
  }, [deleted])


  // filtre
  useEffect(() => {
    if (isValueSelected) {
      console.log('choice', choice)
      let ev = events.filter(e =>
        //console.log('e', e),
        e.description === choice
      )
      setEvents(ev)
      setIsValueSelected(false)
    }
  }, [isValueSelected])

  // Draggable events
  const ExternalEvent = memo(({ event }) => {
    let elRef = useRef(null);

    useEffect(() => {
      let draggable = new Draggable(elRef.current, {
        eventData: function () {
          return { ...event, create: true };
        }
      });

      // a cleanup function
      return () => draggable.destroy();
    });

    return (
      <div
        ref={elRef}
        className="fc-event"
        title={event.title}
        style={{ cursor: 'grab', backgroundColor: '#007bff', margin: '10px 0', textAlign: 'center', height: '30px', width: '100px', borderRadius: '5px', color: 'white' }}
      >
        <div>
          <div>
            <strong>{event.title}</strong>
          </div>
        </div>
      </div>
    );
  });


  return (
    <>
      {
        showModal && <div style={{ zIndex: 15, height: '40%', width: '20%', backgroundColor: 'pink', position: 'absolute', top: '30vh', right: '42vw' }}>
          <p>{modalTitle}</p>
          <input
            autoFocus
            type="text"
            placeholder="Add Title"
            style={{ width: "90%", marginRight: "10px" }}
            value={title}
            onChange={(e) => setTitle(e.target.value)} />
          {
            !deleteEvent &&
            <>
              <input type='checkbox' checked={checkedChantier} onChange={() => handleChange('chantier')} /> chantier
              <input type='checkbox' checked={checkedInter} onChange={() => handleChange('inter')} /> inter
            </>
          }
          {
            !deleteEvent ?
              <button onClick={() => handleClose()}>Valider</button>
              :
              <>
                <input type='checkbox' checked={checkedInter} onChange={() => handleChange('edit')} />éditer
                <button onClick={() => handleDelete()}>Valider</button>
              </>
          }
        </div>
      }
      <div style={{ zIndex: 10 }}>
        <header >
          <div>
            <div>
              <input type="text" placeholder="Add Title" style={{ width: "20%", marginRight: "10px" }} value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
              <DatePicker showTimeSelect placeholderText="Start Date" style={{ marginRight: "10px" }} selected={newEvent.start} dateFormat="yyyy-MM-dd" onChange={(start) => setNewEvent({ ...newEvent, start })} />
              <DatePicker showTimeSelect placeholderText="End Date" selected={newEvent.end} dateFormat="yyyy-MM-dd" onChange={(end) => setNewEvent({ ...newEvent, end })} />
              <button stlye={{ marginTop: "10px" }} onClick={() => handleAddEvent()}>
                Ajouter événement
              </button>
            </div>
          </div>
          <div
            id="external-events"
            style={{
              padding: "10px",
              width: "80%",
              height: "auto",
              //maxHeight: "-webkit-fill-available"
            }}
          >
            <p align="left">
              <strong> Draggable Evenements</strong>
            </p>

            <div id="external-events">
              {draggableEvents.map((event) => (
                <ExternalEvent key={event.id} event={event} />
              ))}
            </div>
          </div>
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
              ref={calendarRef}
              //themeSystem='bootstrap5'
              views={{
                timeGrid: {
                  dayMaxEventRows: 6, // min value
                },
              }}
              locales={allLocales}
              editable={true}
              //droppable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              dayMaxEventRows={true}
              select={handleDateSelect}
              eventClick={handleEventClick} //to delete
              eventsSet={handleEvents}
              //eventDrop={false}
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







