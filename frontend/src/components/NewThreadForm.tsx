import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Typography, TextField, Button, Card, CardContent, CircularProgress } from '@mui/material';
import { backend } from '../../declarations/backend';

function NewThreadForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryId = searchParams.get('categoryId');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryId && title.trim() && content.trim()) {
      setSubmitting(true);
      try {
        const result = await backend.createThread(BigInt(categoryId), title, content, 'Anonymous');
        if ('ok' in result) {
          navigate(`/thread/${result.ok}`);
        } else {
          console.error('Failed to create thread:', result.err);
        }
      } catch (error) {
        console.error('Error creating thread:', error);
      }
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Thread
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Thread Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Thread Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
            sx={{ mt: 2 }}
          >
            {submitting ? <CircularProgress size={24} /> : 'Create Thread'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default NewThreadForm;
