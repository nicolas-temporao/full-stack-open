import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'
import './index.css'

const Persons = ({persons, remove}) => {
  return (
    <div>
      {persons.map(person =>
        <Person key={person.id} person={person} remove={remove}/>
      )}
    </div>
  )
}

const DeleteButton = ({onClick}) => {
  return (
    <button onClick={onClick}>delete</button>
  )
}

const PersonForm = ({name, number, onSubmit, onNameChange, onNumberChange}) => {
  return (
      <form onSubmit={onSubmit}>
        <div>
          name: <input value={name} onChange={onNameChange}/> <br/>
          number: <input value={number} onChange={onNumberChange}/> 
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const Person = ({person, remove}) =>{
  return (
    <>
    <div>{person.name} {person.number} <DeleteButton onClick={()=>remove(person.id, person.name)}/></div>
    </>  
  )
}

const Filter = ({value, onChange}) => {
  return (
    <div>
      filter shown with <input value={value} onChange={onChange}/>
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  useEffect(() => {
      personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const showMessage = (text, type) => {
    setMessage(text)
    setMessageType(type)

    setTimeout(() => {
      setMessage(null)
      setMessageType(null)
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person=>person.name === newName)){
      updatePerson(newName)
    } else{
      const nameObject = { name: newName, number: newNumber }

      personService.create(nameObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        showMessage(`added ${newName}`, 'success')
        setNewName('')
        setNewNumber('')
      })
      .catch((error)=>{
        showMessage(error.response.data.error, 'error')
      })
    }
  }

  const removePerson = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)){
      personService.remove(id)
      .then(() => {
        setPersons(persons.filter(person=>person.id !== id))
        showMessage(`Deleted ${name}`, 'success')
      })      
      .catch(()=>{
        showMessage(`Failed to delete ${name}`, 'error')
      })
    } 
  }

  const updatePerson = (name) => {
    if (window.confirm(`${name} is already added to phonebook, replace the old number with a new one?`)) {
      const existingPerson = persons.find(person => person.name === name)
      const updatedPerson = {...existingPerson, number: newNumber}
      personService.update(existingPerson.id, updatedPerson)
      .then(response => {
        setPersons(
          persons.map(person=>
            person.id !== existingPerson.id ? person : response.data
          )
        )
        setNewName('')
        setNewNumber('')
        showMessage(`Changed number for: ${name}`, 'success')
      })
      .catch(error => {
        showMessage(error.response.data.error, 'error')
      })
    }
  }

  const peopleToShow = (newSearch === '') ? persons : persons.filter(person => person.name.toLowerCase().includes(newSearch.toLowerCase()))


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={messageType}/>

      <Filter value={newSearch} onChange={(event)=>setNewSearch(event.target.value)}/>

      <h2>Add a new</h2>

      <PersonForm 
        name={newName}
        number={newNumber}
        onSubmit={addPerson}
        onNameChange={(event) => setNewName(event.target.value)}
        onNumberChange={(event) => setNewNumber(event.target.value)}
      />

      <h2>Numbers</h2>
      <Persons persons={peopleToShow} remove={removePerson}/>
    </div>
  )
}

export default App