import Nav from "./components/_nav"
import Footer from "./components/_footer"
import { Routes, Route } from 'react-router-dom'
import Home from "./pages/home"
import About from "./pages/about"
import Projects from "./pages/projects"


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </>
  )
}

export default App