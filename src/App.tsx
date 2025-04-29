import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, CssBaseline } from '@mui/material';
import Home from './pages/Home';
import ViewSnippet from './pages/ViewSnippet';
import EditSnippet from './pages/EditSnippet';

const App = () => {
  return (
    <Router>
      <CssBaseline />
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          backgroundColor: 'transparent',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 300,
              letterSpacing: '-0.5px',
            }}
          >
            snippets
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} disableGutters>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/snippet/:id" element={<ViewSnippet />} />
          <Route path="/snippet/:id/edit" element={<EditSnippet />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
