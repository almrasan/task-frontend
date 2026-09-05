import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';

const STATUSES = ['todo', 'doing', 'done'];

export default function Board({ tasks, currentUser, onStatusChange, onAssignToSelf }) {
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;
    onStatusChange(draggableId, destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="board">
        {STATUSES.map((status) => (
          <Column
            key={status}
            status={status}
            tasks={tasks.filter((t) => t.status === status)}
            currentUser={currentUser}
            onAssignToSelf={onAssignToSelf}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
