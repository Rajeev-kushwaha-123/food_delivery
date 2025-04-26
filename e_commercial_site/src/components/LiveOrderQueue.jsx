import { useState, useEffect } from 'react'
import { Box, Card, CardContent, Typography, Button, Select, MenuItem, FormControl, InputLabel, Alert, Chip, Divider, TextField, Grid } from '@mui/material'
import './LiveOrderQueue.css'

const LiveOrderQueue = ({ orders, staff, products, onStatusUpdate }) => {
  const [assignedStaff, setAssignedStaff] = useState({})
  const [currentUser, setCurrentUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('timestamp')
  const [sortOrder, setSortOrder] = useState('desc')

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
    let filtered = [...orders]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'timestamp') {
        return sortOrder === 'desc' 
          ? new Date(b.timestamp) - new Date(a.timestamp)
          : new Date(a.timestamp) - new Date(b.timestamp)
      } else if (sortBy === 'status') {
        return sortOrder === 'desc'
          ? b.status.localeCompare(a.status)
          : a.status.localeCompare(b.status)
      }
      return 0
    })

    return filtered
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order placed':
        return 'warning'
      case 'WIP':
        return 'info'
      case 'Ready for consolidation':
        return 'success'
      case 'Order complete':
        return 'default'
      default:
        return 'default'
    }
  }

  const filteredOrders = getFilteredOrders()

  return (
    <Box className="queue-container">
      <Typography variant="h4" gutterBottom>
        Live Order Queue
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Search Orders"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order number or item name"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="timestamp">Time</MenuItem>
              <MenuItem value="status">Status</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Order</InputLabel>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              label="Order"
            >
              <MenuItem value="desc">Newest First</MenuItem>
              <MenuItem value="asc">Oldest First</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {filteredOrders.length === 0 ? (
        <Alert severity="info">
          No orders available
        </Alert>
      ) : (
        filteredOrders.map(order => (
          <Card key={order.id} className="order-card">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Order #{order.orderNumber}
                </Typography>
                <Chip 
                  label={order.status} 
                  color={getStatusColor(order.status)}
                  size="small"
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Placed at: {new Date(order.timestamp).toLocaleString()}
              </Typography>

              <Divider sx={{ my: 2 }} />
              
              {order.items.map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1">
                      {item.name} x {item.quantity}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                  {order.status === 'Order placed' && currentUser && currentUser.groups.includes(item.group) && (
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

              {order.status === 'WIP' && currentUser && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onStatusUpdate(order.id, 'Ready for consolidation')}
                  sx={{ mt: 2 }}
                  fullWidth
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