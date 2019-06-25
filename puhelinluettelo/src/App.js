import React, { useState, useEffect } from 'react'
import personService from './services/persons'

const Persons = ({ persons, deletePerson }) => persons.map(person => {
  return (
    <p key={person.name}>{person.name} {person.number}
      <DeleteButton deleteThisPerson={() => deletePerson(person)} />
    </p>
  )
})

const Filter = ({ newNameFilter, handleNewNameFilter }) => {

  return (
    <div>
      rajaa näytettäviä: <input
        value={newNameFilter}
        onChange={handleNewNameFilter}
      />
    </div>
  )
}

const PersonForm = ({ addPerson, newName, newNumber, handleNameChange, handleNumberChange }) => {

  return (
    <form onSubmit={addPerson}>
      <div>
        nimi: <input
          value={newName}
          onChange={handleNameChange}
          required
        />
      </div>
      <div>
        numero: <input
          value={newNumber}
          onChange={handleNumberChange}
          required
        />
      </div>
      <div>
        <button type="submit">lisää</button>
      </div>
    </form>
  )
}

const DeleteButton = ({ deleteThisPerson }) => {
  return (
    <button type="button" style={{ marginLeft: .5 + 'em' }} onClick={deleteThisPerson}>
      poista
    </button>
  )
}

const SuccessNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="success">
      {message}
    </div>
  )
}

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newNameFilter, setNewNameFilter] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleNewNameFilter = (event) => {
    setNewNameFilter(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }


  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }

    if (persons.find(person => person.name === newName)) {
      if (window.confirm(`${personObject.name} on jo luettelossa. Korvataanko vanha numero uudella?`)) {
        updatePerson(personObject)
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setSuccessMessage(
            `Henkilö ${returnedPerson.name} lisättiin luetteloon.`
          )
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const deletePerson = (person) => {
    if (window.confirm(`Haluatko todella poistaa henkilön ${person.name}?`)) {
      personService
        .deleteOne(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
          setSuccessMessage(
            `Henkilö ${person.name} poistettiin luettelosta`
          )
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })
        .catch(error => {
          setErrorMessage(
            `Henkilö ${person.name} on jo poistettu luettelosta`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setPersons(persons.filter(p => p.id !== person.id))
        })
      setNewName('')
      setNewNumber('')
    }
  }

  const updatePerson = (person) => {
    const personToUpdate = persons.find(p => p.name === person.name)
    const updatedPerson = { ...personToUpdate, number: newNumber }

    personService
      .update(personToUpdate.id, updatedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(p => p.id !== personToUpdate.id ? p : returnedPerson))
        setSuccessMessage(
          `Henkilön ${personToUpdate.name} numero päivitettiin`
        )
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
      .catch(error => {
        setErrorMessage(
          `Henkilö ${person.name} on jo poistettu luettelosta`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setPersons(persons.filter(p => p.id !== personToUpdate.id))
      })

    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h1>Puhelinluettelo</h1>
      <SuccessNotification message={successMessage} />
      <ErrorNotification message={errorMessage} />
      <Filter newNameFilter={newNameFilter} handleNewNameFilter={handleNewNameFilter} />
      <h2>Lisää uusi</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numerot</h2>
      <Persons
        persons={persons.filter(person => (person.name.toLowerCase().includes(newNameFilter.toLowerCase())))}
        deletePerson={deletePerson}
      />
    </div>
  )
}

export default App