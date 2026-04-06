import { useState, useMemo } from "react"
import "./App.css"
import { Item } from "./component/Item"
import dayjs from "dayjs"

type TimeRecord = {
  id: string
  time: string
}

function defaultFilterStart() {
  return dayjs().subtract(1, "month").date(21).startOf("day")
}
function defaultFilterEnd() {
  return dayjs().date(20).startOf("day")
}

function roundToQuarterForStart(d: dayjs.Dayjs): dayjs.Dayjs {
  const min = d.minute()
  if (min % 15 === 0) return d.second(0).millisecond(0)
  const nextQ = (Math.floor(min / 15) + 1) * 15
  if (nextQ >= 60) return d.add(1, "hour").minute(0).second(0).millisecond(0)
  return d.minute(nextQ).second(0).millisecond(0)
}
function roundToQuarterForEnd(d: dayjs.Dayjs): dayjs.Dayjs {
  return d
    .minute(Math.floor(d.minute() / 15) * 15)
    .second(0)
    .millisecond(0)
}

function calcOvertimeStats(
  times: TimeRecord[],
  rangeStart: dayjs.Dayjs,
  rangeEnd: dayjs.Dayjs,
) {
  const inRange = times
    .map((r) => dayjs(r.time))
    .filter(
      (d) =>
        d.isValid() &&
        !d.isBefore(rangeStart.startOf("day")) &&
        !d.isAfter(rangeEnd.endOf("day")),
    )
    .sort((a, b) => a.valueOf() - b.valueOf())

  const byDay: Record<string, dayjs.Dayjs[]> = {}
  for (const d of inRange) {
    const key = d.format("YYYY-MM-DD")
    if (!byDay[key]) byDay[key] = []
    byDay[key].push(d)
  }

  let workdayTotal = 0
  let weekendTotal = 0

  for (const dayRecords of Object.values(byDay)) {
    if (dayRecords.length < 2) continue
    const startRec = dayRecords[0]
    const endRec = dayRecords[dayRecords.length - 1]
    const dow = startRec.day() // 0=Sun, 6=Sat
    const isWeekend = dow === 0 || dow === 6

    if (isWeekend) {
      const duration = endRec.diff(startRec, "second")
      if (duration < 3600) continue
      weekendTotal += Math.floor(duration / 3600)
    } else {
      const fixedStart = roundToQuarterForStart(startRec)
      const fixedEnd = roundToQuarterForEnd(endRec)
      let duration = fixedEnd.diff(fixedStart, "second")
      if (duration < 36000) continue // 不满10小时不算加班
      duration -= 32400 // 扣除9小时正常工时
      if (endRec.hour() >= 20) duration -= 1800 // 扣0.5小时加班餐
      if (duration < 3600) continue
      workdayTotal += Math.floor(duration / 1800) / 2
    }
  }

  return {
    workday: workdayTotal.toFixed(1),
    weekend: weekendTotal.toFixed(1),
  }
}

function App() {
  const [times, setTimes] = useState<TimeRecord[]>(() => {
    const data = localStorage.getItem("date")
    return data ? JSON.parse(data) : []
  })
  const [showFilter, setShowFilter] = useState(false)
  const [isFiltering, setIsFiltering] = useState(false)
  const [filterStart, setFilterStart] = useState(defaultFilterStart)
  const [filterEnd, setFilterEnd] = useState(defaultFilterEnd)

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

  const displayItems = useMemo(() => {
    if (!isFiltering) return times.map((r, i) => ({ r, i }))
    const start = filterStart.startOf("day")
    const end = filterEnd.endOf("day")
    return times
      .map((r, i) => ({ r, i }))
      .filter(({ r }) => {
        const d = dayjs(r.time)
        return d.isValid() && !d.isBefore(start) && !d.isAfter(end)
      })
  }, [times, isFiltering, filterStart, filterEnd])

  const overtimeStats = useMemo(
    () => calcOvertimeStats(times, filterStart, filterEnd),
    [times, filterStart, filterEnd],
  )

  return (
    <>
      <div className="header-title flex items-center justify-between px-4">
        <span>打卡时间记录</span>
        <div className="flex gap-2">
          <button
            className="text-sm px-3 py-1 rounded-full border border-white/60 text-white"
            onClick={() => setShowFilter((v) => !v)}
          >
            筛选
          </button>
          <button className="record-button" onClick={handleRecordClick}>
            Record Time
          </button>
        </div>
      </div>

      {showFilter && (
        <div className="bg-white shadow-sm px-4 py-3 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <label className="w-16 text-gray-500">开始日</label>
            <input
              type="date"
              className="border rounded px-2 py-1"
              value={filterStart.format("YYYY-MM-DD")}
              onChange={(e) => setFilterStart(dayjs(e.target.value))}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-16 text-gray-500">结束日</label>
            <input
              type="date"
              className="border rounded px-2 py-1"
              value={filterEnd.format("YYYY-MM-DD")}
              onChange={(e) => setFilterEnd(dayjs(e.target.value))}
            />
          </div>
          <div className="flex gap-4">
            <button
              className="text-blue-500"
              onClick={() => setIsFiltering(true)}
            >
              应用筛选
            </button>
            <button
              className="text-gray-400"
              onClick={() => setIsFiltering(false)}
            >
              清空筛选
            </button>
          </div>
          <div className="pt-2 border-t text-gray-600 space-y-0.5">
            <div className="font-semibold">本周期加班统计：</div>
            <div className="text-xs">
              工作日加班总时长：{overtimeStats.workday} 小时
            </div>
            <div className="text-xs">
              周末加班总时长：{overtimeStats.weekend} 小时
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen flex justify-center items-start p-4 bg-transparent">
        <div className="w-full max-w-md bg-white/80 rounded-2xl shadow-lg pb-4">
          {displayItems.length === 0 && (
            <div className="text-center text-gray-400 py-8">暂无打卡记录</div>
          )}
          {displayItems.map(({ r, i }) => (
            <Item
              key={r.id}
              date={dayjs(r.time)}
              onDelete={() => handleDeleteClick(i)}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default App
