import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'
import Topbar from './components/Topbar'
import Sidebar from './components/sidebar'
import Bottombar from './components/Bottombar'
import Dashboard from './components/Dashboard'
import LiveOrderQueue from './components/LiveOrderQueue'
import ConsolidationStation from './components/ConsolidationStation'
import Auth from './components/Auth'

function App() {
  const [orders, setOrders] = useState([])
  const [staff, setStaff] = useState([])
  const [products, setProducts] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem('currentUser')
    if (user) {
      setIsAuthenticated(true)
    }

    // Initialize staff data
    setStaff([
      { id: 1, name: 'Chandler', groups: ['Veg Pizza', 'Burger'] },
      { id: 2, name: 'Joey', groups: ['Veg Pizza', 'NV Pizza', 'Sandwich', 'Burger'] },
      { id: 3, name: 'Rachel', groups: ['NV Pizza'] },
      { id: 4, name: 'Monica', groups: ['Sandwich'] },
      { id: 5, name: 'Ross', groups: ['Drinks'] }
    ])

    // Initialize products data
    setProducts([
      { id: 1, code: 'VP001', name: 'Veg Pizza', group: 'Veg Pizza', price: 10 },
      { id: 2, code: 'NVP001', name: 'Non-Veg Pizza', group: 'NV Pizza', price: 12 },
      { id: 3, code: 'SW001', name: 'Sandwich', group: 'Sandwich', price: 8 },
      { id: 4, code: 'BG001', name: 'Burger', group: 'Burger', price: 9 },
      { id: 5, code: 'DR001', name: 'Drinks', group: 'Drinks', price: 3 }
    ])
  }, [])

  const handleNewOrder = (order) => {
    setOrders(prevOrders => [...prevOrders, order])
  }

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    )
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    setIsAuthenticated(false)
  }

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/auth" replace />
    }
    return children
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth setIsAuthenticated={setIsAuthenticated} />} />
        {isAuthenticated ? (
          <Route path="/dashboard/*" element={
            <div className="app">
              <Topbar onLogout={handleLogout} />
              <div className="container">
                <Sidebar />
                <Routes>
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Dashboard 
                        orders={orders}
                        staff={staff}
                        products={products}
                        onNewOrder={handleNewOrder}
                      />
                    </ProtectedRoute>
                  } />
                  <Route path="/queue" element={
                    <ProtectedRoute>
                      <LiveOrderQueue 
                        orders={orders}
                        staff={staff}
                        products={products}
                        onStatusUpdate={updateOrderStatus}
                      />
                    </ProtectedRoute>
                  } />
                  <Route path="/consolidation" element={
                    <ProtectedRoute>
                      <ConsolidationStation 
                        orders={orders}
                        onStatusUpdate={updateOrderStatus}
                      />
                    </ProtectedRoute>
                  } />
                </Routes>
              </div>
              <Bottombar />
            </div>
          } />
        ) : null}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App 