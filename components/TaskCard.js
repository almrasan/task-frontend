import { Draggable } from '@hello-pangea/dnd';

export default function TaskCard({ task, index, currentUser, onAssignToSelf }) {
  const canAssign = !task.assignedTo && currentUser?.role !== 'admin';

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <div
          className="card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <strong>{task.title}</strong>
          {task.description && <p style={{ margin: '4px 0' }}>{task.description}</p>}
          <small>Creator: {task.creator?.name || 'Unknown'}</small>
          <small>Assigned: {task.assignedTo ? task.assignedTo.name : 'Unassigned'}</small>
          {canAssign && (
            <button style={{ marginTop: 6 }} onClick={() => onAssignToSelf(task._id)}>
              Assign to me
            </button>
          )}
        </div>
      )}
    </Draggable>
  );
}
