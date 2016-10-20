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
import "rxjs/add/operator/take";
import "rxjs/add/operator/timeout";
import "rxjs/add/operator/toArray";
import "rxjs/add/operator/toPromise";

import {
  Action, StateUpdate,
} from "./interfaces";
import { createStore, createStoreExtensions } from "./createStore";
import { extendWith } from "./extendWith";
import { withEffects } from "./withEffects";
import { tunnelActions } from "./tunnelActions";

describe("createStoreExtensions", () => {
  describe("Sanity checks", () => {
    it("should be a function", () =>
      expect(typeof createStoreExtensions).toBe("function"));
    it("should return a function", () =>
      expect(typeof createStoreExtensions({})).toBe("function"));
  }); // describe Sanity checks

  describe("Given an action map", () => {
    const map = {
      action1: { type: "ACTION1" },
      action2: (c: number) => ({ type: "ACTION2", payload: c }),
    };
    const extender = createStoreExtensions(map);
    describe("Given a simple store", () => {
      const store = {
        action$: Observable.empty<Action>(),
        state$: Observable.empty<{}>(),
        update$: Observable.empty<StateUpdate<{}>>(),
        dispatch: jest.fn(),
      };
      describe("When the store is extended with map", () => {
        const extended = extender(store);
        it("it should not be null or undefined",
          () => expect(extended).not.toBeFalsy());
        it("it should not be the same object as store",
          () => expect(extended).not.toBe(store));
        it("extended.action1 should be a function",
          () => expect(typeof extended.action1).toBe("function"));
        it("extended.action2 should be a function",
          () => expect(typeof extended.action2).toBe("function"));
        describe("When action1 is called on extended", () => {
          extended.action1();
          it("it should have called store.dispatch with corresponding action",
            () => expect(store.dispatch).toBeCalledWith(map.action1));
        }); // describe When action1 is called on extended
        describe("When action2 is called on extended", () => {
          extended.action2(5);
          it("it should have called store.dispatch with corresponding action",
            () => expect(store.dispatch).toBeCalledWith(map.action2(5)));
        }); // describe When action1 is called on extended
      }); // describe When the store is extended with map
    }); // describe Given a simple store
  }); // describe Given an action map
}); // describe createStoreExtensions

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
        () => expect(reducer).not.toBeCalled());
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
      const reducer = jest.fn((s, a) => ({ title: s.title + a.payload }));
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

    describe("When an action is dispatched in the store through an extension", () => {
      const reducer = jest.fn((s, a) => ({ title: s.title + a.payload }));
      const state = { title: "hello" };
      const extender = createStoreExtensions({
        concat: (str: string) => ({ type: "CONCAT", payload: str }),
      });
      const store = createStore(reducer, state, extendWith(extender));
      const action = { type: "CONCAT", payload: " world" };
      (store as any).concat(" world");
      store.dispatch(action);
      it("reducer should have been called with action",
        () => expect(reducer).toBeCalledWith(state, action));
    }); // describe When an action is dispatched in the store

    describe("When a store is created with effects", () => {
      const reducer = jest.fn();
      const state = { title: "hello" };
      const effects = jest.fn();
      const store = createStore(reducer, state, withEffects(effects));
      it("it should call the given effects",
        () => expect(effects).toBeCalledWith(store));
    }); // describe When an action is dispatched in the store

    describe("When a store is created with tunnel for all actions with no mapping", () => {
      const reducer = jest.fn();
      const state = { title: "hello" };
      const dispatch = jest.fn();
      const store = createStore(reducer, state, tunnelActions({
        actions: "all",
        dispatch,
      }));
      it("it should call the given tunnel dispatch",
        () => {
          store.dispatch({ type: "TEST1" });
          const promise = Observable.of(1).delay(40)
            .toPromise() as PromiseLike<any>;
          return promise.then(() => {
            expect(dispatch).toHaveBeenCalledTimes(1);
            expect(dispatch).toBeCalledWith({ type: "TEST1" });
          });
        });
    }); // describe When an action is dispatched in the store

    describe("When a store is created with tunnel for all actions with mapping", () => {
      const reducer = jest.fn();
      const state = { title: "hello" };
      const dispatch = jest.fn();
      const store = createStore(reducer, state, tunnelActions({
        actions: a => ({ type: "WRAPPER", payload: a }),
        dispatch,
      }));
      it("it should call the given tunnel dispatch",
        () => {
          store.dispatch({ type: "TEST1" });
          const promise = Observable.of(1).delay(40)
            .toPromise() as PromiseLike<any>;
          return promise.then(() => {
            expect(dispatch).toHaveBeenCalledTimes(1);
            expect(dispatch).toBeCalledWith({ type: "WRAPPER", payload: { type: "TEST1" } });
          });
        });
    }); // describe When an action is dispatched in the store

    describe("When a store is created with tunnel for a list of action names", () => {
      const reducer = jest.fn();
      const state = { title: "hello" };
      const dispatch = jest.fn();
      const store = createStore(reducer, state, tunnelActions({
        actions: ["TEST1", "TEST2"],
        dispatch,
      }));
      it("it should call the given tunnel dispatch",
        () => {
          store.dispatch({ type: "TEST1" });
          store.dispatch({ type: "TEST2" });
          store.dispatch({ type: "TEST3" });
          const promise = Observable.of(1).delay(40)
            .toPromise() as PromiseLike<any>;
          return promise.then(() => {
            expect(dispatch).toHaveBeenCalledTimes(2);
            expect(dispatch).toBeCalledWith({ type: "TEST1" });
            expect(dispatch).toBeCalledWith({ type: "TEST2" });
            expect(dispatch).not.toBeCalledWith({ type: "TEST3" });
          });
        });
    }); // describe When an action is dispatched in the store

    describe("When a store is created with tunnel for some action mappings", () => {
      const reducer = jest.fn();
      const state = { title: "hello" };
      const dispatch = jest.fn();
      const store = createStore(reducer, state, tunnelActions({
        actions: {
          ["TEST1"]: a => ({ type: "WRAPPER1", payload: a }),
          ["TEST2"]: a => ({ type: "WRAPPER2", payload: a }),
        },
        dispatch,
      }));
      it("it should call the given tunnel dispatch",
        () => {
          store.dispatch({ type: "TEST1" });
          store.dispatch({ type: "TEST2" });
          store.dispatch({ type: "TEST3" });
          const promise = Observable.of(1).delay(40)
            .toPromise() as PromiseLike<any>;
          return promise.then(() => {
            expect(dispatch).toHaveBeenCalledTimes(2);
            expect(dispatch).toBeCalledWith({ type: "WRAPPER1", payload: { type: "TEST1" } });
            expect(dispatch).toBeCalledWith({ type: "WRAPPER2", payload: { type: "TEST2" } });
            expect(dispatch).not.toBeCalledWith({ type: "WRAPPER3", payload: { type: "TEST3" } });
          });
        });
    }); // describe When an action is dispatched in the store
  }); // describe Given a simple store
}); // describe createStore
