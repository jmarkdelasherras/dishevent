import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
  onImageError?: (error: Error) => void;
  loader?: (props: { src: string; width: number; quality?: number }) => string;
}

/**
 * A wrapper around Next.js Image component that handles loading errors gracefully
 * This helps prevent timeout issues with Firebase Storage URLs
 */
export function SafeImage({
  src,
  alt,
  fallbackSrc = '/assets/image-placeholder.svg',
  onImageError,
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  // Use the provided src if imgSrc is null (initial state)
  const displaySrc = imgSrc || src;
  
  // Handle image loading errors
  const handleError = (error: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`Error loading image: ${typeof src === 'string' ? src : 'object'}`, error);
    
    // Call the onImageError callback if provided
    if (onImageError) {
      onImageError(new Error(`Failed to load image: ${error.type}`));
    }
    
    // Prevent infinite error loop by checking if we're already showing the fallback
    if (!isError) {
      setImgSrc(fallbackSrc);
      setIsError(true);
    }
  };

  // Set priority and loading for better performance
  const enhancedProps = {
    ...props,
    loading: props.loading || "eager",
    priority: props.priority !== undefined ? props.priority : true,
  };
  
  // Create a default loader if none is provided
  const defaultLoader = ({ src, width, quality }: { src: string, width: number, quality?: number }) => {
    if (!src || src === '') return fallbackSrc;
    if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://')) {
      return src;
    }
    return `${src}${src.includes('?') ? '&' : '?'}w=${width}&q=${quality || 75}`;
  };
  
  // Use the provided loader or the default one
  const imageLoader = props.loader || defaultLoader;

  return (
    <Image
      loader={imageLoader}
      src={displaySrc || fallbackSrc}
      alt={alt}
      onError={handleError}
      {...enhancedProps}
    />
  );
}