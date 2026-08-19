# Upgrading

## To 4.0

The table is a plain class now. It was a `Resource` from `ember-modify-based-class-resource`, and that package is no longer a dependency.

Two applications that each bundled a copy of `ember-modify-based-class-resource` crashed with `type may not overlap with an existing usable`. That failure is gone.

### `headlessTable` needs a parent object

Pass the object that owns the table as the first argument. The table is destroyed with that object, and it uses that object's owner.

```js
// before
class MyImplementation {
  @use table = headlessTable({
    columns: () => [],
    data: () => [],
  });
}

// after
class MyImplementation {
  table = headlessTable(this, {
    columns: () => [],
    data: () => [],
  });
}
```

The two-argument form did not change. If you already write `headlessTable(this, { ... })`, you have no work to do.

### The scroll position is no longer reset for you

The table reset the scroll container to the top every time the configuration changed. It does not do this now.

If you want that behavior, call `table.resetScrollContainer()` from your own code.

### `table.args` is gone

Read `table.config` instead. It returns the options object that you passed to `headlessTable`.
