import {
  StoreMiddleware, Store, ICreateStoreOptions, Reducer,
} from "./interfaces";
import { reassign } from "./utils";
import { createStore } from "./createStore";

interface IInternalCreateStoreOptions<TState> {
  init: TState;
  middlewaresBefore: StoreMiddleware<Store<TState>>[];
  middlewaresAfter: StoreMiddleware<Store<TState>>[];
}

const createDefaultOptions = <TState>(
  defaultState: TState | (() => TState)
): IInternalCreateStoreOptions<TState> => ({
  init: typeof defaultState === "function" ? defaultState() : defaultState,
  middlewaresBefore: [],
  middlewaresAfter: [],
});

const getOptions = <TState>(
  defaultState: TState | (() => TState),
  options?: ICreateStoreOptions<TState>
): IInternalCreateStoreOptions<TState> => {
  const defaultOptions = createDefaultOptions(defaultState);
  const result = reassign(defaultOptions, options);
  return result!;
};

export const defineStore =
  <TState, TStore extends Store<TState>>(
    reducer: Reducer<TState>,
    defaultState: TState | (() => TState),
    ...middlewares: StoreMiddleware<Store<TState>>[]
  ) =>
    (options?: ICreateStoreOptions<TState>) => {
      const opts = getOptions(defaultState, options);
      const store = createStore<TState, TStore>(
        reducer,
        opts.init,
        ...opts.middlewaresBefore,
        ...middlewares,
        ...opts.middlewaresAfter,
      );
      return store;
    };
