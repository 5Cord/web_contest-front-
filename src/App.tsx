import { Toaster } from "./components/ui/toaster"
import './App.css'
import { Content } from "./components/Content"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Login } from "./components/Login"


function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/lesson" element={<Content />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App