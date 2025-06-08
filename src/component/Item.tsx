import { animated, useSpring } from "@react-spring/web"
import { useGesture } from "@use-gesture/react"
import dayjs from "dayjs"
import { useRef } from "react"

type ItemProps = {
  date: dayjs.Dayjs
  isWorkOverTime?: boolean
  onDelete?: () => void
}

export const Item = ({ date, isWorkOverTime = false, onDelete }: ItemProps) => {
  const [{ x }, set] = useSpring(() => ({ x: 0 }))
  const isDeleteVisible = useRef(false)

  const bind = useGesture({
    onDrag: ({ movement: [mx], last }) => {
      if (last) {
        // 松手时判断是否需要保持Delete按钮
        if (mx <= -30) {
          set({ x: -70 })
          isDeleteVisible.current = true
        } else {
          set({ x: 0 })
          isDeleteVisible.current = false
        }
      } else {
        // 拖动中
        if (mx < -70) set({ x: -70 })
        else if (mx > 0) set({ x: 0 })
        else set({ x: mx })
      }
    },
  })

  // 点击Delete后回弹
  function handleDelete() {
    if (onDelete) onDelete()
    set({ x: 0 })
    isDeleteVisible.current = false
  }

  return (
    <div className="relative flex overflow-hidden">
      <animated.div
        {...bind()}
        className={`time-card ${isWorkOverTime ? "text-red-500" : ""} grow`}
        style={{
          touchAction: "none",
          transform: x.to((x) => `translateX(${x}px)`),
        }}
      >
        {date.format("YYYY/MM/DD,HH:mm:ss")}
      </animated.div>
      <animated.div
        className="delete-btn absolute right-0 flex items-center justify-center"
        style={{
          transform: x.to((x) => `translateX(${x <= -30 ? 0 : 100}%)`),
          opacity: x.to((x) => (x <= -30 ? 1 : 0)),
          transition: "transform 0.2s ease-out, opacity 0.2s ease-out",
        }}
        onClick={handleDelete}
      >
        <svg
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          className="mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        Delete
      </animated.div>
    </div>
  )
}
