import React from 'react'

function Dice(props) {
    const dice = [
      [<div key="a" className="dot center middle"></div>],
      
      [<div key="a" className="dot top right"></div>,
       <div key="b" className="dot bottom left"></div>],
      
      [<div key="a" className="dot top right"></div>,
       <div key="b" className="dot center middle"></div>,
       <div key="c" className="dot bottom left"></div>],
      
      [<div key="a" className="dot top right"></div>,
       <div key="b" className="dot top left"></div>,
       <div key="c" className="dot bottom right"></div>,
       <div key="d" className="dot bottom left"></div>],
      
      [<div key="a" className="dot top right"></div>,
       <div key="b" className="dot top left"></div>,
       <div key="c" className="dot center middle"></div>,
       <div key="d" className="dot bottom right"></div>,
       <div key="e" className="dot bottom left"></div>],
      
      [<div key="a" className="dot top right"></div>,
       <div key="b" className="dot top left"></div>,
       <div key="c" className="dot center right"></div>,
       <div key="d" className="dot bottom right"></div>,
       <div key="e" className="dot center left"></div>,
       <div key="f" className="dot bottom left"></div>],
    ]
    
    return (
    <>{dice[props.n - 1]}</>
    )
  }

export default Dice