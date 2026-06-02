import { db } from '@/lib/db';
import type { Plant, Task, TaskType } from '@/types';
import { addDays, startOfDay, endOfDay, startOfWeek, endOfWeek, isBefore } from 'date-fns';

export async function getTasks(filter: 'today' | 'week' | 'overdue' | 'completed'): Promise<Task[]> {
  const now = new Date();

  switch (filter) {
    case 'today': {
      const s = startOfDay(now);
      const e = endOfDay(now);
      return db.tasks
        .where('completed')
        .equals(0)
        .and((t) => t.dueDate >= s && t.dueDate <= e)
        .sortBy('dueDate');
    }
    case 'week': {
      const s = startOfWeek(now, { weekStartsOn: 1 });
      const e = endOfWeek(now, { weekStartsOn: 1 });
      return db.tasks
        .where('completed')
        .equals(0)
        .and((t) => t.dueDate >= s && t.dueDate <= e)
        .sortBy('dueDate');
    }
    case 'overdue': {
      const s = startOfDay(now);
      return db.tasks
        .where('completed')
        .equals(0)
        .and((t) => t.dueDate < s)
        .sortBy('dueDate');
    }
    case 'completed': {
      return db.tasks.where('completed').equals(1).reverse().sortBy('completedAt');
    }
    default:
      return db.tasks.toArray();
  }
}

export async function completeTask(taskId: number): Promise<void> {
  await db.transaction('rw', db.tasks, async () => {
    const task = await db.tasks.get(taskId);
    if (!task) return;

    const now = new Date();
    await db.tasks.update(taskId, {
      completed: true,
      completedAt: now,
    });

    if (task.recurring?.intervalDays && task.recurring.intervalDays > 0) {
      const nextDue = addDays(now, task.recurring.intervalDays);
      await db.tasks.add({
        plantId: task.plantId,
        spaceId: task.spaceId,
        type: task.type,
        title: task.title,
        description: task.description,
        dueDate: nextDue,
        completed: false,
        recurring: task.recurring,
        createdAt: now,
      });
    }
  });
}

export async function createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<number> {
  const now = new Date();
  return db.tasks.add({
    ...task,
    createdAt: now,
  });
}

export async function deleteTask(taskId: number): Promise<void> {
  await db.tasks.delete(taskId);
}

export async function generateTasksForPlant(plant: Plant): Promise<void> {
  const now = new Date();
  const tasksToCreate: Omit<Task, 'id' | 'createdAt'>[] = [];

  const waterInterval = getWaterInterval(plant);
  const feedInterval = getFeedInterval(plant);
  const pruneInterval = getPruneInterval(plant);

  // Water task
  tasksToCreate.push({
    plantId: plant.id,
    spaceId: plant.spaceId,
    type: 'water',
    title: `Water ${plant.name}`,
    description: `Check soil moisture and water ${plant.name}${plant.variety ? ` (${plant.variety})` : ''}.`,
    dueDate: addDays(now, 1),
    completed: false,
    recurring: { intervalDays: waterInterval },
  });

  // Feed task
  tasksToCreate.push({
    plantId: plant.id,
    spaceId: plant.spaceId,
    type: 'feed',
    title: `Feed ${plant.name}`,
    description: `Apply nutrients for ${plant.name}.`,
    dueDate: addDays(now, feedInterval),
    completed: false,
    recurring: { intervalDays: feedInterval },
  });

  // Prune task (if applicable)
  if (pruneInterval > 0) {
    tasksToCreate.push({
      plantId: plant.id,
      spaceId: plant.spaceId,
      type: 'prune',
      title: `Prune ${plant.name}`,
      description: `Inspect and prune ${plant.name} for healthy growth.`,
      dueDate: addDays(now, pruneInterval),
      completed: false,
      recurring: { intervalDays: pruneInterval },
    });
  }

  // Transplant task for seedlings
  const daysSincePlanted = Math.floor((now.getTime() - new Date(plant.plantedDate).getTime()) / (1000 * 60 * 60 * 24));
  if (daysSincePlanted < 14 && plant.growingMethod !== 'hydroponic') {
    tasksToCreate.push({
      plantId: plant.id,
      spaceId: plant.spaceId,
      type: 'transplant',
      title: `Transplant ${plant.name}`,
      description: `Prepare to transplant ${plant.name} when seedlings are sturdy.`,
      dueDate: addDays(now, 14 - daysSincePlanted),
      completed: false,
    });
  }

  await db.tasks.bulkAdd(tasksToCreate.map(t => ({ ...t, createdAt: new Date() })));
}

function getWaterInterval(plant: Plant): number {
  switch (plant.growingMethod) {
    case 'hydroponic':
    case 'aeroponic':
    case 'aquaponic':
      return 1;
    case 'soil':
    default:
      return 2;
  }
}

function getFeedInterval(plant: Plant): number {
  switch (plant.growingMethod) {
    case 'hydroponic':
    case 'aeroponic':
      return 7;
    case 'aquaponic':
      return 14;
    case 'soil':
    default:
      return 10;
  }
}

function getPruneInterval(plant: Plant): number {
  const pruneCategories = new Set(['vegetable', 'fruit', 'ornamental']);
  if (!pruneCategories.has(plant.category)) return 0;

  switch (plant.growingMethod) {
    case 'hydroponic':
    case 'aeroponic':
      return 10;
    case 'soil':
    default:
      return 14;
  }
}
