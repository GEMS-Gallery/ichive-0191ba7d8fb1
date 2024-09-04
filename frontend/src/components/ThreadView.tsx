import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Card, CardContent, Divider, TextField, Button, CircularProgress } from '@mui/material';
import { backend } from '../../declarations/backend';

interface Post {
  id: bigint;
  author: string;
  content: string;
  createdAt: bigint;
}

function ThreadView() {
  const { id } = useParams<{ id: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      if (id) {
        try {
          const result = await backend.getPosts(BigInt(id));
          setPosts(result);
          setLoading(false);
        } catch (error) {
          console.error('Failed to fetch posts:', error);
          setLoading(false);
        }
      }
    };
    fetchPosts();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id && newPost.trim()) {
      setSubmitting(true);
      try {
        const result = await backend.createPost(BigInt(id), newPost, 'Anonymous');
        if ('ok' in result) {
          const newPostObj: Post = {
            id: result.ok,
            author: 'Anonymous',
            content: newPost,
            createdAt: BigInt(Date.now() * 1000000)
          };
          setPosts([...posts, newPostObj]);
          setNewPost('');
        } else {
          console.error('Failed to create post:', result.err);
        }
      } catch (error) {
        console.error('Error creating post:', error);
      }
      setSubmitting(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Thread View
      </Typography>
      {posts.map((post) => (
        <Card key={post.id.toString()} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {post.author} - {new Date(Number(post.createdAt) / 1000000).toLocaleString()}
            </Typography>
            <Typography variant="body1">{post.content}</Typography>
          </CardContent>
        </Card>
      ))}
      <Divider sx={{ my: 2 }} />
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          label="Your Reply"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={submitting}
        >
          {submitting ? <CircularProgress size={24} /> : 'Post Reply'}
        </Button>
      </form>
    </div>
  );
}

export default ThreadView;
