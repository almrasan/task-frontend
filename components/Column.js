import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

const LABELS = { todo: 'To Do', doing: 'Doing', done: 'Done' };

export default function Column({ status, tasks, currentUser, onAssignToSelf }) {
  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <div className="column" ref={provided.innerRef} {...provided.droppableProps}>
          <h3>
            {LABELS[status]} ({tasks.length})
          </h3>
          {tasks.map((task, index) => (
            <TaskCard
              key={task._id}
              task={task}
              index={index}
              currentUser={currentUser}
              onAssignToSelf={onAssignToSelf}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
