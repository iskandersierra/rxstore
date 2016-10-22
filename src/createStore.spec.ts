/// <reference path="../typefix/jest.d.ts" />
"use strict";

import "jest";
require("babel-core/register");
require("babel-polyfill");
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/observable/empty";
import "rxjs/add/operator/delay";
import "rxjs/add/operator/first";
import "rxjs/add/operator/last";
import "rxjs/add/operator/take";
import "rxjs/add/operator/timeout";
import "rxjs/add/operator/toArray";
import "rxjs/add/operator/toPromise";

import {
  Action, StateUpdate,
} from "./interfaces";
import { createStore, StoreActions } from "./createStore";
import { extendWith } from "./extendWith";
import { withEffects } from "./withEffects";
import { tunnelActions } from "./tunnelActions";

describe("createStore", () => {
  describe("Sanity checks", () => {
    it("should be a function", () =>
      expect(typeof createStore).toBe("function"));
  }); // describe Sanity checks

  describe("Given a reducer and initialState", () => {
    describe("When a store is created", () => {
      const reducer = jest.fn((s, a) => s);
      const state = { title: "hello" };
      const store = createStore(reducer, state);
      const statePromise = store.state$
        .take(1).first().timeout(100)
        .toPromise() as PromiseLike<{ title: string }>;
      it("it should not be null",
        () => expect(store).not.toBeFalsy());
      it("reducer should not be called yet",
        () => expect(reducer).toBeCalledWith(state, StoreActions.init.create()));
      it("it's action$ should be defined",
        () => expect(typeof store.action$).toBe("object"));
      it("it's state$ should be defined",
        () => expect(typeof store.state$).toBe("object"));
      it("it's update$ should be defined",
        () => expect(typeof store.update$).toBe("object"));
      it("it's dispatch should be a function",
        () => expect(typeof store.dispatch).toBe("function"));
      it("is's state$ should have emitted just the initial state",
        () => statePromise.then(s => expect(s).toEqual(state)));
    }); // describe When a store is created

    describe("When an action is dispatched in the store", () => {
      const reducer = jest.fn((s, a) => a.type === "CONCAT" ? ({ title: s.title + a.payload }) : s);
      const state = { title: "hello" };
      const store = createStore(reducer, state);
      const action = { type: "CONCAT", payload: " world" };
      const statePromise = store.state$
        .take(2).toArray().timeout(100)
        .toPromise() as PromiseLike<{ title: string }>;
      const actionPromise = store.action$
        .take(1).toArray().timeout(100)
        .toPromise() as PromiseLike<Action>;
      const updatePromise = store.update$
        .take(1).toArray().timeout(100)
        .toPromise() as PromiseLike<StateUpdate<{ title: string }>>;
      store.dispatch(action);
      it("reducer should have been called with action",
        () => expect(reducer).toBeCalledWith(state, action));
      it("is's action$ should have emitted the action",
        () => actionPromise.then(actions => expect(actions).toEqual([action])));
      it("is's state$ should have emitted the initial state and the new one",
        () => statePromise.then(states => expect(states).toEqual([
          state,
          { title: "hello world" },
        ])));
      it("is's update$ should have emitted the state update",
        () => updatePromise.then(updates => expect(updates).toEqual([{
          action, state: { title: "hello world" },
        }])));
    }); // describe When an action is dispatched in the store

    describe("When a FINISH action is dispatched", () => {
      const reducer = jest.fn((s, a) => s);
      const state = { title: "hello" };
      const store = createStore(reducer, state);
      const actionPromise = store.action$
        .last().timeout(100)
        .toPromise() as PromiseLike<any>;
      it("the store's actions stream should be completed", () => {
        StoreActions.finish.dispatchOn(store.dispatch);
        return actionPromise;
      });
    });    // When a FINISH action is dispatched

    describe("When a FINISH action is dispatched", () => {
      const reducer = jest.fn((s, a) => s);
      const state = { title: "hello" };
      const store = createStore(reducer, state);
      const statePromise = store.state$
        .last().timeout(100)
        .toPromise() as PromiseLike<any>;
      it("the store's states stream should be completed", () => {
        StoreActions.finish.dispatchOn(store.dispatch);
        return statePromise;
      });
    });    // When a FINISH action is dispatched

    describe("When a FINISH action is dispatched", () => {
      const reducer = jest.fn((s, a) => s);
      const state = { title: "hello" };
      const store = createStore(reducer, state);
      const updatePromise = store.update$
        .last().timeout(100)
        .toPromise() as PromiseLike<any>;
      it("the store's updates stream should be completed", () => {
        StoreActions.finish.dispatchOn(store.dispatch);
        return updatePromise;
      });
    });    // When a FINISH action is dispatched
  }); // describe Given a simple store
}); // describe createStore
