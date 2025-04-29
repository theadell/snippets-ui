import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { SnippetsService } from '../api/services/SnippetsService';
import { addLocalSnippet } from '../utils/storage';
import { SnippetFormData } from '../types/snippet';
import { SnippetCreateResponse } from '../api/models/SnippetCreateResponse';

const CreateSnippet = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SnippetFormData>({
    content: '',
  });
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await SnippetsService.createSnippet(formData);
      addLocalSnippet({
        id: response.id,
        editToken: response.editToken,
        expiresAt: response.expiresAt,
        title: formData.title,
      });
      navigate(`/snippet/${response.id}`);
    } catch (error) {
      setError('Failed to create snippet. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Create New Snippet
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title (optional)"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            margin="normal"
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
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Content Type (optional)</InputLabel>
            <Select
              name="contentType"
              value={formData.contentType || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, contentType: e.target.value }))}
              label="Content Type (optional)"
            >
              <MenuItem value="text/plain">Plain Text</MenuItem>
              <MenuItem value="text/markdown">Markdown</MenuItem>
              <MenuItem value="application/json">JSON</MenuItem>
              <MenuItem value="text/html">HTML</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Password (optional)"
            name="password"
            type="password"
            value={formData.password || ''}
            onChange={handleChange}
            margin="normal"
            helperText="Minimum 8 characters"
          />
          <TextField
            fullWidth
            label="Expiration Time (optional)"
            name="expiresIn"
            value={formData.expiresIn || ''}
            onChange={handleChange}
            margin="normal"
            helperText="Format: 24h, 7d, 30d"
          />
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button variant="contained" color="primary" type="submit">
              Create Snippet
            </Button>
            <Button variant="outlined" onClick={() => navigate('/')}>
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateSnippet; 