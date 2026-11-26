import useGetSet from './useGetSet';

export interface QueueMethods<T> {
  add: (item: T) => void;
  remove: () => T;
  first: T;
  last: T;
  size: number;
}

const useQueue = <T>(initialValue: T[] = []): QueueMethods<T> => {
  const [get, set] = useGetSet(initialValue);
  return {
    add: (value) => {
      set((queue) => [...queue, value]);
    },
    remove: () => {
      const [first, ...rest] = get();
      set(rest);
      return first;
    },
    get first() {
      return get()[0];
    },
    get last() {
      const queue = get();
      return queue[queue.length - 1];
    },
    get size() {
      return get().length;
    },
  };
};

export default useQueue;
