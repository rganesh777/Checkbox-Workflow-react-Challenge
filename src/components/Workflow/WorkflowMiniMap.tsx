import { MiniMap } from '@xyflow/react';

export const WorkflowMiniMap = () => {
  return (
    <MiniMap
      style={{ backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
      nodeColor={(node) => {
        switch (node.type) {
          case 'start':
            return '#10b981';
          case 'form':
            return '#3b82f6';
          case 'conditional':
            return '#f59e0b';
          case 'api':
            return '#a855f7';
          case 'end':
            return '#ef4444';
          default:
            return '#6b7280';
        }
      }}
    />
  );
};
