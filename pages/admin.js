import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import Board from '../components/Board';

export default function Admin() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/');
      else if (user.role !== 'admin') router.push('/dashboard');
    }
  }, [loading, user, router]);

  const loadData = async () => {
    const [taskRes, userRes] = await Promise.all([api.get('/tasks'), api.get('/users')]);
    setTasks(taskRes.data.tasks);
    setUsers(userRes.data.users);
  };

  useEffect(() => {
    if (user?.role === 'admin') loadData();
  }, [user]);

  const handleStatusChange = async (taskId, status) => {
    setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status } : t)));
    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
    } catch (err) {
      loadData();
    }
  };

  const handleReassign = async (taskId, userId) => {
    await api.patch(`/tasks/${taskId}/assign`, { userId: userId || null });
    loadData();
  };

  if (loading || !user || user.role !== 'admin') return null;

  return (
    <div>
      <div className="topbar">
        <span>Admin Dashboard — {user.name}</span>
        <button onClick={logout}>Log out</button>
      </div>

      <Board tasks={tasks} currentUser={user} onStatusChange={handleStatusChange} onAssignToSelf={() => {}} />

      <h3 style={{ margin: '24px 24px 8px' }}>All tasks — reassign</h3>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Creator</th>
            <th>Assigned To</th>
            <th>Reassign</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t._id}>
              <td>{t.title}</td>
              <td>{t.status}</td>
              <td>{t.creator?.name}</td>
              <td>{t.assignedTo ? t.assignedTo.name : 'Unassigned'}</td>
              <td>
                <select
                  value={t.assignedTo?._id || ''}
                  onChange={(e) => handleReassign(t._id, e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ margin: '24px 24px 8px' }}>All users</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
