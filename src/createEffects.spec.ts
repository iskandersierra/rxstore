/// <reference path="../typefix/jest.d.ts" />
"use strict";

import "jest";
require("babel-core/register");
require("babel-polyfill");
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/observable/empty";
import "rxjs/add/operator/bufferTime";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/first";
import "rxjs/add/operator/map";
import "rxjs/add/operator/take";
import "rxjs/add/operator/toArray";
import "rxjs/add/operator/toPromise";

import {
  Store, Action, Reducer, StateUpdate,
} from "./interfaces";
import { createStore, createStoreExtensions } from "./createStore";
import extendWith from "./extendWith";
import { createEffects } from "./createEffects";

describe("createEffects", () => {
  describe("Given a simple store", () => {
    const reducer = jest.fn((s, a) => s);
    const state = 0;
    const store = createStore(reducer, state);
    describe("Given some PONG effect", () => {
      const pong = store.action$
        .filter(a => a.type === "PING")
        .map(() => ({ type: "PONG" }));
      describe("When effects are associated with the store", () => {
        const actionsPromise = store.action$.take(2).toArray().toPromise() as PromiseLike<Action[]>;
        const effects = createEffects(store.dispatch, pong);
        it("a PONG action should be emited for a PING",
          () => {
            store.dispatch({ type: "PING" });
            return actionsPromise.then(actions => {
              expect(actions).toEqual([
                { type: "PING" },
                { type: "PONG" },
              ]);
            });
          });

      }); // describe When efects are associated with the store
    }); // describe Given some PING/PONG effect
  }); // describe Given a simple store
}); // describe createEffects
