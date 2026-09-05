import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import Board from '../components/Board';

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/');
  }, [loading, user, router]);

  const loadTasks = async () => {
    const res = await api.get('/tasks');
    setTasks(res.data.tasks);
  };

  useEffect(() => {
    if (user) loadTasks();
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await api.post('/tasks', { title, description });
    setTitle('');
    setDescription('');
    loadTasks();
  };

  const handleStatusChange = async (taskId, status) => {
    setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status } : t)));
    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
    } catch (err) {
      loadTasks(); // revert on failure
    }
  };

  const handleAssignToSelf = async (taskId) => {
    await api.patch(`/tasks/${taskId}/assign`, { userId: user.id });
    loadTasks();
  };

  if (loading || !user) return null;

  return (
    <div>
      <div className="topbar">
        <span>Task Board — {user.name}</span>
        <button onClick={logout}>Log out</button>
      </div>
      <form className="new-task" onSubmit={handleCreate}>
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add task</button>
      </form>
      <Board
        tasks={tasks}
        currentUser={user}
        onStatusChange={handleStatusChange}
        onAssignToSelf={handleAssignToSelf}
      />
    </div>
  );
}
