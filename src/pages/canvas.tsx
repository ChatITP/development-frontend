import React, { useState, useRef, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InfoIcon } from 'lucide-react';

const DraggableChatInterface = dynamic(
  () => import('@/components/chat/DraggableChatInterface'),
  { ssr: false },
);

const MAX_INTERFACES = 5;

const UsageInstructions: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="z-[1000]">
      <DialogHeader>
        <DialogTitle>Usage Instructions</DialogTitle>
        <DialogDescription>
          <ul className="list-disc pl-5 mt-2">
            <li>
              Double-click anywhere on the canvas to create a new chat interface
              (max 5)
            </li>
            <li>Click and drag to move a chat interface</li>
            <li>Click on a chat interface to select it</li>
            <li>Press Delete or Backspace to remove the selected interface</li>
            <li>Click outside any interface to deselect</li>
          </ul>
        </DialogDescription>
      </DialogHeader>
      <Button onClick={() => onOpenChange(false)}>Got it!</Button>
    </DialogContent>
  </Dialog>
);

const CanvasPage: React.FC = () => {
  const [interfaces, setInterfaces] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const [selectedInterfaceId, setSelectedInterfaceId] = useState<number | null>(
    null,
  );
  const [showInstructions, setShowInstructions] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (canvasRef.current && interfaces.length < MAX_INTERFACES) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newInterface = {
        id: Date.now(),
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      setInterfaces((prevInterfaces) => [...prevInterfaces, newInterface]);
    }
  };

  const handleInterfaceClick = useCallback((id: number) => {
    console.log('Interface clicked:', id);
    setSelectedInterfaceId(id);
    if (canvasRef.current) {
      canvasRef.current.focus();
    }
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      console.log('Key pressed:', event.key);
      console.log('Selected interface:', selectedInterfaceId);
      if (
        (event.key === 'Delete' || event.key === 'Backspace') &&
        selectedInterfaceId !== null
      ) {
        event.preventDefault();
        setInterfaces((prevInterfaces) =>
          prevInterfaces.filter(
            (chatInterface) => chatInterface.id !== selectedInterfaceId,
          ),
        );
        setSelectedInterfaceId(null);
        console.log('Interface deleted');
      }
    },
    [selectedInterfaceId],
  );

  const handleCanvasClick = useCallback((event: MouseEvent) => {
    if (canvasRef.current && event.target === canvasRef.current) {
      setSelectedInterfaceId(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleCanvasClick);
    return () => {
      document.removeEventListener('click', handleCanvasClick);
    };
  }, [handleCanvasClick]);

  return (
    <div
      ref={canvasRef}
      className="w-full h-full bg-gray-100 relative outline-none"
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{ minHeight: 'calc(100vh - 64px - 64px)' }}
    >
      <UsageInstructions
        open={showInstructions}
        onOpenChange={setShowInstructions}
      />
      {interfaces.map((interfaceProps) => (
        <DraggableChatInterface
          key={interfaceProps.id}
          initialX={interfaceProps.x}
          initialY={interfaceProps.y}
          isSelected={interfaceProps.id === selectedInterfaceId}
          onClick={() => handleInterfaceClick(interfaceProps.id)}
        />
      ))}
      <Button
        variant="outline"
        size="icon"
        className="absolute bottom-4 right-4"
        onClick={() => setShowInstructions(true)}
      >
        <InfoIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CanvasPage;
