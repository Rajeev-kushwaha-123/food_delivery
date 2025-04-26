import { Box, Card, CardContent, Typography, Button, List, ListItem, ListItemText } from '@mui/material'
import './ConsolidationStation.css'

const ConsolidationStation = ({ orders, onStatusUpdate }) => {
  const readyOrders = orders.filter(order => order.status === 'Ready for consolidation')

  const handleCompleteOrder = (orderId) => {
    onStatusUpdate(orderId, 'Order complete')
  }

  return (
    <Box className="consolidation-container">
      <Typography variant="h4" gutterBottom>
        Consolidation Station
      </Typography>

      {readyOrders.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No orders ready for consolidation
        </Typography>
      ) : (
        readyOrders.map(order => (
          <Card key={order.id} className="order-card">
            <CardContent>
              <Typography variant="h6">
                Order #{order.orderNumber}
              </Typography>
              
              <List>
                {order.items.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`${item.name} x ${item.quantity}`}
                      secondary={`$${(item.price * item.quantity).toFixed(2)}`}
                    />
                  </ListItem>
                ))}
              </List>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">
                  Total: ${order.items.reduce((total, item) => 
                    total + (item.price * item.quantity), 0
                  ).toFixed(2)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                onClick={() => handleCompleteOrder(order.id)}
                sx={{ mt: 2 }}
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