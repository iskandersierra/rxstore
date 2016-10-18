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
  previousState: TState;
}

export interface StoreActionsMap {
  [actionKey: string]: Action | ((payload: any) => Action);
}

export type Effect = Observable<Action>;

export type EffectsDisposer = () => void;

export interface Store<TState> {
  action$: Observable<Action>;
  state$: Observable<TState>;
  update$: Observable<StateUpdate<TState>>;
  getState(): TState;
  dispatch(action: Action): void;
}
