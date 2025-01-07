import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <div className="w-screen h-screen mt-28 flex items-center justify-center">
     <h1 className="text-9xl font-bold underline text-red-500">
      Hello world!
    </h1>
     </div>
    </>
  )
}

export default App
