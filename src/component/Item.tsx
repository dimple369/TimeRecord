import { animated, useSpring } from "@react-spring/web"
import { useGesture } from "@use-gesture/react"
import dayjs from "dayjs"

type ItemProps = {
  date: dayjs.Dayjs
  isWorkOverTime?: boolean
}

export const Item = ({ date, isWorkOverTime = false }: ItemProps) => {
  const [{ x }, set] = useSpring(() => ({ x: 0 }))

  const bind = useGesture({
    onDrag: ({ movement: [mx] }) => {
      console.log(mx)
      if (mx < -70) {
        set({ x: -70 })
      } else if (mx > 0) {
        set({ x: 0 })
      } else {
        set({ x: mx })
      }
    },
    onDragEnd: ({ movement: [mx], direction: [dx] }) => {
      let targetX = 0
      if (dx === -1 && mx <= -50 && mx >= -70) {
        targetX = -30
      } else if (dx === 1 || mx > -50) {
        targetX = 0
      }
      set({ x: targetX })
    },
  })

  return (
    <div className="relative flex overflow-hidden">
      <animated.div
        {...bind()}
        className={`${isWorkOverTime ? "text-red-500" : ""} py-4 text-sm grow`}
        style={{
          transform: x.to((x) => `translateX(${x}px)`),
        }}
      >
        {date.format("YYYY/MM/DD,HH:mm:ss")}
      </animated.div>

      <animated.div
        className="absolute right-0 w-[100px] h-full rounded-lg bg-red-500 text-white flex items-center justify-center"
        style={{
          transform: x.to((x) => `translateX(${x <= -30 ? 0 : 100}%)`),
          opacity: x.to((x) => (x <= -30 ? 1 : 0)),
          transition: "transform 0.2s ease-out, opacity 0.2s ease-out",
        }}
      >
        Delete
      </animated.div>
    </div>
  )
}
