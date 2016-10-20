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

export interface ReducersMap<TState> {
  [actionType: string]: Reducer<TState> | TState;
}

export interface StateUpdate<TState> {
  state: TState;
  action: Action;
}

export interface StoreActionsMap {
  [actionKey: string]: Action | ((payload: any) => Action);
}

export type Effect = Observable<Action>;

export interface Store<TState> {
  action$: Observable<Action>;
  state$: Observable<TState>;
  update$: Observable<StateUpdate<TState>>;
  dispatch(action: Action): void;
}

export type ActionMap = (a: Action) => Action;
export type ActionMapping = {
  [name: string]: boolean | ActionMap;
};
export interface ActionTunnel {
  dispatch: Dispatcher;
  actions: "all" | string[] | ActionMap | ActionMapping;
};
export type StoreExtension<TState> =
  (store: Store<TState>) => Object;

export type EffectsFactory<TStore> =
  (store: TStore) => void;

export type StoreMiddleware<TStore> = (store: TStore) => TStore;

export type EmptyReducer<TState> = (state: TState) => TState;

export type TypedReducer<TState, TPayload> =
  (state: TState, payload: TPayload) => TState;

export interface EmptyActionInstance<TState> {
  kind: "empty";
  type: string;
  create: () => Action;
  dispatchOn: (dispatch: Dispatcher) => void;
  reducer: EmptyReducer<TState> | undefined;
}

export interface TypedActionInstance<TState, TPayload> {
  kind: "typed";
  type: string;
  create: (payload: TPayload) => Action;
  dispatchOn: (payload: TPayload, dispatch: Dispatcher) => void;
  reducer: TypedReducer<TState, TPayload> | undefined;
}

export interface ActionCreator<TState> {
  (type: string, reducer?: EmptyReducer<TState>): EmptyActionInstance<TState>;

  of<T>(type: string, reducer?: TypedReducer<TState, T>): TypedActionInstance<TState, T>;
}

export interface ActionInstanceMapping<TState> {
  [type: string]: EmptyActionInstance<TState> | TypedActionInstance<TState, any>;
}
