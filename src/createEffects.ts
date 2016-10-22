import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/delay";
import "rxjs/add/operator/do";
import "rxjs/add/operator/subscribeOn";
import { queue } from "rxjs/scheduler/queue";
import {
  Action, Dispatcher, Effect, Store, StateUpdate,
} from "./interfaces";

const scheduler = queue;

export const createEffects =
  (dispatch: Dispatcher, ...effects: Effect[]): void =>
    effects.forEach(e => e.subscribeOn(scheduler).subscribe(dispatch));

export default createEffects;
