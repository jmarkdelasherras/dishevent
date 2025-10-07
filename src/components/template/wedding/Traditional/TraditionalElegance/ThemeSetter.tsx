'use client';

import React, { useEffect } from 'react';

export interface ThemeColors {
  'primary-color'?: string;
  'primary-color-light'?: string;
  'primary-color-lighter'?: string;
  'primary-color-dark'?: string;
  'primary-color-rgb'?: string;
  
  'secondary-color'?: string;
  'secondary-color-light'?: string;
  'secondary-color-lighter'?: string;
  'secondary-color-dark'?: string;
  'secondary-color-rgb'?: string;
  
  'accent-color'?: string;
  'accent-color-light'?: string;
  'accent-color-dark'?: string;
  'accent-color-rgb'?: string;
  
  // Additional theme properties can be added as needed
  [key: string]: string | undefined;
}

export interface ThemeSetterProps {
  theme: ThemeColors | null;
  selector?: string; // CSS selector to apply the theme to (defaults to :root)
}

/**
 * Utility function to convert hex color to RGB values
 */
const hexToRgb = (hex: string): string | null => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const formattedHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(formattedHex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : null;
};

/**
 * ThemeSetter component that dynamically applies CSS custom properties
 * to create configurable themes for the wedding component
 */
export const ThemeSetter: React.FC<ThemeSetterProps> = ({
  theme,
  selector = ':root'
}) => {
  useEffect(() => {
    // Get the target element to apply styles to
    const targetElement = 
      selector === ':root' ? document.documentElement : document.querySelector(selector) as HTMLElement;
    
    if (!targetElement) {
      console.error(`ThemeSetter: Target selector "${selector}" not found`);
      return;
    }

    // Clear any previously set custom theme properties
    const customProps = Array.from(targetElement.style as unknown as string[]);
    customProps.forEach(prop => {
      if (typeof prop === 'string' && prop.startsWith('--')) {
        targetElement.style.removeProperty(prop);
      }
    });
    
    // Apply custom theme properties if provided
    if (theme) {
      Object.entries(theme).forEach(([key, value]) => {
        if (value) {
          // Apply the CSS variable
          (targetElement as HTMLElement).style.setProperty(`--${key}`, value);
          
          // If this is a color and doesn't have an RGB version, generate it
          if (
            (key.includes('color') && !key.includes('rgb')) && 
            value.startsWith('#')
          ) {
            const rgbValue = hexToRgb(value);
            if (rgbValue) {
              (targetElement as HTMLElement).style.setProperty(`--${key}-rgb`, rgbValue);
            }
          }
        }
      });
    }
    
    // No need to apply predefined theme classes as they'll come from the theme object directly
    
    // Cleanup function
    return () => {
      if (theme) {
        // Remove custom properties on unmount
        Object.keys(theme).forEach(key => {
          (targetElement as HTMLElement).style.removeProperty(`--${key}`);
          (targetElement as HTMLElement).style.removeProperty(`--${key}-rgb`);
        });
      }
    };
  }, [theme, selector]);

  return null; // This component doesn't render anything
};

export default ThemeSetter;