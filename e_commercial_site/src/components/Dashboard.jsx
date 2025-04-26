import { useState } from 'react'
import { Box, Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material'
import './Dashboard.css'

const Dashboard = ({ orders, staff, products, onNewOrder }) => {
  const [selectedProducts, setSelectedProducts] = useState([])
  const [orderNumber, setOrderNumber] = useState('')

  const generateOrderNumber = () => {
    const date = new Date()
    const timestamp = date.getTime()
    return `ORD${timestamp}`
  }

  const handleAddProduct = (product) => {
    setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }])
  }

  const handleQuantityChange = (index, value) => {
    const updatedProducts = [...selectedProducts]
    updatedProducts[index].quantity = parseInt(value) || 0
    setSelectedProducts(updatedProducts)
  }

  const handlePlaceOrder = () => {
    if (selectedProducts.length === 0) return

    const newOrder = {
      id: Date.now(),
      orderNumber: orderNumber || generateOrderNumber(),
      items: selectedProducts,
      status: 'Order placed',
      timestamp: new Date().toISOString()
    }

    onNewOrder(newOrder)
    setSelectedProducts([])
    setOrderNumber('')
  }

  return (
    <Box className="dashboard">
      <Typography variant="h4" gutterBottom>
        Order Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Available Products
              </Typography>
              <Grid container spacing={2}>
                {products.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1">{product.name}</Typography>
                        <Typography variant="body2">${product.price}</Typography>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleAddProduct(product)}
                        >
                          Add to Order
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Order
              </Typography>
              <TextField
                fullWidth
                label="Order Number"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                margin="normal"
              />
              {selectedProducts.map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">{item.name}</Typography>
                  <TextField
                    type="number"
                    label="Quantity"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    size="small"
                  />
                </Box>
              ))}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handlePlaceOrder}
                disabled={selectedProducts.length === 0}
              >
                Place Order
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard