import type { Destructor, FunctionModifier } from '#interfaces';

export function composeFunctionModifiers<Args extends unknown[]>(
  modifiers: Array<FunctionModifier<Args> | undefined>
) {
  const setup = modifiers.filter(Boolean) as FunctionModifier<Args>[];

  const composed = (element: HTMLElement, ...args: Args) => {
    const destructors = setup.map((fn) => fn(element, ...args)).filter(Boolean) as Destructor[];

    return () => {
      for (const destructor of destructors) {
        destructor();
      }
    };
  };

  return composed;
}
