import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  cover_image?: string;
  content: string;
  category: string;
  status: 'draft' | 'published';
  author_id?: string;
  created_at: string;
  updated_at: string;
}

export function useBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async (published_only = false) => {
    try {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (published_only) {
        query = query.eq('status', 'published');
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }

      setPosts((data || []) as BlogPost[]);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPostBySlug = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  };

  const createPost = async (postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([postData])
        .select()
        .single();

      if (error) throw error;

      setPosts(prev => [data as BlogPost, ...prev]);
      return { success: true, data };
    } catch (error) {
      console.error('Error creating post:', error);
      return { success: false, error };
    }
  };

  const updatePost = async (id: string, updates: Partial<BlogPost>) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setPosts(prev => prev.map(post => 
        post.id === id ? { ...post, ...updates } : post
      ));
      return { success: true };
    } catch (error) {
      console.error('Error updating post:', error);
      return { success: false, error };
    }
  };

  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPosts(prev => prev.filter(post => post.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting post:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    fetchPosts,
    getPostBySlug,
    createPost,
    updatePost,
    deletePost,
    refetch: fetchPosts
  };
}