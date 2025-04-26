import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'
import Topbar from './components/Topbar'
import Sidebar from './components/sidebar'
import Bottombar from './components/Bottombar'
import Dashboard from './components/Dashboard'
import LiveOrderQueue from './components/LiveOrderQueue'
import ConsolidationStation from './components/ConsolidationStation'

function App() {
  const [orders, setOrders] = useState([])
  const [staff, setStaff] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
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

  return (
    <Router>
      <div className="app">
        <Topbar />
        <div className="container">
          <Sidebar />
          <Routes>
            <Route path="/" element={
              <Dashboard 
                orders={orders}
                staff={staff}
                products={products}
                onNewOrder={handleNewOrder}
              />
            } />
            <Route path="/queue" element={
              <LiveOrderQueue 
                orders={orders}
                staff={staff}
                products={products}
                onStatusUpdate={updateOrderStatus}
              />
            } />
            <Route path="/consolidation" element={
              <ConsolidationStation 
                orders={orders}
                onStatusUpdate={updateOrderStatus}
              />
            } />
          </Routes>
        </div>
        <Bottombar />
      </div>
    </Router>
  )
}

export default App 