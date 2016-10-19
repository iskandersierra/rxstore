import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/delay";
import "rxjs/add/operator/do";
import "rxjs/add/operator/subscribeOn";
import { queue } from "rxjs/scheduler/queue";
import {
  Action, Dispatcher, Effect, Store, StateUpdate,
} from "./interfaces";

const scheduler = queue;

export const logUpdatesEffect =
  (captioner: (update: StateUpdate<any>, store: Store<any>) => any) =>
    (logger: (message?: any, ...parameters: any[]) => void) =>
      (store: Store<any>) => {
        const effect = (up: StateUpdate<any>) => logger(captioner(up, store), up);
        return store.update$.do(effect);
      };

export const logUpdatesByActionTypeEffect =
  logUpdatesEffect((up, store) => {
    let caption = (store as any).caption;
    if (caption) { caption += ": "; } else { caption = ""; }
    return caption + "ON " + up.action.type;
  });

export const createEffects =
  (dispatch: Dispatcher, ...effects: Effect[]): void =>
    effects.forEach(e => e.subscribeOn(scheduler).subscribe(dispatch));

export default createEffects;
