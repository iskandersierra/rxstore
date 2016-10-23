import { ActionDescriptionMapping, Store, StoreMiddleware } from "./interfaces";
import { extendWith } from "./extendWith";

export function extendWithActions<TState>(
  actions: ActionDescriptionMapping<TState>
) {
  const extender = (store: Store<TState>) => {
    let mapping = {};
    Object.keys(actions)
      .forEach(key => {
        const action = actions[key];
        if (action.kind === "empty") {
          mapping[key] = (() => action.dispatchOn(store.dispatch));
        } else {
          mapping[key] = ((payload: any) => action.dispatchOn(payload, store.dispatch));
        }
      });
    return mapping;
  };
  return extendWith(extender);
}
