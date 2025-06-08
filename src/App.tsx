import { useState } from "react"
import "./App.css"
import { Item } from "./component/Item"
import dayjs from "dayjs"

type TimeRecord = {
  id: string
  time: string
}

function App() {
  const [times, setTimes] = useState<TimeRecord[]>(() => {
    const data = localStorage.getItem("date")
    return data ? JSON.parse(data) : []
  })

  function handleRecordClick() {
    const date = new Date()
    const timeString = date.toLocaleString()
    const newRecord = { id: `${Date.now()}-${Math.random()}`, time: timeString }
    const newTimes = [newRecord, ...times]
    setTimes(newTimes)
    localStorage.setItem("date", JSON.stringify(newTimes))
  }
  function handleDeleteClick(index: number) {
    const newTimes = [...times]
    newTimes.splice(index, 1)
    setTimes(newTimes)
    localStorage.setItem("date", JSON.stringify(newTimes))
  }

  return (
    <>
      <div className="header-title">打卡时间记录</div>
      <button className="record-button" onClick={handleRecordClick}>
        Record Time
      </button>
      <div className="min-h-screen flex justify-center items-start p-4 bg-transparent">
        <div className="w-full max-w-md bg-white/80 rounded-2xl shadow-lg pb-4">
          {times.length === 0 && (
            <div className="text-center text-gray-400 py-8">暂无打卡记录</div>
          )}
          {times.map((item, index) => (
            <Item
              key={item.id}
              date={dayjs(item.time)}
              onDelete={() => handleDeleteClick(index)}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default App
