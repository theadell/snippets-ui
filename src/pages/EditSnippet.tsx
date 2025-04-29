import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { SnippetsService } from '../api/services/SnippetsService';
import { getLocalSnippets } from '../utils/storage';
import { SnippetFormData } from '../types/snippet';

const EditSnippet = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SnippetFormData>({
    content: '',
  });
  const [error, setError] = useState<string>('');
  const [editToken, setEditToken] = useState<string>('');

  useEffect(() => {
    const loadSnippet = async () => {
      const localSnippets = getLocalSnippets();
      const localSnippet = localSnippets.find(s => s.id === id);
      
      if (!localSnippet) {
        setError('You do not have permission to edit this snippet.');
        return;
      }

      setEditToken(localSnippet.editToken);

      try {
        const response = await SnippetsService.getSnippet(id!);
        setFormData({
          content: response.content,
          title: response.title,
        });
      } catch (error) {
        console.error(error)
        setError('Failed to load snippet. It may have expired or been deleted.');
      }
    };

    if (id) {
      loadSnippet();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await SnippetsService.updateSnippet(id!, editToken, formData);
      navigate(`/snippet/${id}`);
    } catch (error) {
      console.error(error)
      setError('Failed to update snippet. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Alert severity="error">{error}</Alert>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Back to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
          Edit Snippet
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title (optional)"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            multiline
            rows={15}
            margin="normal"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              type="submit"
              size="large"
            >
              Save Changes
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate(`/snippet/${id}`)}
              size="large"
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default EditSnippet; 