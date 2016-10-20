/// <reference path="../typefix/jest.d.ts" />
"use strict";

import "jest";
require("babel-core/register");
require("babel-polyfill");
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/empty";
import "rxjs/add/observable/of";
import { Action, StateUpdate } from "./interfaces";
import { createStore, createStoreExtensions } from "./createStore";
import { extendWith } from "./extendWith";

describe("extendWith", () => {
  describe("Sanity checks", () => {
    it("should be a function", () =>
      expect(typeof extendWith).toBe("function"));
  }); // describe Sanity checks

  describe("Given a store", () => {
    const store = {
      action$: Observable.empty<Action>(),
      state$: Observable.empty<{}>(),
      update$: Observable.empty<StateUpdate<{}>>(),
      dispatch: jest.fn(),
    };

    describe("When the store is extended", () => {
      const middleware = extendWith(st => ({
        concat: (str: string) => st.dispatch({ type: "CONCAT", payload: str }),
      }));
      it("middleware should be a function", () =>
        expect(typeof middleware).toBe("function"));
      const newStore = middleware(store);
      it("it should not be null", () =>
        expect(newStore).toBeTruthy());
      it("it should be the same store than before",
        () => expect(newStore).toBe(store));
      it("it should own a new concat property",
        () => expect((newStore as Object).hasOwnProperty("concat")).toBeTruthy());
      it("when concat function is called the dispatch function should have been called",
        () => {
          (newStore as any).concat("hello");
          expect(newStore.dispatch).toBeCalledWith({ type: "CONCAT", payload: "hello" });
        });
    }); // describe When the store is extended
  });
}); // describe extendWith
