/**
 * This is a utility component that generates placeholder SVG images
 * for wedding UI elements with dusty blue and old rose colors
 */

// Define our color palette with the new hex codes
export const colors = {
  dustyBlue: '#5A86AD',
  dustyBlueLight: '#8BAAC3',
  dustyBlueLighter: '#C6D4E1',
  dustyBlueDark: '#3A5B7A',
  oldRose: '#C08081',
  oldRoseLight: '#D6ACAD', 
  oldRoseLighter: '#EBD4D4',
  oldRoseDark: '#9A6566',
  white: '#FFFFFF',
  cream: '#F5F2ED',
};

export const generateWeddingPlaceholder = (type: 'main' | 'background' | 'gallery' | 'story' | 'entourage', index?: number | string) => {
  // Use real images if available
  if (type === 'gallery' && index === 1) return '/wedding/couple-left.jpg';
  if (type === 'gallery' && index === 2) return '/wedding/couple-right.jpg';
  
  // Set dimensions and patterns based on image type
  const getAttributes = () => {
    switch(type) {
      case 'background':
        return {
          width: 1920,
          height: 1080,
          pattern: 'gradient',
          colors: [colors.dustyBlue, colors.oldRoseLight],
        };
      case 'main':
        // Default to real image if available
        return {
          width: 800,
          height: 1000,
          pattern: 'couple',
          colors: [colors.dustyBlue, colors.oldRose],
        };
      case 'gallery':
        return {
          width: 600,
          height: 600,
          pattern: 'pattern',
          colors: typeof index === 'number' && index % 2 === 0 
            ? [colors.dustyBlue, colors.oldRoseLight]
            : [colors.oldRose, colors.dustyBlueLight],
        };
      case 'story':
        return {
          width: 400,
          height: 300,
          pattern: 'memories',
          colors: typeof index === 'number' && index % 2 === 0 
            ? [colors.oldRose, colors.dustyBlueLight]
            : [colors.dustyBlue, colors.oldRoseLight],
        };
      case 'entourage':
        return {
          width: 250,
          height: 350,
          pattern: 'portrait',
          colors: String(index).includes('bride') 
            ? [colors.oldRose, colors.oldRoseDark]
            : [colors.dustyBlue, colors.dustyBlueDark],
        };
    }
  };

  const attrs = getAttributes();
  const { width, height, pattern, colors: [color1, color2] } = attrs!;
  
  // Create an SVG string
  let svgContent = '';
  
  switch(pattern) {
    case 'gradient':
      svgContent = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${color1}" />
              <stop offset="100%" stop-color="${color2}" />
            </linearGradient>
            <pattern id="pattern" patternUnits="userSpaceOnUse" width="100" height="100">
              <path d="M0,0 L100,100 M100,0 L0,100" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad)"/>
          <rect width="100%" height="100%" fill="url(#pattern)" fill-opacity="0.3"/>
          <text x="50%" y="50%" font-family="serif" font-size="40" text-anchor="middle" fill="rgba(255,255,255,0.8)">Wedding Background</text>
        </svg>
      `;
      break;
    case 'couple':
      svgContent = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="${color1}" />
              <stop offset="100%" stop-color="${color2}" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="white"/>
          <circle cx="50%" cy="35%" r="30%" fill="url(#grad)" opacity="0.9"/>
          <rect x="30%" y="55%" width="40%" height="40%" fill="url(#grad)" opacity="0.8"/>
          <text x="50%" y="35%" font-family="serif" font-size="40" text-anchor="middle" fill="white">Couple</text>
          <text x="50%" y="75%" font-family="serif" font-size="30" text-anchor="middle" fill="white">Together</text>
        </svg>
      `;
      break;
    case 'portrait':
      svgContent = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="${color1}" />
              <stop offset="100%" stop-color="${color2}" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="#f8f8f8"/>
          <circle cx="50%" cy="30%" r="25%" fill="url(#grad)" opacity="0.9"/>
          <rect x="25%" y="45%" width="50%" height="40%" rx="5" fill="url(#grad)" opacity="0.7"/>
          <text x="50%" y="90%" font-family="serif" font-size="16" text-anchor="middle" fill="#333333">${
            String(index).includes('bride') ? 'Bridal Party' : 
            String(index).includes('groom') ? 'Groomsmen' : 
            String(index).includes('flower') ? 'Flower Girl' : 
            String(index).includes('ring') ? 'Ring Bearer' : 'Wedding Party'
          }</text>
        </svg>
      `;
      break;
    case 'memories':
      svgContent = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${color1}" />
              <stop offset="100%" stop-color="${color2}" />
            </linearGradient>
            <pattern id="hearts" patternUnits="userSpaceOnUse" width="50" height="50">
              <path d="M25,10 Q25,0 37.5,10 T50,10 Q50,25 25,40 Q0,25 0,10 Q0,0 12.5,10 T25,10" fill="rgba(255,255,255,0.15)"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad)"/>
          <rect width="100%" height="100%" fill="url(#hearts)"/>
          <text x="50%" y="50%" font-family="serif" font-size="24" text-anchor="middle" fill="rgba(255,255,255,0.9)">Memory</text>
        </svg>
      `;
      break;
    case 'pattern':
      svgContent = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${color1}" />
              <stop offset="100%" stop-color="${color2}" />
            </linearGradient>
            <pattern id="hearts" patternUnits="userSpaceOnUse" width="100" height="100">
              <path d="M50,30 A15,15 0 0,1 65,65 A15,15 0 0,1 35,65 A15,15 0 0,1 50,30" fill="white" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad)"/>
          <rect width="100%" height="100%" fill="url(#hearts)" fill-opacity="0.5"/>
          <text x="50%" y="50%" font-family="serif" font-size="30" text-anchor="middle" fill="white">Gallery Image ${index || ''}</text>
        </svg>
      `;
      break;
  }
  
  // Encode the SVG for use in an image src
  const encodedSVG = encodeURIComponent(svgContent);
  return `data:image/svg+xml,${encodedSVG}`;
};

/**
 * Generates a hotel placeholder image for accommodation sections
 */
export const generateHotelPlaceholder = (width: number, height: number) => {
  // Create a hotel building SVG
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${colors.dustyBlueLighter}" />
          <stop offset="100%" stop-color="${colors.dustyBlueLight}" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#skyGrad)" />
      <rect x="${width * 0.2}" y="${height * 0.25}" width="${width * 0.6}" height="${height * 0.65}" fill="${colors.dustyBlue}" />
      
      <!-- Hotel windows -->
      ${Array.from({length: 5}, (_, row) => 
        Array.from({length: 4}, (_, col) => 
          `<rect x="${width * (0.25 + col * 0.12)}" y="${height * (0.3 + row * 0.1)}" width="${width * 0.06}" height="${height * 0.06}" fill="${colors.cream}" />`
        ).join('')
      ).join('')}
      
      <!-- Hotel entrance -->
      <rect x="${width * 0.4}" y="${height * 0.75}" width="${width * 0.2}" height="${height * 0.15}" fill="${colors.dustyBlueDark}" />
      <rect x="${width * 0.45}" y="${height * 0.78}" width="${width * 0.1}" height="${height * 0.12}" fill="${colors.white}" />
      
      <!-- Hotel sign -->
      <rect x="${width * 0.35}" y="${height * 0.18}" width="${width * 0.3}" height="${height * 0.06}" fill="${colors.oldRoseLight}" />
      <text x="${width * 0.5}" y="${height * 0.22}" font-family="Arial" font-size="${height * 0.04}" text-anchor="middle" fill="${colors.white}">HOTEL</text>
    </svg>
  `;

  // Encode the SVG for use in an image src
  const encodedSVG = encodeURIComponent(svgContent);
  return `data:image/svg+xml,${encodedSVG}`;
};

export default generateWeddingPlaceholder;