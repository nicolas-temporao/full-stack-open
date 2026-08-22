import { useState } from 'react'

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const Button = ({onClick, text}) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const selectRandom = () => {
    setSelected(getRandomInt(anecdotes.length))
  }
  
  const handleVote = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  const getMost = () => {
    const maxVotes = Math.max(...votes)
    const index = votes.indexOf(maxVotes)
    return index
  }

  const mostVotedIndex = getMost()

  return (
    <div>
      <h1> Anecdote of the Day</h1>
      <p>{anecdotes[selected]} <br/> This anecdote has {votes[selected]} vote(s)</p>
      <Button onClick={handleVote} text="vote"/>
      <Button onClick={selectRandom} text="next anecdote"/>
      <h1>Anecdote with most votes:</h1>
      <p>{anecdotes[mostVotedIndex]} <br/> with {votes[mostVotedIndex]} vote(s)</p>

    </div>
  )
}

export default App