import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { MarketplaceProvider } from './context/MarketplaceContext'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { Footer, Navbar } from './components/Shared'
import { Contact, Finance, Home, Inventory, SellCar, VehicleDetail } from './pages/Pages'

function RouteMotion() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  return (
    <AnimatePresence mode="wait">
      <motion.main key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/inventory/:id" element={<VehicleDetail />} />
          <Route path="/sell" element={<SellCar />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  )
}

function AppContent() {
  const { theme } = useTheme()

  return (
    <div className="app-theme" data-theme={theme}>
      <Navbar />
      <RouteMotion />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <MarketplaceProvider>
        <AppContent />
      </MarketplaceProvider>
    </ThemeProvider>
  )
}

export default App
