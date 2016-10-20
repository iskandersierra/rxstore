import "object-assign";
import objectAssign = require("object-assign");
import { ActionInstanceMapping, Store, StoreMiddleware } from "./interfaces";
import { extendWith } from "./extendWith";

export function extendWithActions<TState>(
  actions: ActionInstanceMapping<TState>
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

export default extendWithActions;
