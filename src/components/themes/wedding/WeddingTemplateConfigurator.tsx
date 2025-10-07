import React, { useState } from 'react';
import { ChromePicker } from 'react-color';

export interface WeddingTemplateConfig {
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  layout: {
    style: 'classic' | 'modern' | 'elegant' | 'minimalist';
    imageCount: number;
    headerStyle: 'centered' | 'banner' | 'overlay';
    detailsLayout: 'stacked' | 'sideBySide' | 'timeline';
  };
  typography: {
    titleFont: string;
    bodyFont: string;
    titleSize: string;
    bodySize: string;
  };
}

interface WeddingTemplateConfiguratorProps {
  config: WeddingTemplateConfig;
  onChange: (config: WeddingTemplateConfig) => void;
}

const fontOptions = [
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Playfair Display, serif', label: 'Playfair Display' },
  { value: 'Raleway, sans-serif', label: 'Raleway' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat' },
  { value: 'Dancing Script, cursive', label: 'Dancing Script' },
  { value: 'Great Vibes, cursive', label: 'Great Vibes' },
];

const WeddingTemplateConfigurator: React.FC<WeddingTemplateConfiguratorProps> = ({ 
  config, 
  onChange 
}) => {
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);
  
  const handleColorChange = (colorKey: keyof WeddingTemplateConfig['colorPalette'], color: string) => {
    onChange({
      ...config,
      colorPalette: {
        ...config.colorPalette,
        [colorKey]: color,
      },
    });
  };
  
  const handleLayoutChange = (key: keyof WeddingTemplateConfig['layout'], value: any) => {
    onChange({
      ...config,
      layout: {
        ...config.layout,
        [key]: value,
      },
    });
  };
  
  const handleTypographyChange = (key: keyof WeddingTemplateConfig['typography'], value: string) => {
    onChange({
      ...config,
      typography: {
        ...config.typography,
        [key]: value,
      },
    });
  };
  
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Configure Wedding Template</h2>
      
      {/* Color Palette Configuration */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Color Palette</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(config.colorPalette).map(([key, color]) => (
            <div key={key} className="flex flex-col items-center">
              <label className="text-sm capitalize mb-1">{key}</label>
              <div 
                className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                style={{ backgroundColor: color }}
                onClick={() => setActiveColorPicker(activeColorPicker === key ? null : key)}
              />
              {activeColorPicker === key && (
                <div className="absolute z-10 mt-12">
                  <div 
                    className="fixed inset-0" 
                    onClick={() => setActiveColorPicker(null)}
                  />
                  <ChromePicker 
                    color={color} 
                    onChange={(color) => handleColorChange(key as keyof WeddingTemplateConfig['colorPalette'], color.hex)} 
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Layout Configuration */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Layout</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Style</label>
            <select 
              className="w-full p-2 border rounded"
              value={config.layout.style}
              onChange={(e) => handleLayoutChange('style', e.target.value)}
            >
              <option value="classic">Classic</option>
              <option value="modern">Modern</option>
              <option value="elegant">Elegant</option>
              <option value="minimalist">Minimalist</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Image Count</label>
            <input 
              type="number" 
              min="1" 
              max="5" 
              className="w-full p-2 border rounded"
              value={config.layout.imageCount}
              onChange={(e) => handleLayoutChange('imageCount', parseInt(e.target.value))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Header Style</label>
            <select 
              className="w-full p-2 border rounded"
              value={config.layout.headerStyle}
              onChange={(e) => handleLayoutChange('headerStyle', e.target.value)}
            >
              <option value="centered">Centered</option>
              <option value="banner">Banner</option>
              <option value="overlay">Overlay</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Details Layout</label>
            <select 
              className="w-full p-2 border rounded"
              value={config.layout.detailsLayout}
              onChange={(e) => handleLayoutChange('detailsLayout', e.target.value)}
            >
              <option value="stacked">Stacked</option>
              <option value="sideBySide">Side by Side</option>
              <option value="timeline">Timeline</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Typography Configuration */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Typography</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title Font</label>
            <select 
              className="w-full p-2 border rounded"
              value={config.typography.titleFont}
              onChange={(e) => handleTypographyChange('titleFont', e.target.value)}
            >
              {fontOptions.map(font => (
                <option key={font.value} value={font.value}>{font.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Body Font</label>
            <select 
              className="w-full p-2 border rounded"
              value={config.typography.bodyFont}
              onChange={(e) => handleTypographyChange('bodyFont', e.target.value)}
            >
              {fontOptions.map(font => (
                <option key={font.value} value={font.value}>{font.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Title Size</label>
            <select 
              className="w-full p-2 border rounded"
              value={config.typography.titleSize}
              onChange={(e) => handleTypographyChange('titleSize', e.target.value)}
            >
              <option value="1.5rem">Small</option>
              <option value="2.5rem">Medium</option>
              <option value="3.5rem">Large</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Body Size</label>
            <select 
              className="w-full p-2 border rounded"
              value={config.typography.bodySize}
              onChange={(e) => handleTypographyChange('bodySize', e.target.value)}
            >
              <option value="0.875rem">Small</option>
              <option value="1rem">Medium</option>
              <option value="1.125rem">Large</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeddingTemplateConfigurator;