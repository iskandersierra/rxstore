import { Reducer, ReducersMap } from "./interfaces";

export const createReducerFromMap =
  <TState>(map: ReducersMap<TState>): Reducer<TState> =>
    (state, action) => {
      const reducer = map[action.type];
      if (typeof reducer === "undefined") {
        return state;
      }
      if (typeof reducer === "function") {
        return (reducer as Reducer<TState>)(state, action);
      }
      return reducer as TState;
    };
