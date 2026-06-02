import { useCallback, useEffect, useState } from 'react';
import { db } from '@/lib/db';
import type { Task } from '@/types';
import { getTasks, completeTask as libCompleteTask, createTask as libCreateTask, deleteTask as libDeleteTask } from '@/lib/notifications';

interface UseTasksResult {
  tasks: Task[];
  loading: boolean;
  completeTask: (taskId: number) => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<number>;
  deleteTask: (taskId: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useTasks(filter?: 'today' | 'week' | 'overdue' | 'completed'): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTasks(filter ?? 'today');
      setTasks(data);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleCompleteTask = useCallback(async (taskId: number) => {
    await libCompleteTask(taskId);
    await refresh();
  }, [refresh]);

  const handleCreateTask = useCallback(async (task: Omit<Task, 'id' | 'createdAt'>) => {
    const id = await libCreateTask(task);
    await refresh();
    return id;
  }, [refresh]);

  const handleDeleteTask = useCallback(async (taskId: number) => {
    await libDeleteTask(taskId);
    await refresh();
  }, [refresh]);

  return {
    tasks,
    loading,
    completeTask: handleCompleteTask,
    createTask: handleCreateTask,
    deleteTask: handleDeleteTask,
    refresh,
  };
}
