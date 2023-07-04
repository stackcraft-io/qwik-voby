import { component$, useStyles$ } from '@builder.io/qwik';
import { App } from './examples/app';

export const Root = component$(() => {
  useStyles$(`
   box {
    display: block;
    width: 200px;
    height: 200px;
    margin: 20px;
    background: blue;
  }
`);
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <title>Qwik Blank App</title>
      </head>
      <body>
        <box />
        <App />
      </body>
    </>
  );
});
