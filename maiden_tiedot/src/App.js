import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Countries = ({ countries, setCountryFilter, weather, setWeather }) => {

  if (countries.length === 0) {
    return (
      <div>
      </div>
    )
  }

  if (countries.length > 10) {
    return (
      <div>
        <p>Too many matches, specify another filter</p>
      </div>
    )
  }

  if (countries.length > 1) {
    return (
      countries.map(country =>
        <div>
          <Country key={country.name} country={country} />
          <button key={country.numericCode} onClick={() => setCountryFilter(country.name)}>show</button>
        </div>
      )
    )
  }

  if (countries.length === 1) {

    return (
      <FullCountry country={countries[0]} />
    )
  }
}

const Country = ({ country }) => <p key={country.name}>{country.name}</p>

const FullCountry = ({ country, weather, setWeather }) => {

  return (
    <div>
      <h1>{country.name}</h1>
      <p>Capital: {country.capital}</p>
      <p>Population: {country.population}</p>
      <h2>Languages</h2>
      <Languages country={country} />
      <Flag country={country} />
      <Weather country={country} />
    </div>
  )
}

const Weather = ({ country }) => {

  const [weather, setWeather] = useState()

  useEffect(() => {

    const eventHandler = response => {
      setWeather(response.data)
    }

    const promise = axios.get(`http://api.apixu.com/v1/current.json?key=074568f4497f417587f191826191505&q=${country.capital}`)
    promise.then(eventHandler)
  }, [])


  if (weather === undefined) {
    return (
      <p>Fetching weather data...</p>
    )
  } else {
    return (
      <div>
        <h2>Weather in {country.capital}</h2>
        <p>Temperature: {weather.current.temp_c} &deg;C</p>
        <img src={weather.current.condition.icon} />
        <p>Wind: {weather.current.wind_kph} direction {weather.current.wind_dir}</p>
      </div>
    )
  }
}

const Languages = ({ country }) =>
  <ul>
    {country.languages.map(language => <li key={language.iso639_1}>{language.name}</li>)}
  </ul>

const Flag = ({ country }) => <img src={country.flag} alt={country.name} height="80em" width="auto" />

const Filter = ({ handleCountryFilter, countryFilter }) => {

  return (
    <div>
      <input
        value={countryFilter}
        onChange={handleCountryFilter}
      />
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [countryFilter, setCountryFilter] = useState('')

  const handleCountryFilter = (event) => {
    setCountryFilter(event.target.value)
  }

  useEffect(() => { 
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
      })
  }, [])

  return (
    <div>
      <h1>Search countries</h1>
      <Filter countryFilter={countryFilter} handleCountryFilter={handleCountryFilter} />
      <Countries countries={countries.filter(country => (country.name.toLowerCase().includes(countryFilter.toLowerCase())))} setCountryFilter={setCountryFilter} />
    </div>
  )
}

export default App