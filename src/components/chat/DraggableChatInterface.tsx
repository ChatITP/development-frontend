import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDrag } from 'react-dnd';
import ChatInterface from '@/components/chat/ChatInterface';

interface DraggableChatInterfaceProps {
  initialX: number;
  initialY: number;
  isSelected: boolean;
  onClick: () => void;
}

const DraggableChatInterface: React.FC<DraggableChatInterfaceProps> = ({
  initialX,
  initialY,
  isSelected,
  onClick,
}) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const isDraggingRef = useRef(false);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'chatInterface',
      item: { id: 'chatInterface', ...position },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [position],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDraggingRef.current = true;
      const startX = e.clientX - position.x;
      const startY = e.clientY - position.y;

      const handleMouseMove = (e: MouseEvent) => {
        if (isDraggingRef.current) {
          setPosition({
            x: e.clientX - startX,
            y: e.clientY - startY,
          });
        }
      };

      const handleMouseUp = () => {
        isDraggingRef.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [position],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onClick();
    },
    [onClick],
  );

  const combineRefs = useCallback(
    (instance: HTMLDivElement | null) => {
      drag(instance);
    },
    [drag],
  );

  return (
    <div
      ref={combineRefs}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        zIndex: 1,
        border: isSelected ? '2px solid #38bdf8' : 'none',
        borderRadius: '0.5rem',
        overflow: 'hidden',
      }}
      className={`${isSelected ? 'shadow-lg' : ''}`}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <ChatInterface />
    </div>
  );
};

export default DraggableChatInterface;
