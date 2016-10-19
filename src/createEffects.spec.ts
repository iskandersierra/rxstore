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
import {
  logUpdatesEffect, logUpdatesByActionTypeEffect,
  createEffects,
} from "./createEffects";

describe("logUpdatesEffect", () => {
  it("it should be a function",
    () => expect(typeof logUpdatesEffect).toBe("function"));
  describe("When it is called with a captioner", () => {
    const captioner = jest.fn(() => "***CAPTION***");
    const captionedEffect = logUpdatesEffect(captioner);
    it("The result should be a function",
      () => expect(typeof captionedEffect).toBe("function"));
    it("The captioner should not be called",
      () => expect(captioner).not.toBeCalled());
    describe("When it is called with a logger", () => {
      const logger = jest.fn();
      const loggerEffect = captionedEffect(logger);
      it("The result should be a function",
        () => expect(typeof loggerEffect).toBe("function"));
      it("The captioner should not be called",
        () => expect(captioner).not.toBeCalled());
      it("The logger should not be called",
        () => expect(logger).not.toBeCalled());
      describe("When a store gets the effect applied", () => {
        const reducer = jest.fn((s, a) => s);
        const state = { title: "hello" };
        const store = createStore(reducer, state);
        const update = { action: { type: "A" }, state };
        const loggerPromise = loggerEffect(store)
          .take(1).first()
          .toPromise() as PromiseLike<StateUpdate<{ title: string }>>;
        it("captioner and logger should have been called once",
          () => {
            store.dispatch(update.action);
            return loggerPromise.then(up => {
              expect(captioner).toHaveBeenCalledTimes(1);
              expect(logger).toHaveBeenCalledTimes(1);
              expect(captioner).toBeCalledWith(update, store);
              expect(logger).toBeCalledWith("***CAPTION***", update);
              expect(up).toEqual(update);
            });
          });

      }); // describe When a store gets the effect applied
    }); // describe When it is called with a logger
  }); // describe When it is called with a captioner
}); // describe logUpdatesEffect

describe("logUpdatesByActionTypeEffect", () => {
  describe("When it is called with a logger", () => {
    const logger = jest.fn();
    const loggerEffect = logUpdatesByActionTypeEffect(logger);
    it("The result should be a function",
      () => expect(typeof loggerEffect).toBe("function"));
    it("The logger should not be called",
      () => expect(logger).not.toBeCalled());
    describe("When a store gets the effect applied", () => {
      const reducer = jest.fn((s, a) => s);
      const state = { title: "hello" };
      const store = createStore(reducer, state, {
        extendWith: () => ({ caption: "MyStore" }),
      });
      const update = { action: { type: "A" }, state };
      const loggerPromise = loggerEffect(store)
        .take(1).first()
        .toPromise() as PromiseLike<StateUpdate<{ title: string }>>;
      it("logger should have been called once",
        () => {
          store.dispatch(update.action);
          return loggerPromise.then(up => {
            expect(logger).toHaveBeenCalledTimes(1);
            expect(logger).toBeCalledWith("MyStore: ON A", update);
            expect(up).toEqual(update);
          });
        });
    }); // describe When a store gets the effect applied
  }); // describe When it is called with a logger
}); // describe logUpdatesByActionTypeEffect

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
