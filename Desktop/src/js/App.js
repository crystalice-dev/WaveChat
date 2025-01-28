import React, {useState} from "react";


const App=()=>{
    const [name, setName] = useState('name')
    return(
        <div>
            <h1>{name}</h1>
            <button onClick={()=>setName('WaveChat')} >click me</button>
        </div>
    )
}

export default App;