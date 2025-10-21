import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Card, CardContent } from '../ui/card';

/**
 * Memory-Efficient Virtual Scrolling List
 * Only renders visible items to prevent memory issues with large datasets
 */

interface VirtualScrollListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number; // Extra items to render outside viewport
}

export function VirtualScrollList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className = '',
  overscan = 3
}: VirtualScrollListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);
  
  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);
  
  // Get visible items
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [items, visibleRange]);
  
  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);
  
  // Calculate total height and offset
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.startIndex * itemHeight;
  
  return (
    <div
      ref={scrollElementRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map((item, index) => (
            <div key={visibleRange.startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, visibleRange.startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Memory-optimized list item component
export const MemoryOptimizedListItem = React.memo(({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) => (
  <Card className={`ff-card-compact transition-colors hover:bg-muted/50 ${className}`}>
    <CardContent className="p-3">
      {children}
    </CardContent>
  </Card>
));

// Example usage component for tools/projects
export const VirtualToolsList = React.memo(({ 
  tools,
  onToolSelect 
}: {
  tools: Array<{ id: string; name: string; description: string; icon: string }>;
  onToolSelect: (toolId: string) => void;
}) => {
  const renderTool = useCallback((tool: any, index: number) => (
    <MemoryOptimizedListItem>
      <div className="flex items-center gap-3">
        <span className="text-lg">{tool.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{tool.name}</h3>
          <p className="text-xs text-muted-foreground truncate">{tool.description}</p>
        </div>
        <button
          onClick={() => onToolSelect(tool.id)}
          className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:opacity-80 transition-opacity"
        >
          Use
        </button>
      </div>
    </MemoryOptimizedListItem>
  ), [onToolSelect]);
  
  return (
    <VirtualScrollList
      items={tools}
      itemHeight={72}
      containerHeight={400}
      renderItem={renderTool}
      className="border rounded-lg"
    />
  );
});

export default VirtualScrollList;