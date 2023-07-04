import { $, useOn, useOnDocument, useSignal } from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';
import { createContext, createElement, useContext } from 'voby';
import type { QwikifyOptions, QwikifyProps } from './types';

interface SlotState {
  el?: Element;
  scopeId: string;
  attachedEl?: Element;
}
const SlotCtx = createContext<SlotState>({ scopeId: '' });

export function main(slotEl: Element | undefined, scopeId: string, RootCmp: any, props: any) {
  const newProps = getVobyProps(props);
  return mainExactProps(slotEl, scopeId, RootCmp, newProps);
}

export function mainExactProps(
  slotEl: Element | undefined,
  scopeId: string,
  RootCmp: any,
  props: any
) {
  return createElement(SlotCtx.Provider, {
    value: {
      el: slotEl,
      scopeId,
      attachedEl: undefined,
    },
    children: createElement(RootCmp, {
      ...props,
      children: createElement(SlotElement, null),
    }),
  });
}
const SlotElement = () => {
  const context = useContext(SlotCtx);
  // @ts-expect-error since q-slotc is not a standard element, we will get error
  return createElement('q-slotc', {
    class: context.scopeId,
    suppressHydrationWarning: true,
    dangerouslySetInnerHTML: { __html: '<!--SLOT-->' },
    ref: (slot: HTMLElement) => {
      const { attachedEl, el } = context;
      if (el) {
        if (!attachedEl) {
          slot.appendChild(el);
        } else if (attachedEl !== slot) {
          throw new Error('already attached');
        }
      }
    },
  });
};

export const getVobyProps = (props: Record<string, any>): Record<string, any> => {
  const obj: Record<string, any> = {};
  Object.keys(props).forEach((key) => {
    if (!key.startsWith(HOST_PREFIX)) {
      const normalizedKey = key.endsWith('$') ? key.slice(0, -1) : key;
      obj[normalizedKey] = props[key];
    }
  });
  return obj;
};

export const getHostProps = (props: Record<string, any>): Record<string, any> => {
  const obj: Record<string, any> = {};
  Object.keys(props).forEach((key) => {
    if (key.startsWith(HOST_PREFIX)) {
      obj[key.slice(HOST_PREFIX.length)] = props[key];
    }
  });
  return obj;
};

export const useWakeupSignal = (props: QwikifyProps<{}>, opts: QwikifyOptions = {}) => {
  const signal = useSignal(false);
  const activate = $(() => (signal.value = true));
  if (isServer) {
    // voby component is client-only
    useOnDocument('qinit', activate);
  }
  return [signal, activate] as const;
};

const HOST_PREFIX = 'host:';
