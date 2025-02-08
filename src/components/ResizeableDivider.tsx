import React, { useCallback, useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ResizeableDivider: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    const leftPanel = document.querySelector('.left-panel') as HTMLElement;
    setStartWidth(leftPanel?.offsetWidth || 0);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const container = document.querySelector('.content-container') as HTMLElement;
    const leftPanel = document.querySelector('.left-panel') as HTMLElement;
    if (!container || !leftPanel) return;
    
    const deltaX = e.clientX - startX;
    const newWidth = Math.min(
      Math.max(startWidth + deltaX, container.offsetWidth * 0.2), // 最小20%
      container.offsetWidth * 0.8 // 最大80%
    );
    
    leftPanel.style.width = `${newWidth}px`;
  }, [isDragging, startX, startWidth]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove]);

  return (
    <div 
      className={`w-1 mx-4 cursor-col-resize transition-colors ${
        isDarkMode ? 
          'bg-[#303030] hover:bg-[#177ddc]' : 
          'bg-gray-200 hover:bg-[#1890ff]'
      } ${isDragging ? 'bg-[#177ddc]' : ''}`}
      onMouseDown={handleMouseDown}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
       
      </div>
    </div>
  );
};

export default ResizeableDivider; 