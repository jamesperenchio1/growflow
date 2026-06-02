import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface OrderState {
  taskOrder: number[];
  spaceOrder: number[];
  setTaskOrder: (order: number[]) => void;
  setSpaceOrder: (order: number[]) => void;
  moveTask: (fromIndex: number, toIndex: number) => void;
  moveSpace: (fromIndex: number, toIndex: number) => void;
  addTaskId: (id: number) => void;
  addSpaceId: (id: number) => void;
  removeTaskId: (id: number) => void;
  removeSpaceId: (id: number) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      taskOrder: [],
      spaceOrder: [],
      setTaskOrder: (order) => set({ taskOrder: order }),
      setSpaceOrder: (order) => set({ spaceOrder: order }),
      moveTask: (fromIndex, toIndex) =>
        set((state) => {
          const order = [...state.taskOrder];
          const [removed] = order.splice(fromIndex, 1);
          order.splice(toIndex, 0, removed);
          return { taskOrder: order };
        }),
      moveSpace: (fromIndex, toIndex) =>
        set((state) => {
          const order = [...state.spaceOrder];
          const [removed] = order.splice(fromIndex, 1);
          order.splice(toIndex, 0, removed);
          return { spaceOrder: order };
        }),
      addTaskId: (id) =>
        set((state) => {
          if (state.taskOrder.includes(id)) return state;
          return { taskOrder: [...state.taskOrder, id] };
        }),
      addSpaceId: (id) =>
        set((state) => {
          if (state.spaceOrder.includes(id)) return state;
          return { spaceOrder: [...state.spaceOrder, id] };
        }),
      removeTaskId: (id) =>
        set((state) => ({
          taskOrder: state.taskOrder.filter((taskId) => taskId !== id),
        })),
      removeSpaceId: (id) =>
        set((state) => ({
          spaceOrder: state.spaceOrder.filter((spaceId) => spaceId !== id),
        })),
    }),
    {
      name: 'growflow-order-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
