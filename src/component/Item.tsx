import { animated, useSpring } from "@react-spring/web"
import { useDrag } from "@use-gesture/react"
import dayjs from "dayjs"

type ItemProps = {
  date: dayjs.Dayjs
  isWorkOverTime?: boolean
}

export const Item = ({ date, isWorkOverTime = false }: ItemProps) => {
  const [{ x }, set] = useSpring(() => ({ x: 0 }))
  const bind = useDrag(
    ({ movement: [mx], direction: [dx] }) => {
      console.log(mx)
      if (dx === -1 && mx >= -90) {
        set({ x: mx })
      } else {
        set({ x: 0 })
      }
    },
    {
      axis: "x",
    }
  )
  return (
    <div className="relative flex">
      <animated.div
        {...bind()}
        className={`${isWorkOverTime ? "text-red-500" : ""}x py-4 text-sm grow`}
        style={{
          transform: x.to((x) => `translateX(${x}px)`), // 应用滑动效果
        }}
      >
        {date.format("YYYY/MM/DD,HH:mm:ss")}
      </animated.div>

      <animated.div
        className="absolute left-full w-[100px] h-full rounded-lg"
        style={{
          transform: x.to((x) => `translateX(${x}%)`),
        }}
      >
        Delete
      </animated.div>
    </div>
  )
}
