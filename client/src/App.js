import './App.css';
import NavBar from "./Components/NavBar"
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import homeImage from "./assets/1.jpeg"

function App() {
  return (
    <>
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<div className="home" style={{backgroundImage: `url(${homeImage})`}}>Home Page</div>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
