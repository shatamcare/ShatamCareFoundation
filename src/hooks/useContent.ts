/**
 * useContent.ts
 * 
 * Hook for fetching dynamic content from the CMS
 */

import { useState, useEffect } from 'react';
import { getContentItems, type ContentItem } from '@/lib/supabase-secure';

export interface UseContentOptions {
  page?: string;
  section?: string;
  type?: 'page' | 'section' | 'component';
  status?: 'published' | 'draft';
}

export function useContent(options: UseContentOptions = {}) {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const allContent = await getContentItems(options.page);
        
        // Filter content based on options
        let filteredContent = allContent.filter(item => 
          item.status === (options.status || 'published')
        );

        if (options.section) {
          filteredContent = filteredContent.filter(item => 
            item.section === options.section
          );
        }

        if (options.type) {
          filteredContent = filteredContent.filter(item => 
            item.type === options.type
          );
        }

        setContent(filteredContent);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [options.page, options.section, options.type, options.status]);

  // Helper functions for common content queries
  const getContentBySection = (sectionName: string) => 
    content.find(item => item.section === sectionName);

  const getContentByTitle = (title: string) => 
    content.find(item => item.title.toLowerCase().includes(title.toLowerCase()));

  const getSectionContent = (sectionName: string) => 
    content.filter(item => item.section === sectionName);

  return {
    content,
    loading,
    error,
    getContentBySection,
    getContentByTitle,
    getSectionContent,
    refetch: () => {
      setLoading(true);
      const fetchContent = async () => {
        try {
          const allContent = await getContentItems(options.page);
          let filteredContent = allContent.filter(item => 
            item.status === (options.status || 'published')
          );

          if (options.section) {
            filteredContent = filteredContent.filter(item => 
              item.section === options.section
            );
          }

          if (options.type) {
            filteredContent = filteredContent.filter(item => 
              item.type === options.type
            );
          }

          setContent(filteredContent);
          setError(null);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch content');
        } finally {
          setLoading(false);
        }
      };
      fetchContent();
    }
  };
}

// Specialized hooks for common use cases
export function usePageContent(page: string) {
  return useContent({ page, type: 'section' });
}

export function useHeroContent(page: string) {
  return useContent({ page, section: 'hero', type: 'section' });
}

export function useAboutContent() {
  return useContent({ page: 'about', type: 'section' });
}

export function useHomeContent() {
  return useContent({ page: 'home', type: 'section' });
}
