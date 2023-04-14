import React from 'react'
import './App.css'
import Dice from './Dice'

function App() {
  const random = () => Math.floor(Math.random() * 6) + 1
  const [mode, setMode] = React.useState("practice")
  const [firstRecord, setFirstRecord] = React.useState(false)
  const [record, setRecord] = React.useState(localStorage.getItem("record"))
  const [ms, setMs] = React.useState(0)
  const [done, setDone] = React.useState(false)
  const [on, setOn] = React.useState(false)
  const [game, setGame] = React.useState("not started")
  const [nums, setNums] = React.useState(initialState())
  const [tracker, setTracker] = React.useState([])
  const [animateRoll, setAnimateRoll] = React.useState(false)
  const time = `${Math.floor(ms / 100)}:${(ms % 100).toString().padStart(2, '0')}`
  const timeNum = +[...time].filter(a => a !== ":").join('')
  const green = "linear-gradient(90deg, rgba(106,255,206,1) 0%, rgba(41,184,77,1) 44%)"
  const red = "linear-gradient(90deg, rgba(255,106,106,1) 0%, rgba(184,41,41,1) 44%)"

  React.useEffect(() => {
    localStorage.setItem("record", record ? record : "none")
    setRecord(localStorage.getItem("record"))
  }, [])

  React.useEffect(() => {
    let interval = setInterval(() => {
      if (!done && on) {
        setMs(prev => prev += 1)
      }
    }, 10)
    return () => clearInterval(interval);
  }, [done, on])

  // this effect is only responsible for stopping the timer
  React.useEffect(() => {
    if (ms >= 3000) {
      setGame("lost")
      setDone(true)
      setOn(false)
      for (const num in nums) {
        nums[num].lost = "true"
      }
    }
  }, [ms])

  function initialState() {
    let nums = {}
    for (let i = 1; i <= 10; i++) {
      nums[`num${i}`] = { val: random(), on: false, lost: false }
    }
    return nums
  }

  function handleChange(event) {
    if (mode === "play" && on === false) {
      setOn(true)
    }
    let n = event.target.id
    setGame("in progress")
    setTracker(prev => {
      return nums[n].on ? [...prev] : [...prev, event.target.innerText]
    }) // adding selected numbers to tracker
    setNums(prev => ({
      ...prev, [n]: { ...prev[n], val: event.target.innerText, on: true }
    })) // save current value and switch "on" to "true" to change color
    if (event.target.innerText !== tracker[0] && tracker.length > 0) { // if a different number is picked, the game is lost
      setGame("lost")
      setDone(true)
      setNums(prev => ({
        ...prev, [n]: { ...prev[n], lost: true }
      }))
    }
    if (tracker.length === 9 && event.target.innerText === tracker[0] && !nums[n].on) { // if you make it to this point, the game is won
      setGame("won")
      setDone(true)
      if (mode === "play" && record === "none") {
        localStorage.setItem("record", timeNum)
        setRecord(timeNum)
        setFirstRecord(true)
      }
    }
  }

  function play() { // updating nums
    setAnimateRoll(true)
    setNums(prev => {
      const newObj = { ...prev }
      Object.entries(prev).forEach(([k, v]) => {
        newObj[k] = { ...v, val: v.on ? v.val : random() }
      })
      return newObj
    })
  }

  function resetState() {
    setNums(prev => game === "won" || game === "lost" || game === "in progress" ? initialState() : prev)
    setGame("not started")
    setTracker([])
    setDone(false)
    setOn(false)
    setMs(0)
    setFirstRecord(false)
    if (mode === "play" && game === "won" && timeNum < record) {
      localStorage.setItem("record", timeNum)
      setRecord(timeNum)
    }
  }

  function toggleAnimation(index) {
    const winAnimation = index % 2 === 0 ? 'winAnimation1' : 'winAnimation2'
    const rolledVersion = index % 2 === 0 ? 'rollAnimation1' : 'rollAnimation2'
    let rolled = !nums[`num${index + 1}`].on && animateRoll ? rolledVersion : ''
    return `die ${game === 'won' ? winAnimation : ''} ${rolled}`
  }

  function toNum(n) {
    let arr = [..."" + n]
    arr.length === 4 ? arr.splice(2, 0, ":") : arr.splice(1, 0, ":")
    return Number(arr[0]) ? arr.join('') : n
  }

  return (
    <div className="container">
      <section className="mode">
        <div style={{ opacity: mode === "practice" ? 1 : 0.5 }} onClick={() => { setMode("practice"); resetState() }}>Practice</div>
        <div style={{ opacity: mode === "practice" ? 0.5 : 1 }} onClick={() => { setMode("play"); resetState() }}>Play</div>
      </section>
      {game === "lost" && <div className="cover"></div>}
      <section className="dice">
        {Object.entries(nums).map((num, i) => (
          <div key={i} style={nums[num[0]].lost ? { background: red } : nums[num[0]].on ? { background: green } : { backgroundColor: "white" }} className={toggleAnimation(i)} id={`${num[0]}`} onClick={handleChange} onAnimationEnd={() => setAnimateRoll(false)}>
            <span className="num">{num[1].val}</span>
            <Dice n={num[1].val} />
          </div>
        ))}
      </section>
      <section style={{ opacity: mode === "play" ? 1 : 0 }} className="time">{time}</section>
      {(game === "in progress" || game === "not started") && <button onClick={play}>Roll</button>}
      {(game === "lost" || game === "won") && <button onClick={resetState}>Reset</button>}
      <section className="record">
        <div style={{ opacity: mode === "play" ? 1 : 0.5 }}>Current record: {toNum(record)}</div>
        <div style={{ opacity: game === "won" && mode === "play" && timeNum < record ? 1 : 0.5 }}>New record: {(game === "won" && mode === "play" && timeNum < record) || (game === "won" && mode === "play" && firstRecord) ? time : "----"}</div>
      </section>
    </div>
  )
}

export default App;
