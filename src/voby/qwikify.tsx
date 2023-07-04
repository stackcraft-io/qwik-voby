import {
  RenderOnce,
  SkipRender,
  Slot,
  component$,
  implicit$FirstArg,
  noSerialize,
  useSignal,
  useStylesScoped$,
  useTask$,
  type NoSerialize,
  type QRL,
} from '@builder.io/qwik';

import { isBrowser } from '@builder.io/qwik/build';
import * as client from './client';
import { getHostProps, main, useWakeupSignal } from './slot';
import type { FunctionComponent, Internal, QwikifyOptions, QwikifyProps } from './types';

export function qwikifyQrl<PROPS extends {}>(
  vobyCmp$: QRL<FunctionComponent<PROPS & { children?: any }>>,
  opts?: QwikifyOptions
) {
  return component$((props: QwikifyProps<PROPS>) => {
    const { scopeId } = useStylesScoped$(
      `q-slot{display:none} q-slotc,q-slotc>q-slot{display:contents}`
    );
    const hostRef = useSignal<Element>();
    const slotRef = useSignal<Element>();
    const internalState = useSignal<NoSerialize<Internal<PROPS>>>();
    const [signal] = useWakeupSignal(props, opts);
    const TagName = opts?.tagName ?? ('qwik-voby' as any);

    // Task takes cares of updates and partial hydration
    useTask$(async ({ track }) => {
      const trackedProps = track(() => ({ ...props }));
      track(signal);

      if (!isBrowser) {
        return;
      }

      // Update
      if (internalState.value) {
        if (internalState.value.root) {
          client.render(
            main(slotRef.value, scopeId, internalState.value.cmp, trackedProps),
            internalState.value.root
          );
        }
      } else {
        const Cmp = await vobyCmp$.resolve();
        const hostElement = hostRef.value;
        if (hostElement) {
          if (signal.value === false) {
            client.render(main(slotRef.value, scopeId, Cmp, trackedProps), hostElement);
          }
        }

        internalState.value = noSerialize({
          cmp: Cmp,
          root: hostElement,
        });
      }
    });

    return (
      <RenderOnce>
        <TagName
          {...getHostProps(props)}
          ref={(el: Element) => {
            if (isBrowser) {
              queueMicrotask(() => {
                const internalData = internalState.value;
                if (internalData && !internalData.root) {
                  client.render(main(slotRef.value, scopeId, internalData.cmp, props), el);
                }
              });
            } else {
              hostRef.value = el;
            }
          }}
        >
          {SkipRender}
        </TagName>
        <q-slot ref={slotRef}>
          <Slot></Slot>
        </q-slot>
      </RenderOnce>
    );
  });
}

export const qwikify$ = /*#__PURE__*/ implicit$FirstArg(qwikifyQrl);
