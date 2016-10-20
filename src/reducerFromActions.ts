import { Action, Dispatcher, Reducer, ActionInstanceMapping } from "./interfaces";
import "object-assign";
import objectAssign = require("object-assign");

export function reducerFromActions<TState>(
  actions: ActionInstanceMapping<TState>
): Reducer<TState> {
  let typeMapping: any = {};
  Object.keys(actions).forEach(key =>
    typeMapping[actions[key].type] = actions[key]);
  return (state, action) => {
    const instance = typeMapping[action.type];
    if (!instance) { return state; }
    if (!instance.reducer) { return state; }
    const reducer: any = instance.reducer;
    return reducer(state, action.payload);
  };
}
