import './App.css';
import NavBar from "./Components/NavBar"
import Footer from "./Components/Footer"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { Provider } from 'react-redux';
import { store } from './store/store';
import AuthInitializer from './Components/AuthInitializer';
import Home from "./pages/Home"
import About from "./pages/About"
import Services from "./pages/Services"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Booking from "./pages/Booking"
import Dashboard from "./pages/Dashboard"
import AdminDashboard from "./pages/AdminDashboard"
import Profile from "./pages/Profile"
import Support from "./pages/Support"
import ProviderProfile from "./pages/ProviderProfile"

function App() {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <Router>
          <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-grow pt-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/support" element={<Support />} />
                <Route path="/provider/:id" element={<ProviderProfile />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthInitializer>
    </Provider>
  );
}

export default App;
