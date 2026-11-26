import { act, renderHook } from '@testing-library/react-hooks';
import useQueue from '../src/useQueue';

const setUp = (initialQueue?: any[]) => renderHook(() => useQueue(initialQueue));

it('takes initial state', () => {
  const { result } = setUp([1, 2, 3]);
  const { first, last, size } = result.current;
  expect(first).toEqual(1);
  expect(last).toEqual(3);
  expect(size).toEqual(3);
});

it('appends new member', () => {
  const { result } = setUp([1, 2]);
  act(() => {
    result.current.add(3);
  });
  const { first, last, size } = result.current;
  expect(first).toEqual(1);
  expect(last).toEqual(3);
  expect(size).toEqual(3);
});

it('pops oldest member', () => {
  const { result } = setUp([1, 2]);
  act(() => {
    result.current.remove();
  });
  const { first, size } = result.current;
  expect(first).toEqual(2);
  expect(size).toEqual(1);
});

it('returns each removed item synchronously when updates are batched', () => {
  const { result } = setUp([1, 2, 3]);
  const removed: number[] = [];

  act(() => {
    removed.push(result.current.remove());
    removed.push(result.current.remove());
  });

  expect(removed).toEqual([1, 2]);
  expect(result.current.first).toBe(3);
  expect(result.current.size).toBe(1);
});

it('returns a just-added item in the same batch', () => {
  const { result } = setUp();
  let removed: number | undefined;

  act(() => {
    result.current.add(42);
    removed = result.current.remove();
  });

  expect(removed).toBe(42);
  expect(result.current.size).toBe(0);
});

it('returns undefined when removing from an empty queue', () => {
  const { result } = setUp();
  act(() => {
    expect(result.current.remove()).toBeUndefined();
  });
  expect(result.current.size).toBe(0);
});
