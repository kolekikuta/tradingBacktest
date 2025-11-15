import { useEffect } from 'react'
import './App.css'
import HomePage from './components/HomePage/HomePage.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer/Footer.jsx'

function App() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <HomePage />
      <Footer />
    </>
  )
}

export default App
