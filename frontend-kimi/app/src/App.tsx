import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import { CustodyProvider } from './state/CustodyContext'

export default function App() {
  return (
    <CustodyProvider>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </CustodyProvider>
  )
}
