import { AppBar, Toolbar, Typography, Box } from '@mui/material'

const Bottombar = () => {
  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar variant="dense">
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="caption" color="text.secondary">
            System Status: Online
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          © 2024 Workload Management System
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default Bottombar