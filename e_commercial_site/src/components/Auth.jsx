import { useState } from 'react'
import { Box, Card, CardContent, TextField, Button, Typography, Tabs, Tab, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import './Auth.css'

const Auth = ({ setIsAuthenticated }) => {
  const [activeTab, setActiveTab] = useState(0)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    groups: []
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const availableGroups = [
    'Veg Pizza',
    'NV Pizza',
    'Sandwich',
    'Burger',
    'Drinks'
  ]

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
    setFormData({
      username: '',
      password: '',
      confirmPassword: '',
      groups: []
    })
    setError('')
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleGroupChange = (event) => {
    setFormData(prev => ({
      ...prev,
      groups: event.target.value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (activeTab === 0) { // Login
      if (!formData.username || !formData.password) {
        setError('Please fill in all fields')
        return
      }
      // Mock authentication - in a real app, this would call an API
      const storedUser = localStorage.getItem('users')
      const users = storedUser ? JSON.parse(storedUser) : []
      const user = users.find(u => u.username === formData.username && u.password === formData.password)
      
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify({
          username: user.username,
          groups: user.groups,
          isAuthenticated: true
        }))
        setIsAuthenticated(true)
        navigate('/')
      } else {
        setError('Invalid username or password')
      }
    } else { // Signup
      if (!formData.username || !formData.password || !formData.confirmPassword || formData.groups.length === 0) {
        setError('Please fill in all fields')
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return
      }

      // Mock user registration - in a real app, this would call an API
      const storedUser = localStorage.getItem('users')
      const users = storedUser ? JSON.parse(storedUser) : []
      
      if (users.some(u => u.username === formData.username)) {
        setError('Username already exists')
        return
      }

      const newUser = {
        username: formData.username,
        password: formData.password,
        groups: formData.groups
      }

      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))
      localStorage.setItem('currentUser', JSON.stringify({
        username: newUser.username,
        groups: newUser.groups,
        isAuthenticated: true
      }))
      setIsAuthenticated(true)
      navigate('/')
    }
  }

  return (
    <Box className="auth-container">
      <Card className="auth-card">
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Workload Management
          </Typography>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            className="auth-tabs"
          >
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            {activeTab === 1 && (
              <>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Select Groups</InputLabel>
                  <Select
                    multiple
                    value={formData.groups}
                    onChange={handleGroupChange}
                    label="Select Groups"
                  >
                    {availableGroups.map((group) => (
                      <MenuItem key={group} value={group}>
                        {group}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="auth-button"
              size="large"
            >
              {activeTab === 0 ? 'Login' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Auth 