import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, List, ListItem, ListItemText, Card, CardContent, CircularProgress, ListItemIcon, Snackbar } from '@mui/material';
import { ChatBubbleOutline, Memory, SportsBasketball } from '@mui/icons-material';
import { backend } from '../../declarations/backend';
import { retryAsync } from '../utils/retryAsync';

interface Category {
  id: bigint;
  name: string;
  description: string | null;
}

function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await retryAsync(() => backend.getCategories(), 3);
        setCategories(result);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setError('Failed to load categories. Please try again.');
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case 'General Discussion':
        return <ChatBubbleOutline />;
      case 'Technology':
        return <Memory />;
      case 'Sports':
        return <SportsBasketball />;
      default:
        return <ChatBubbleOutline />;
    }
  };

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to IC Forum
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Categories
          </Typography>
          <List>
            {categories.map((category) => (
              <ListItem
                key={category.id.toString()}
                component={Link}
                to={`/category/${category.id}`}
                button
              >
                <ListItemIcon>
                  {getCategoryIcon(category.name)}
                </ListItemIcon>
                <ListItemText
                  primary={category.name}
                  secondary={category.description || 'No description'}
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

export default Home;
