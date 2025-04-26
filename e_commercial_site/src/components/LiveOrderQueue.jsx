import { useState, useEffect } from 'react'
import { Box, Card, CardContent, Typography, Button, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material'
import './LiveOrderQueue.css'

const LiveOrderQueue = ({ orders, staff, products, onStatusUpdate }) => {
  const [assignedStaff, setAssignedStaff] = useState({})
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
  }, [])

  const handleStaffAssignment = (orderId, staffId) => {
    setAssignedStaff(prev => ({
      ...prev,
      [orderId]: staffId
    }))
    onStatusUpdate(orderId, 'WIP')
  }

  const getAvailableStaff = (productGroup) => {
    return staff.filter(member => 
      member.groups.includes(productGroup) && 
      !Object.values(assignedStaff).includes(member.id)
    )
  }

  const getFilteredOrders = () => {
    if (!currentUser) return []
    
    return orders.filter(order => 
      order.items.some(item => 
        currentUser.groups.includes(item.group)
      )
    )
  }

  if (!currentUser) {
    return (
      <Box className="queue-container">
        <Alert severity="error">
          Please log in to view orders
        </Alert>
      </Box>
    )
  }

  const filteredOrders = getFilteredOrders()

  return (
    <Box className="queue-container">
      <Typography variant="h4" gutterBottom>
        Live Order Queue
      </Typography>

      {filteredOrders.length === 0 ? (
        <Alert severity="info">
          No orders available for your assigned groups
        </Alert>
      ) : (
        filteredOrders.map(order => (
          <Card key={order.id} className="order-card">
            <CardContent>
              <Typography variant="h6">
                Order #{order.orderNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Status: {order.status}
              </Typography>
              
              {order.items
                .filter(item => currentUser.groups.includes(item.group))
                .map((item, index) => (
                  <Box key={index} sx={{ mt: 2 }}>
                    <Typography variant="subtitle1">
                      {item.name} x {item.quantity}
                    </Typography>
                    {order.status === 'Order placed' && (
                      <FormControl fullWidth sx={{ mt: 1 }}>
                        <InputLabel>Assign Staff</InputLabel>
                        <Select
                          value={assignedStaff[order.id] || ''}
                          onChange={(e) => handleStaffAssignment(order.id, e.target.value)}
                          label="Assign Staff"
                        >
                          {getAvailableStaff(item.group).map(staffMember => (
                            <MenuItem key={staffMember.id} value={staffMember.id}>
                              {staffMember.name} ({item.group})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </Box>
                ))}

              {order.status === 'WIP' && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onStatusUpdate(order.id, 'Ready for consolidation')}
                  sx={{ mt: 2 }}
                >
                  Mark as Ready
                </Button>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  )
}

export default LiveOrderQueue