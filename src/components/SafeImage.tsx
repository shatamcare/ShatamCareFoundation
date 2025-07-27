/**
 * SafeImage.tsx
 * 
 * Simple, reliable image component with fallback
 */

import React, { useState, useEffect } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
}

export function SafeImage({ 
  src, 
  alt,
  fallbackSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiNkMWQ1ZGIiLz4KPHRleHQgeD0iMTUwIiB5PSIxNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY5NzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RXZlbnQgSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==', // Event-specific fallback
  className = '',
  ...props 
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(() => {
    // If src is already a full Supabase URL, use it directly
    if (src.includes('supabase.co/storage/v1/object/public')) {
      return src;
    }
    
    // For relative paths like "media/Activity 1.jpg", convert to proper Supabase URL with encoding
    if (src.startsWith('media/')) {
      const filename = src.replace('media/', '');
      // URL encode the filename to handle spaces and special characters
      const encodedFilename = encodeURIComponent(filename);
      return `https://uumavtvxuncetfqwlgvp.supabase.co/storage/v1/object/public/media/${encodedFilename}`;
    }
    
    // Otherwise use as-is
    return src;
  });
  const [hasError, setHasError] = useState(false);

  // Reset image state when src changes
  useEffect(() => {
    // Apply the same logic when src changes
    if (src.includes('supabase.co/storage/v1/object/public')) {
      setImgSrc(src);
    } else if (src.startsWith('media/')) {
      const filename = src.replace('media/', '');
      const encodedFilename = encodeURIComponent(filename);
      setImgSrc(`https://uumavtvxuncetfqwlgvp.supabase.co/storage/v1/object/public/media/${encodedFilename}`);
    } else {
      setImgSrc(src);
    }
    setHasError(false);
  }, [src]);

  const handleError = () => {
    // Only switch to fallback if we haven't already and it's not the same as current src
    if (!hasError && imgSrc !== fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
      {...props}
    />
  );
}

export default SafeImage;
