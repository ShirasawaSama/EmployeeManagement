import React from 'react'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'

import Employees from './Employees'

const App: React.FC = () => (
  <Container maxWidth='lg'>
    <Typography variant='h4' sx={{ mb: '8px' }}>员工信息管理系统</Typography>
    <Employees />
  </Container>
)

export default App
