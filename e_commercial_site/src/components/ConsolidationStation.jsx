import { Box, Card, CardContent, Typography, Button, List, ListItem, ListItemText, Chip, Divider, TextField, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import './ConsolidationStation.css'
import { useState } from 'react'

const ConsolidationStation = ({ orders, onStatusUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('timestamp')
  const [sortOrder, setSortOrder] = useState('desc')

  const getFilteredOrders = () => {
    let filtered = orders.filter(order => order.status === 'Ready for consolidation')

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
      } else if (sortBy === 'total') {
        const totalA = a.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        const totalB = b.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        return sortOrder === 'desc' ? totalB - totalA : totalA - totalB
      }
      return 0
    })

    return filtered
  }

  const handleCompleteOrder = (orderId) => {
    onStatusUpdate(orderId, 'Order complete')
  }

  const readyOrders = getFilteredOrders()

  return (
    <Box className="consolidation-container">
      <Typography variant="h4" gutterBottom>
        Consolidation Station
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
              <MenuItem value="total">Total Amount</MenuItem>
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

      {readyOrders.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No orders ready for consolidation
        </Typography>
      ) : (
        readyOrders.map(order => (
          <Card key={order.id} className="order-card">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Order #{order.orderNumber}
                </Typography>
                <Chip 
                  label="Ready for Consolidation" 
                  color="success"
                  size="small"
                />
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Placed at: {new Date(order.timestamp).toLocaleString()}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <List>
                {order.items.map((item, index) => (
                  <ListItem key={index} sx={{ py: 1 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body1">
                            {item.name} x {item.quantity}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {item.group}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Typography variant="h6">
                  Total Amount
                </Typography>
                <Typography variant="h6" color="primary">
                  ${order.items.reduce((total, item) => 
                    total + (item.price * item.quantity), 0
                  ).toFixed(2)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                onClick={() => handleCompleteOrder(order.id)}
                sx={{ mt: 2 }}
                fullWidth
              >
                Mark as Complete
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  )
}

export default ConsolidationStation