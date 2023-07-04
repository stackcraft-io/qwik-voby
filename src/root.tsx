import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { App } from './examples/app';

export const Root = component$(() => {
  const show = useSignal(true);
  useStyles$(`
    box {
      display: block;
      width: 200px;
      height: 200px;
      margin: 20px;
      background: blue;
    }
    main {
      padding: 12px;
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
        <main>
          <button onClick$={() => (show.value = !show.value)}>
            {show.value ? 'hidden' : 'show'}
          </button>
          {show.value ? <App /> : null}
        </main>
      </body>
    </>
  );
});
