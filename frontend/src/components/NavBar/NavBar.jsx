import React from 'react'
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useNavigate } from 'react-router-dom'

function NavBar() {
  const navigate = useNavigate();
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Receipt Parser
        </Typography>
        {/* Dark mode toggle can go here */}
      </Toolbar>
    </AppBar>
  )
}

export default NavBar 