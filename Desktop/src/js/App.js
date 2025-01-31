import React, {useState} from "react";

import SplashView from "./Views/SplashView";
import TopBar from "./TopBar";

import { splashStyle } from "../styles/SplashStyle";

const App=()=>{
    const handleMaximize = () => {
        window.electron.maximizeWindow();  // IPC call to toggle maximize
    };
    return(
       <div >
            <TopBar/>
            <SplashView/>
       </div>
    )
}

export default App;