import { Observable } from "rxjs/Observable";
import { queue } from "rxjs/scheduler/queue";
import "rxjs/add/operator/do";
import { StoreMiddleware, Action, Store, StateUpdate } from "./interfaces";
import { startEffectsOn } from "./startEffects";

const scheduler = queue;

export interface ILogUpdatesOptions<TState> {
  logger: (message: any, ...args: any[]) => void;
  caption?: string | ((update: StateUpdate<TState>) => string) | undefined;
  mapper?: ((update: StateUpdate<TState>) => any) | undefined;
}

export const logUpdates =
  <TState, TStore extends Store<TState>>(
    options: ILogUpdatesOptions<TState>
  ): StoreMiddleware<TStore> =>
    (store: TStore) => {
      const { logger, caption, mapper } = options;
      const capt = typeof caption === "function"
        ? caption
        : typeof caption === "string"
          ? (update: StateUpdate<TState>) => caption
          : (update: StateUpdate<TState>) => "UPDATE: ";
      const map = typeof mapper === "function"
        ? mapper
        : (update: StateUpdate<TState>) => update;

      store.update$
        .observeOn(queue)
        .do<StateUpdate<TState>>(up => logger(capt(up), map(up)))
        .subscribe();
      return store;
    };
