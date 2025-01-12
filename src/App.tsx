import { useState } from "react"
import "./App.css"
import { Item } from "./component/Item"
import dayjs from "dayjs"

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
      <button className="record-button" onClick={handleRecordClick}>
        Record Time
      </button>

      <div className="min-h-screen bg-gray-100 flex justify-center items-start p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md">
          {times.map((time, index) => (
            <Item key={dayjs(time).toISOString()} date={dayjs(time)}></Item>
          ))}
        </div>
      </div>
    </>
  )
}

export default App
