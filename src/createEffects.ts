import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/delay";
import "rxjs/add/operator/do";
import "rxjs/add/operator/subscribeOn";
import { queue } from "rxjs/scheduler/queue";
import {
  Action, Dispatcher, Effect, EffectsDisposer, Store, StateUpdate,
} from "./interfaces";

const scheduler = queue;

export const logUpdatesEffect =
  (captioner: (update: StateUpdate<any>, store: Store<any>) => any) =>
    (logger: (message?: any, ...parameters: any[]) => void) =>
      (store: Store<any>) =>
        store.update$
          .do((up: StateUpdate<any>) => logger(captioner(up, store), up));

export const logUpdatesByActionTypeEffect =
  logUpdatesEffect((up, store) => {
    let caption = (store as any).caption;
    if (caption) { caption += ": "; } else { caption = ""; }
    return caption + "ON " + up.action.type;
  });

export const consoleLogUpdatesEffect =
  logUpdatesByActionTypeEffect(console.log.bind(console));

export const createDisposers =
  (...disposers: EffectsDisposer[])
    : EffectsDisposer => {
    let isDisposed = false;

    const unlisten = () => {
      if (isDisposed) { return; }
      isDisposed = true;
      disposers.forEach(s => s());
      disposers = [];
    };
    return unlisten;
  };

export const createEffects =
  (dispatch: Dispatcher, ...effects: Effect[])
    : EffectsDisposer => {
    const toDisposer = (e: Effect) => {
      const subscription = e.subscribeOn(scheduler).subscribe(dispatch);
      return () => subscription.unsubscribe();
    };
    let disposers = effects.map(toDisposer);

    return createDisposers(...disposers);
  };

export default createEffects;
