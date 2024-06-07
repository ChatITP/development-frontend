import React, { useCallback } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  Connection,
  Edge,
  Node,
  useEdgesState,
  useNodesState,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import Sidebar from './NodeSidebar';
import { useDrop } from 'react-dnd';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const nodeTypes: NodeTypes = {
  chatInputNode: CustomNode,
  promptNode: CustomNode,
  modelNode: CustomNode,
  chatOutputNode: CustomNode,
  textOutputNode: CustomNode,

};

const FlowCanvas: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const handleNodeChange = (id: string, data: any) => {
    setNodes((nds) => nds.map((node) => (node.id === id ? { ...node, data } : node)));
  };

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'node',
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      const nodeId = `${item.type}-${Date.now()}`;
      const newNode: Node = {
        id: nodeId,
        type: item.type,
        position: { x: offset?.x || 0, y: offset?.y || 0 },
        data: {
          ...item.data,
          onChange: handleNodeChange,
        },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  const setDropRef = useCallback(
    (element: HTMLDivElement | null) => {
      if (element) {
        drop(element);
      }
    },
    [drop]
  );

  return (
    <div className="flex">
      <Sidebar />
      <div ref={setDropRef} style={{ width: '100%', height: '90vh' }} className="relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowCanvas;



