import { Observable } from "rxjs/Observable";

export interface Action {
  type: string;
  payload?: any;
}

export interface Dispatcher {
  (action: Action): void;
}

export interface Reducer<TState> {
  (state: TState, action: Action): TState;
}

export interface StateUpdate<TState> {
  state: TState;
  action: Action;
}

export interface Store<TState> {
  action$: Observable<Action>;
  state$: Observable<TState>;
  update$: Observable<StateUpdate<TState>>;
  dispatch(action: Action): void;
  finish(): void;
}

export type ActionMapping = {
  [name: string]: boolean | ((a: Action) => Action);
};
export interface ActionTunnel {
  dispatch?: Dispatcher | Observable<Dispatcher>;
  dispatchFactory?: (store: Store<any>) => Dispatcher | Observable<Dispatcher>;
  actions: "all" | string[] | ((a: Action) => Action) | ActionMapping;
};

export type StoreMiddleware<TStore> = (store: TStore) => TStore;

export interface EmptyActionDescription<TState> {
  kind: "empty";
  type: string;
  (): Action;
  create: () => Action;
  dispatchOn: (dispatch: Dispatcher) => void;
  reducer?: (state: TState) => TState;
}

export interface TypedActionDescription<TState, TPayload> {
  kind: "typed";
  type: string;
  (payload: TPayload): Action;
  create: (payload: TPayload) => Action;
  dispatchOn: (payload: TPayload, dispatch: Dispatcher) => void;
  reducer?: (state: TState, payload: TPayload) => TState;
}

export interface ActionCreator<TState> {
  (type: string, reducer?: (state: TState) => TState): EmptyActionDescription<TState>;

  of<T>(type: string, reducer?: (state: TState, payload: T) => TState): TypedActionDescription<TState, T>;
}

export interface ActionDescriptionMapping<TState> {
  [type: string]: EmptyActionDescription<TState> | TypedActionDescription<TState, any>;
}

export interface ICreateStoreOptions<TState> {
  init?: TState;
  middlewaresBefore?: StoreMiddleware<Store<TState>>[];
  middlewaresAfter?: StoreMiddleware<Store<TState>>[];
}
