import { useCallback, useEffect, useMemo, useState } from 'react';
import { db } from '@/lib/db';
import type { Task } from '@/types';
import { getTasks, completeTask as libCompleteTask, createTask as libCreateTask, deleteTask as libDeleteTask } from '@/lib/notifications';
import { useGardenStore, addEntityToGarden, removeEntityFromGarden, getGardenEntities } from '@/store/garden-store';
import { useOrderStore } from '@/store/order-store';

interface UseTasksResult {
  tasks: Task[];
  loading: boolean;
  completeTask: (taskId: number) => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<number>;
  deleteTask: (taskId: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useTasks(filter?: 'today' | 'week' | 'overdue' | 'completed', sortBy?: 'priority' | 'dueDate' | 'type'): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const activeGardenId = useGardenStore((s) => s.activeGardenId);
  const taskOrder = useOrderStore((s) => s.taskOrder);
  const addTaskId = useOrderStore((s) => s.addTaskId);
  const removeTaskId = useOrderStore((s) => s.removeTaskId);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTasks(filter ?? 'today');
      let filtered = data;
      if (activeGardenId) {
        const entities = getGardenEntities(activeGardenId);
        filtered = data.filter((t) => entities.taskIds.includes(t.id!));
      }
      setTasks(filtered);
    } finally {
      setLoading(false);
    }
  }, [filter, activeGardenId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const sortedTasks = useMemo(() => {
    if (!sortBy || sortBy === 'dueDate') {
      return [...tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }
    if (sortBy === 'type') {
      return [...tasks].sort((a, b) => a.type.localeCompare(b.type));
    }
    if (sortBy === 'priority') {
      const orderMap = new Map(taskOrder.map((id, idx) => [id, idx]));
      return [...tasks].sort((a, b) => {
        const aIdx = orderMap.get(a.id!);
        const bIdx = orderMap.get(b.id!);
        if (aIdx !== undefined && bIdx !== undefined) return aIdx - bIdx;
        if (aIdx !== undefined) return -1;
        if (bIdx !== undefined) return 1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    }
    return tasks;
  }, [tasks, sortBy, taskOrder]);

  const handleCompleteTask = useCallback(async (taskId: number) => {
    await libCompleteTask(taskId);
    await refresh();
  }, [refresh]);

  const handleCreateTask = useCallback(async (task: Omit<Task, 'id' | 'createdAt'>) => {
    const id = await libCreateTask(task);
    const gardenId = useGardenStore.getState().activeGardenId ?? 'default';
    addEntityToGarden(gardenId, 'taskIds', id);
    addTaskId(id);
    await refresh();
    return id;
  }, [refresh, addTaskId]);

  const handleDeleteTask = useCallback(async (taskId: number) => {
    await libDeleteTask(taskId);
    const gardenId = useGardenStore.getState().activeGardenId ?? 'default';
    removeEntityFromGarden(gardenId, 'taskIds', taskId);
    removeTaskId(taskId);
    await refresh();
  }, [refresh, removeTaskId]);

  return {
    tasks: sortedTasks,
    loading,
    completeTask: handleCompleteTask,
    createTask: handleCreateTask,
    deleteTask: handleDeleteTask,
    refresh,
  };
}
