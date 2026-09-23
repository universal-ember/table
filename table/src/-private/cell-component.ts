import type {
  ComponentReturn,
  FlattenBlockParams,
  Invoke,
} from '@glint/template/-private/integration';
import type {
  ComponentSignatureArgs,
  ComponentSignatureBlocks,
  ComponentSignatureElement,
  InvokableArgs,
} from '@glint/template/-private/signature';

/**
 * A component rendered as a cell, invoked the way `ComponentLike` is.
 *
 * `[Invoke]` is a method here, where `ComponentLike` declares it as a property.
 * TypeScript compares the parameters of a method bivariantly, so a column whose
 * Cell asks for args fits a `Column<DataType>` that names none, while the args
 * are still checked where the Cell is rendered.
 *
 * With a property, those two cannot both hold: the args of a property function
 * are contravariant, so the only way to make such a column fit is `any`, which
 * stops the Cell being checked at all.
 */
export type CellComponent<S = unknown> = abstract new (...args: any) => {
  [Invoke](
    ...args: InvokableArgs<ComponentSignatureArgs<S>>
  ): ComponentReturn<
    FlattenBlockParams<ComponentSignatureBlocks<S>>,
    ComponentSignatureElement<S>
  >;
};
