import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
  Alert,
  Link,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Snackbar,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon, ContentCopy as ContentCopyIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { SnippetsService } from '../api/services/SnippetsService';
import { getLocalSnippets, removeLocalSnippet, addLocalSnippet } from '../utils/storage';
import { SnippetFormData } from '../types/snippet';
import { format } from 'date-fns';

const Home = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SnippetFormData>({
    content: '',
    expiresIn: '8760h', // 1 year in hours
  });
  const [error, setError] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [successData, setSuccessData] = useState<{ url: string; editToken: string } | null>(null);
  const [recentSnippets, setRecentSnippets] = useState(getLocalSnippets());
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    setRecentSnippets(getLocalSnippets());
  }, [successData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await SnippetsService.createSnippet(formData);
      addLocalSnippet({
        id: response.id,
        editToken: response.editToken,
        expiresAt: response.expiresAt,
        title: formData.title || '',
      });
      setSuccessData({
        url: `${window.location.origin}/snippet/${response.id}`,
        editToken: response.editToken,
      });
      setError(''); // Clear any previous errors
    } catch (err) {
      setError('Failed to share snippet. Please try again.');
      setSuccessData(null); // Clear any previous success state
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleDelete = (id: string) => {
    removeLocalSnippet(id);
    setRecentSnippets(getLocalSnippets());
    setDeleteSuccess(true);
  };

  const expirationOptions = [
    { value: '0.17h', label: '10 minutes' },
    { value: '1h', label: '1 hour' },
    { value: '24h', label: '1 day' },
    { value: '168h', label: '1 week' },
    { value: '720h', label: '1 month' },
    { value: '8760h', label: '1 year' },
  ];

  if (successData) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3,
              '& .MuiAlert-icon': {
                alignItems: 'center',
              },
            }}
          >
            Your snippet has been shared successfully!
          </Alert>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Share URL
            </Typography>
            <TextField
              fullWidth
              value={successData.url}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => copyToClipboard(successData.url)}>
                      <ContentCopyIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Edit Token
            </Typography>
            <TextField
              fullWidth
              value={successData.editToken}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => copyToClipboard(successData.editToken)}>
                      <ContentCopyIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Button
            variant="outlined"
            onClick={() => {
              setSuccessData(null);
              setFormData({ content: '', expiresIn: '8760h' });
            }}
            fullWidth
          >
            Share Another Snippet
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title (optional)"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            multiline
            rows={10}
            margin="normal"
            variant="outlined"
            sx={{ mb: 3 }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <FormControl sx={{ minWidth: 200, mr: 2 }}>
              <InputLabel>Expiration</InputLabel>
              <Select
                name="expiresIn"
                value={formData.expiresIn}
                onChange={(e) => setFormData((prev) => ({ ...prev, expiresIn: e.target.value }))}
                label="Expiration"
              >
                {expirationOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="text"
              onClick={() => setShowAdvanced(!showAdvanced)}
              endIcon={showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            >
              Advanced Options
            </Button>
          </Box>
          <Collapse in={showAdvanced}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Password (optional)"
                name="password"
                type="password"
                value={formData.password || ''}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth>
                <InputLabel>Content Type</InputLabel>
                <Select
                  name="contentType"
                  value={formData.contentType || 'text/plain'}
                  onChange={(e) => setFormData((prev) => ({ ...prev, contentType: e.target.value }))}
                  label="Content Type"
                >
                  <MenuItem value="text/plain">Plain Text</MenuItem>
                  <MenuItem value="text/markdown">Markdown</MenuItem>
                  <MenuItem value="application/json">JSON</MenuItem>
                  <MenuItem value="text/html">HTML</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Collapse>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          <Alert 
            severity="info" 
            sx={{ 
              mb: 3,
              '& .MuiAlert-icon': {
                alignItems: 'center',
              },
            }}
          >
            Your content is encrypted at rest. Learn more about our{' '}
            <Link href="#" underline="hover">security practices</Link>.
          </Alert>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="large"
            fullWidth
            sx={{ 
              py: 1.2,
              fontSize: '1rem',
              fontWeight: 400,
              textTransform: 'none',
            }}
          >
            Share Snippet
          </Button>
        </form>

        {recentSnippets.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Snippets
            </Typography>
            <List>
              {recentSnippets.map((snippet, index) => (
                <Box key={snippet.id}>
                  {index > 0 && <Divider />}
                  <ListItem>
                    <ListItemText
                      primary={snippet.title || 'Untitled Snippet'}
                      secondary={
                        snippet.expiresAt
                          ? `Expires: ${format(new Date(snippet.expiresAt), 'PPpp')}`
                          : 'No expiration'
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => navigate(`/snippet/${snippet.id}/edit`)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDelete(snippet.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Box>
              ))}
            </List>
          </Box>
        )}
      </Box>
      <Snackbar
        open={deleteSuccess}
        autoHideDuration={3000}
        onClose={() => setDeleteSuccess(false)}
        message="Snippet deleted successfully"
      />
    </Container>
  );
};

export default Home; 