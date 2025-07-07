import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface BlurImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderColor?: string;
  width?: number | string;
  height?: number | string;
}

const BlurImage: React.FC<BlurImageProps> = ({
  src,
  alt,
  className = '',
  placeholderColor = 'from-warm-teal-100 to-warm-teal-200',
  width,
  height,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  
  useEffect(() => {
    // Reset states when src changes
    setIsLoading(true);
    setError(false);
    
    // Create new image object to preload
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setError(true);
      setIsLoading(false);
      console.warn(`Failed to load image: ${src}`);
    };
    
    return () => {
      // Cancel the image load if component unmounts
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);
  
  // Combined style for both placeholder and image
  const commonStyle = {
    width: width || '100%',
    height: height || '100%',
  };
  
  // Placeholder while loading
  if (isLoading) {
    return (
      <div 
        className={`relative overflow-hidden ${className}`}
        style={commonStyle}
        aria-busy="true"
        aria-label={`Loading ${alt}`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${placeholderColor} animate-pulse flex items-center justify-center`}>
          <div className="animate-spin">
            <Heart className="h-8 w-8 text-white opacity-50" />
          </div>
        </div>
      </div>
    );
  }
  
  // Error fallback
  if (error) {
    return (
      <div 
        className={`bg-gradient-to-br ${placeholderColor} flex items-center justify-center ${className}`}
        style={commonStyle}
        role="img"
        aria-label={alt}
      >
        <Heart className="h-8 w-8 text-warm-teal opacity-50" />
      </div>
    );
  }
  
  // Loaded image
  return (
    <img 
      src={imageSrc}
      alt={alt}
      className={`${className} transition-opacity duration-500 ease-in-out`}
      style={commonStyle}
      loading="lazy"
    />
  );
};

export default BlurImage;