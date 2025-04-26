import { Box, List, ListItem, ListItemText, Typography, Paper, Avatar } from '@mui/material'
import { useState, useEffect } from 'react'

const Sidebar = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [activeStaff, setActiveStaff] = useState([])

  useEffect(() => {
    // Get current user from localStorage
    const user = localStorage.getItem('currentUser')
    if (user) {
      setCurrentUser(JSON.parse(user))
    }

    // Mock data for active staff
    setActiveStaff([
      { id: 1, name: 'Chandler', groups: ['Veg Pizza', 'Burger'] },
      { id: 2, name: 'Joey', groups: ['Veg Pizza', 'NV Pizza', 'Sandwich', 'Burger'] },
      { id: 3, name: 'Rachel', groups: ['NV Pizza'] },
      { id: 4, name: 'Monica', groups: ['Sandwich'] },
      { id: 5, name: 'Ross', groups: ['Drinks'] }
    ])
  }, [])

  return (
    <Paper elevation={0} sx={{ width: 250, p: 2, height: '100%', overflow: 'auto' }}>
      {currentUser && (
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Avatar sx={{ width: 56, height: 56, mx: 'auto', mb: 1 }}>
            {currentUser.username.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h6">{currentUser.username}</Typography>
          <Typography variant="body2" color="text.secondary">
            Assigned Groups
          </Typography>
          <Box sx={{ mt: 1 }}>
            {currentUser.groups.map((group, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  display: 'inline-block',
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  mr: 1,
                  mb: 1
                }}
              >
                {group}
              </Typography>
            ))}
          </Box>
        </Box>
      )}

      <Typography variant="h6" gutterBottom>
        Active Staff
      </Typography>
      <List>
        {activeStaff.map((staff) => (
          <ListItem key={staff.id}>
            <ListItemText
              primary={staff.name}
              secondary={staff.groups.join(', ')}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}

export default Sidebar