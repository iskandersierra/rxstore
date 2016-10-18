"use strict";

import "jest";
require("babel-core/register");
require("babel-polyfill");

import {
  Store, Action, Reducer, StateUpdate, ReducersMap,
} from "./interfaces";
import { createReducerFromMap } from "./createReducerFromMap";

describe("createReducerFromMap", () => {
  describe("Sanity checks", () => {
    it("should be a function", () =>
      expect(typeof createReducerFromMap).toBe("function"));
    it("should return a function", () =>
      expect(typeof createReducerFromMap({})).toBe("function"));
  }); // describe Sanity checks

  describe("Given a state reducer map", () => {
    const map = {
      DECREMENT: (s, a) => s - 1,
      INCREMENT: (s, a) => s + 1,
      RESET: (s, a) => s = a.payload,
    } as ReducersMap<number>;
    describe("When the reducer is created from the map", () => {
      const reducer = createReducerFromMap(map);
      it("it should return an incremented state for action INCREMENT",
        () => expect(reducer(5, { type: "INCREMENT" })).toEqual(6));
      it("it should return a decremented state for action DECREMENT",
        () => expect(reducer(5, { type: "DECREMENT" })).toEqual(4));
      it("it should return a reset state for action RESET",
        () => expect(reducer(5, { type: "RESET", payload: 42 })).toEqual(42));
    }); // describe When the reducer is created from the map
  }); // describe Given a state reducer map

}); // describe createReducerFromMap
