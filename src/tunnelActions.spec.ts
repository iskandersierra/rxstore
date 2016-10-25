/// <reference path="../typefix/jest.d.ts" />
"use strict";

import "jest";
require("babel-core/register");
require("babel-polyfill");
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/empty";
import "rxjs/add/observable/of";
import "rxjs/add/operator/delay";
import "rxjs/add/operator/toPromise";
import { Action, StateUpdate, createStore, tunnelActions, Store } from "./index";

describe("tunnelActions", () => {
  describe("Sanity checks", () => {
    it("should be a function", () =>
      expect(typeof tunnelActions).toBe("function"));
  }); // describe Sanity checks


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
          expect(dispatch).toHaveBeenCalledTimes(1 + 1);
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
          expect(dispatch).toHaveBeenCalledTimes(1 + 1);
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

  describe("When a store is created with tunnel with a dispatch stream", () => {
    const reducer = jest.fn();
    const state = { title: "hello" };
    const dispatch = jest.fn();
    const store = createStore(reducer, state, tunnelActions({
      actions: "all",
      dispatch: Observable.of(dispatch),
    }));
    it("it should call the given tunnel dispatch",
      () => {
        store.dispatch({ type: "TEST1" });
        store.dispatch({ type: "TEST2" });
        store.dispatch({ type: "TEST3" });
        const promise = Observable.of(1).delay(40)
          .toPromise() as PromiseLike<any>;
        return promise.then(() => {
          expect(dispatch).toHaveBeenCalledTimes(1 + 3);
        });
      });
  }); // describe When an action is dispatched in the store

  describe("When a store is created with tunnel with a dispatch factory", () => {
    const reducer = jest.fn();
    const state = { title: "hello" };
    const dispatch = jest.fn();
    const store = createStore(reducer, state, tunnelActions({
      actions: "all",
      dispatchFactory: (s: Store<any>) => dispatch,
    }));
    it("it should call the given tunnel dispatch",
      () => {
        store.dispatch({ type: "TEST1" });
        store.dispatch({ type: "TEST2" });
        store.dispatch({ type: "TEST3" });
        const promise = Observable.of(1).delay(40)
          .toPromise() as PromiseLike<any>;
        return promise.then(() => {
          expect(dispatch).toHaveBeenCalledTimes(1 + 3);
        });
      });
  }); // describe When an action is dispatched in the store

  describe("When a store is created with tunnel with a dispatch stream factory", () => {
    const reducer = jest.fn();
    const state = { title: "hello" };
    const dispatch = jest.fn();
    const store = createStore(reducer, state, tunnelActions({
      actions: "all",
      dispatchFactory: (s: Store<any>) => Observable.of(dispatch),
    }));
    it("it should call the given tunnel dispatch",
      () => {
        store.dispatch({ type: "TEST1" });
        store.dispatch({ type: "TEST2" });
        store.dispatch({ type: "TEST3" });
        const promise = Observable.of(1).delay(40)
          .toPromise() as PromiseLike<any>;
        return promise.then(() => {
          expect(dispatch).toHaveBeenCalledTimes(1 + 3);
        });
      });
  }); // describe When an action is dispatched in the store
}); // describe extendWith
