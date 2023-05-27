import { useState } from "react"
import "./App.css"

function App() {
  const [times, setTimes] = useState<string[]>(() => {
    const data = localStorage.getItem("date")
    return data ? data.split(",") : []
  })

  function handleRecordClick() {
    const date = new Date()
    const timeString = date.toLocaleString()
    setTimes([timeString, ...times])
    localStorage.setItem("date", [timeString, ...times].toString())
  }
  function handleDeleteClick(index: number) {
    const newTimes = [...times]
    newTimes.splice(index, 1)
    setTimes(newTimes)
    localStorage.setItem("date", newTimes.toString())
  }

  return (
    <>
      <div className="center-button">
        <button className="record-button" onClick={handleRecordClick}>
          Record Time
        </button>
      </div>
      <div className="time-list">
        {times.map((time, index) => (
          <div key={index}>
            <div>{time}</div>
            <button onClick={() => handleDeleteClick(index)}>Delete</button>
          </div>
        ))}
      </div>
    </>
  )
}

export default App
