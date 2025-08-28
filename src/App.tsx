import { Toaster } from "./components/ui/toaster"
import './App.css'
import { Content } from "./components/Content"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Login } from "./components/Login"
import { Presentation } from "./components/Page"


function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/lesson" element={<Content />} />
          <Route path="/Presentation" element={<Presentation />} />
        </Routes >
      </BrowserRouter >
    </>
  )
}

export default App