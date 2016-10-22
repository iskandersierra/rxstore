/// <reference path="../typefix/jest.d.ts" />
"use strict";

import "jest";
require("babel-core/register");
require("babel-polyfill");

import {
  Action, StateUpdate,
} from "./interfaces";
import { defineStore } from "./defineStore";

describe("defineStore", () => {
  describe("Sanity checks", () => {
    it("should be a function", () =>
      expect(typeof defineStore).toBe("function"));
  }); // describe Sanity checks

  describe("Given a store definition", () => {
    const reducer = jest.fn((s: number, a: Action) => s + 1);
    const newState = jest.fn(() => 0);
    const aMiddleware = jest.fn((s: any) => s);
    const createStore = defineStore(reducer, newState, aMiddleware);

    describe("Sanity checks", () => {
      it("the result should be a function", () =>
        expect(typeof createStore).toBe("function"));
      describe("When the store is created", () => {
        const store = createStore();
        it("it should be a store", () => {
          expect(store).toBeTruthy();
          expect(store.action$).toBeTruthy();
          expect(store.state$).toBeTruthy();
          expect(store.update$).toBeTruthy();
          expect(store.dispatch).toBeTruthy();
        });
        it("reducer should has not been called", () =>
          expect(reducer).not.toBeCalled());
        it("newState should has been called once", () =>
          expect(newState).toHaveBeenCalledTimes(1));
        it("aMiddleware should has been called once", () =>
          expect(aMiddleware).toHaveBeenCalledTimes(1));
      });    // When the store is created
    }); // describe Sanity checks
  });    // Given a store definition
});    // defineStore