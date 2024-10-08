import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, List, ListItem, ListItemText, Card, CardContent, Button, CircularProgress, ListItemIcon, Snackbar } from '@mui/material';
import { ChatBubbleOutline } from '@mui/icons-material';
import { backend } from '../../declarations/backend';
import { retryAsync } from '../utils/retryAsync';

interface Thread {
  id: bigint;
  title: string;
  author: string;
  createdAt: bigint;
}

function CategoryView() {
  const { id } = useParams<{ id: string }>();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThreads = async () => {
      if (id) {
        try {
          const result = await retryAsync(() => backend.getThreads(BigInt(id)), 3);
          setThreads(result);
          setLoading(false);
        } catch (error) {
          console.error('Failed to fetch threads:', error);
          setError('Failed to load threads. Please try again.');
          setLoading(false);
        }
      }
    };
    fetchThreads();
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Category Threads
      </Typography>
      <Button
        component={Link}
        to={`/new-thread?categoryId=${id}`}
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
      >
        Create New Thread
      </Button>
      <Card>
        <CardContent>
          <List>
            {threads.map((thread) => (
              <ListItem
                key={thread.id.toString()}
                component={Link}
                to={`/thread/${thread.id}`}
                button
              >
                <ListItemIcon>
                  <ChatBubbleOutline />
                </ListItemIcon>
                <ListItemText
                  primary={thread.title}
                  secondary={`By ${thread.author} on ${new Date(Number(thread.createdAt) / 1000000).toLocaleString()}`}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />
    </div>
  );
}

export default CategoryView;
