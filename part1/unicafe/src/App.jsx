import { useState } from 'react'

const Statistics = ({good, neutral, bad}) => {
  
  const total = good + neutral + bad
  const average = (good - bad) / total
  const positive = good / total *100

  return (
    <table>
      <tbody>      
        <StatisticLine text="Good" value ={good}/>
        <StatisticLine text="Neutral" value ={neutral}/>
        <StatisticLine text="Bad" value ={bad}/>
        <StatisticLine text="Total" value ={total}/>
        <StatisticLine text="Average" value ={average}/>
        <StatisticLine text="Positive" value ={`${positive}%`}/>
      </tbody>
    </table>
  )
  
}


const Button = ({onClick, text}) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const addGood = () => {
    setGood(good + 1)
  }

  const addNeutral = () => {
    setNeutral(neutral + 1)
  }


  const addBad = () => {
    setBad(bad + 1)
  }


  return (
    <div>
      <h1>Give Feedback:</h1>
      <Button onClick={addGood} text={"Good"}/>
      <Button onClick={addNeutral} text={"Neutral"}/>
      <Button onClick={addBad} text={"Bad"}/>
      <h1>Statistics:</h1>
      {(good || neutral || bad)? <Statistics good={good} neutral={neutral} bad={bad} /> : <p>No feedback given</p>}
    </div>
  )
}

export default App