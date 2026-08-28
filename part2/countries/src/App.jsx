import { useState, useEffect } from 'react'
import countrySearch from './services/countrySearch'


  const Filter = ({value, onChange}) => {
    return (
      <div>
        filter countries <input value={value} onChange={onChange}/>
      </div>
    )
  }

  const PreviewButton = ({ onClick }) => {
    return <button onClick={onClick}>show</button>
  } 


  const Country = ({ country }) => {
    const [weather, setWeather] = useState(null)

    useEffect(() => {
      countrySearch
        .getWeather(country.capital[0])
        .then(response => {
          setWeather(response.data)
        })
    }, [country])

  return (
    <div>
      <h2>{country.name.common}</h2>

      <p>
        Capital: {country.capital[0]}
        <br />
        Area: {country.area}
      </p>

      <h2>Languages</h2>

      <ul>
        {Object.values(country.languages).map(language =>
          <li key={language}>{language}</li>
        )}
      </ul>

      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
      />

      {weather && (
        <div>
          <h2>Weather in {country.capital[0]}</h2>
          <p>Temperature: {weather.main.temp} Celsius</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  )
}

  const CountryPreview = ({countries, searchTerm, selectedCountry, setSelectedCountry}) => {
    const countriesToShow = countries.filter(country => country.name.common.toLowerCase().includes(searchTerm.toLowerCase()))


    if (selectedCountry) {
      return <Country country={selectedCountry} />
    }

    if (countriesToShow.length > 10) {
      return <div>Too many matches, specify another filter</div>
    }

    if (countriesToShow.length === 1) {
      return  <Country country={countriesToShow[0]} />
    }

    return (
      <div>
        {countriesToShow.map(country =>
          <div key={country.cca3}>
            {country.name.common} <PreviewButton onClick={() => setSelectedCountry(country)}/>
          </div>
        )}
      </div>
    )
  }

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [countries, setCountries] = useState([])

  useEffect(() => {
    countrySearch
      .getAll()
      .then(response => {
        setCountries(response.data)
      })
  }, [])



  return (
    <div>
        <Filter 
          value={searchTerm} 
          onChange={(event)=> {
            setSearchTerm(event.target.value)
            setSelectedCountry(null)
          }}
        />
        <CountryPreview 
          countries={countries}
          searchTerm={searchTerm}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
        /> 
    </div>

  )
}

export default App
