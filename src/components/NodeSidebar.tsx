import React, { useCallback } from 'react';
import { useDrag } from 'react-dnd';
import { nodeTypes } from './nodeTypes';

const Sidebar: React.FC = () => {
  return (
    <div className="p-4 bg-neutral-50 w-64 border-r">
      {Object.values(nodeTypes).map((node) => (
        <DraggableNode key={node.type} node={node} />
      ))}
    </div>
  );
};

const DraggableNode: React.FC<{ node: any }> = ({ node }) => {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'node',
    item: node,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const setDragRef = useCallback(
    (element: HTMLDivElement | null) => {
      if (element) {
        drag(element);
      }
    },
    [drag]
  );

  return (
    <div ref={setDragRef} className={`p-2 mb-2 bg-white rounded-lg border border-neutral-200 ${isDragging ? 'opacity-50' : ''}`}>
      {node.label}
    </div>
  );
};

export default Sidebar;


