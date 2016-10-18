"use strict";

import "jest";
require("babel-core/register");
require("babel-polyfill");
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/observable/empty";

import {
  Store, Action, Reducer, StateUpdate, StoreActionsMap,
} from "./interfaces";
import { createStore, createStoreExtensions } from "./createStore";

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
        getState: jest.fn(),
        dispatch: jest.fn(), // (action: Action) => { return; },
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

  describe("Given a simple store", () => {
    const reducer = jest.fn((s, a) => s);
    const store = createStore(reducer, {});
    it("it should not be null",
      () => expect(store).not.toBeFalsy());
  }); // describe Given a simple store
}); // describe createStore
