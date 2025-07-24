import React, { useRef, useState } from 'react'
function Ref() {
    // const [count, setCount]=useState(0)
    const countRef = useRef(0);
    const displayRef = useRef();
    console.log("hiii");
    function increment(){
        countRef.current += 1;
        displayRef.current.innerText= `Count : ${countRef.current}`
    }
  return (
    <div>

        {/* Counter using useRef (without re-rendering) */}
        <h1 ref={displayRef}>Count : {countRef.current}</h1>
        <button onClick={increment} >Increment</button>

        {/* Counter using useState */}
        {/* <h1>Count: {count}</h1>
        <button onClick={()=>setCount(count+1)}>Click</button> */}
    </div>
  )
}

export default Ref
