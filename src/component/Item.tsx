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
    // onDrag: track dragging movement
    onDrag: ({ movement: [mx] }) => {
      console.log(mx)
      if (mx < -70) set({ x: -70 }) // Prevent moving beyond -70px
      else if (mx > 0) set({ x: 0 }) // Prevent moving beyond 0px
      else set({ x: mx }) // Apply the current drag distance
    },
    // onDragEnd: handle logic when drag ends
    onDragEnd: ({ movement: [mx], direction: [dx] }) => {
      let targetX = 0

      // Show delete button if swiped left between -50px and -70px
      if (dx === -1 && mx <= -50 && mx >= -70) targetX = -30
      // Reset to original position if swiped right or less than -50px
      else if (dx === 1 || mx > -50) targetX = 0

      set({ x: targetX }) // Set the final position
    },
  })

  return (
    <div className="relative flex overflow-hidden">
      <animated.div
        {...bind()} // Attach drag gesture to the element
        className={`${isWorkOverTime ? "text-red-500" : ""} py-4 text-sm grow`}
        style={{
          touchAction: "none",
          transform: x.to((x) => `translateX(${x}px)`), // Apply horizontal translation
        }}
      >
        {date.format("YYYY/MM/DD,HH:mm:ss")} {/* Display the date */}
      </animated.div>

      {/* Delete button, only shows if swiped more than -30px */}
      <animated.div
        className="absolute right-0 w-[100px] h-full rounded-lg bg-red-500 text-white flex items-center justify-center"
        style={{
          transform: x.to((x) => `translateX(${x <= -30 ? 0 : 100}%)`), // Show button after -30px swipe
          opacity: x.to((x) => (x <= -30 ? 1 : 0)), // Fade in button after -30px swipe
          transition: "transform 0.2s ease-out, opacity 0.2s ease-out", // Smooth transition
        }}
      >
        Delete
      </animated.div>
    </div>
  )
}
