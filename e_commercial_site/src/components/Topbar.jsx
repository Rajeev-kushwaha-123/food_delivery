import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link } from 'react-router-dom'

const Topbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Workload Management System
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} to="/">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/queue">
            Order Queue
          </Button>
          <Button color="inherit" component={Link} to="/consolidation">
            Consolidation
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Topbar