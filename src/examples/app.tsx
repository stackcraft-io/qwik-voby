/** @jsxImportSource voby */

import { qwikify$ } from '../voby/qwikify';
import { observable } from '../index.qwik';

export const App = qwikify$(() => {
  const count = observable(0);
  const increment = () => count((i) => i + 1);
  const decrement = () => count((i) => i - 1);

  return (
    <>
      <div>Hello, this is simple Voby counter</div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </>
  );
});
