import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import { SnippetsService } from '../api/services/SnippetsService';
import { getLocalSnippets, removeLocalSnippet } from '../utils/storage';
import { format } from 'date-fns';
import { SnippetResponse } from '../api/models/SnippetResponse';

const ViewSnippet = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [snippet, setSnippet] = useState<SnippetResponse | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [isProtected, setIsProtected] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [editToken, setEditToken] = useState<string>('');

  useEffect(() => {
    const loadSnippet = async () => {
      try {
        const response = await SnippetsService.getSnippet(id!, password);
        setSnippet(response);
        setIsProtected(false);
        
        const localSnippets = getLocalSnippets();
        const localSnippet = localSnippets.find(s => s.id === id);
        setIsOwner(!!localSnippet);
        if (localSnippet) {
          setTitle(localSnippet.title || '');
          setEditToken(localSnippet.editToken);
        }
      } catch (error) {
        if (error instanceof Error && 'status' in error && error.status === 401) {
          setIsProtected(true);
        } else {
          setError('Failed to load snippet. It may have expired or been deleted.');
        }
      }
    };

    if (id) {
      loadSnippet();
    }
  }, [id, password]);

  const handleDelete = async () => {
    if (!isOwner) return;
    
    const localSnippets = getLocalSnippets();
    const localSnippet = localSnippets.find(s => s.id === id);
    
    if (!localSnippet) return;

    try {
      await SnippetsService.deleteSnippet(id!, localSnippet.editToken, password);
      removeLocalSnippet(id!);
      navigate('/');
    } catch (error) {
      console.error(error)
      setError('Failed to delete snippet. Please try again.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (isProtected) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <Typography variant="h5" gutterBottom>
            Password Required
          </Typography>
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <Button
            variant="contained"
            onClick={() => setPassword('')}
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Container>
    );
  }

  if (!snippet) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          {error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 500 }}>
            {title || 'Untitled Snippet'}
          </Typography>
          {isOwner && (
            <Box>
              <IconButton 
                onClick={() => navigate(`/snippet/${id}/edit`)}
                sx={{ mr: 1 }}
              >
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Box>
        <Typography color="text.secondary" gutterBottom>
          Created: {format(new Date(snippet.createdAt), 'PPpp')}
          {snippet.expiresAt && (
            <> • Expires: {format(new Date(snippet.expiresAt), 'PPpp')}</>
          )}
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={15}
          value={snippet.content}
          InputProps={{
            readOnly: true,
          }}
          variant="outlined"
          sx={{ mt: 2, mb: 3 }}
        />
        {isOwner && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Share URL
            </Typography>
            <TextField
              fullWidth
              value={`${window.location.origin}/snippet/${id}`}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => copyToClipboard(`${window.location.origin}/snippet/${id}`)}>
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
              value={editToken}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => copyToClipboard(editToken)}>
                      <ContentCopyIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default ViewSnippet; 