/// <reference path="../typefix/jest.d.ts" />
"use strict";

import "jest";
require("babel-core/register");
require("babel-polyfill");
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/observable/empty";
import "rxjs/add/operator/delay";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/first";
import "rxjs/add/operator/last";
import "rxjs/add/operator/observeOn";
import "rxjs/add/operator/subscribeOn";
import "rxjs/add/operator/take";
import "rxjs/add/operator/timeout";
import "rxjs/add/operator/toArray";
import "rxjs/add/operator/toPromise";
import { queue } from "rxjs/scheduler/queue";

import {
  Action, StateUpdate, createStore, StoreActions, startEffects, startEffectsOn,
  defineStore, actionCreator, reducerFromActions, withEffects, Store, logUpdates,
} from "./index";

describe("startEffects/startEffectsOn", () => {
  describe("Sanity checks", () => {
    it("startEffects should be a function", () =>
      expect(typeof startEffects).toBe("function"));
    it("startEffectsOn should be a function", () =>
      expect(typeof startEffectsOn).toBe("function"));

    describe("Given startEffectsOn, a dispatcher and two effects", () => {
      const dispatchMock = jest.fn();
      const dispatch = (a: Action) => dispatchMock(a);
      const effect1 = Observable.of<Action>({ type: "A1" });
      const effect2 = Observable.of<Action>({ type: "A2" }, { type: "A3" });
      it("dispatch should receive all actions from the effects", () => {
        startEffectsOn(dispatch)(effect1, effect2);
        expect(dispatchMock).toBeCalledWith({ type: "A1" });
        expect(dispatchMock).toBeCalledWith({ type: "A2" });
        expect(dispatchMock).toBeCalledWith({ type: "A3" });
      });
    });    // Given a dispatcher and two effects

    describe("Given startEffectsOn, a dispatcher$ and two effects", () => {
      const dispatchMock = jest.fn();
      const dispatch = (a: Action) => dispatchMock(a);
      const dispatch$ = Observable.of(dispatch);
      const effect1 = Observable.of<Action>({ type: "A1" });
      const effect2 = Observable.of<Action>({ type: "A2" }, { type: "A3" });
      it("dispatch should receive all actions from the effects", () => {
        startEffectsOn(dispatch$)(effect1, effect2);
        expect(dispatchMock).toBeCalledWith({ type: "A1" });
        expect(dispatchMock).toBeCalledWith({ type: "A2" });
        expect(dispatchMock).toBeCalledWith({ type: "A3" });
      });
    });    // Given a dispatcher and two effects

    describe("Given startEffects, a dispatcher and two effects", () => {
      const dispatchMock = jest.fn();
      const dispatch = (a: Action) => dispatchMock(a);
      const effect1 = Observable.of<Action>({ type: "A1" });
      const effect2 = Observable.of<Action>({ type: "A2" }, { type: "A3" });
      it("dispatch should receive all actions from the effects", () => {
        startEffects(dispatch, effect1, effect2);
        expect(dispatchMock).toBeCalledWith({ type: "A1" });
        expect(dispatchMock).toBeCalledWith({ type: "A2" });
        expect(dispatchMock).toBeCalledWith({ type: "A3" });
      });
    });    // Given a dispatcher and two effects

    describe("Given startEffects, a dispatcher$ and two effects", () => {
      const dispatchMock = jest.fn();
      const dispatch = (a: Action) => dispatchMock(a);
      const dispatch$ = Observable.of(dispatch);
      const effect1 = Observable.of<Action>({ type: "A1" });
      const effect2 = Observable.of<Action>({ type: "A2" }, { type: "A3" });
      it("dispatch should receive all actions from the effects", () => {
        startEffects(dispatch$, effect1, effect2);
        expect(dispatchMock).toBeCalledWith({ type: "A1" });
        expect(dispatchMock).toBeCalledWith({ type: "A2" });
        expect(dispatchMock).toBeCalledWith({ type: "A3" });
      });
    });    // Given a dispatcher and two effects
  });    // Sanity checksconst disp(a: Actionatch = => dispatchMock(a); 

  describe("Given a store", () => {
    describe("Given effects reacting to state", () => {
      const newAction = actionCreator<string>("");
      const Actions = {
        concat: newAction.of<string>("CONCAT", (s, p) => s + p),
      };
      const reducer = reducerFromActions(Actions);
      const forABCEmitX = (s: Store<string>) =>
        s.state$
          .filter(st => st === "ABC")
          .map(st => Actions.concat("X"));
      describe("When actions are dispatched", () => {
        it("actions should happen in the expected order", () => {
          const store = createStore(reducer, "",
            withEffects(forABCEmitX),
            // logUpdates({ logger: console.info })
          );
          const promise = store.action$
            .toArray().toPromise() as PromiseLike<string[]>;
          const effects = Observable.of(
            Actions.concat("A"),
            Actions.concat("B"),
            Actions.concat("C"),
            StoreActions.finish(),
          );
          startEffects(store.dispatch, effects);
          return promise.then(arr => expect(arr).toEqual([
            Actions.concat("A"),
            Actions.concat("B"),
            Actions.concat("C"),
            Actions.concat("X"),
            StoreActions.finish(),
          ]));
        });
      });    // When actions are dispatched

      describe("When actions are dispatched", () => {
        it("states should happen in the expected order", () => {
          const store = createStore(reducer, "",
            withEffects(forABCEmitX),
            // logUpdates({ logger: console.info })
          );
          const promise = store.state$
            .distinctUntilChanged()
            .toArray().toPromise() as PromiseLike<string[]>;
          const effects = Observable.of(
            Actions.concat("A"),
            Actions.concat("B"),
            Actions.concat("C"),
            StoreActions.finish(),
          );
          startEffects(store.dispatch, effects);
          return promise.then(arr => expect(arr).toEqual([
            "", "A", "AB", "ABC", "ABCX",
          ]));
        });
      });    // When actions are dispatched

      describe("When actions are dispatched", () => {
        it("updates should happen in the expected order", () => {
          const store = createStore(reducer, "",
            withEffects(forABCEmitX),
            // logUpdates({ logger: console.info })
          );
          const promise = store.update$
            .distinctUntilChanged()
            .toArray().toPromise() as PromiseLike<string[]>;
          const effects = Observable.of(
            Actions.concat("A"),
            Actions.concat("B"),
            Actions.concat("C"),
            StoreActions.finish(),
          );
          startEffects(store.dispatch, effects);
          return promise.then(arr => expect(arr).toEqual([
            { action: Actions.concat("A"), state: "A" },
            { action: Actions.concat("B"), state: "AB" },
            { action: Actions.concat("C"), state: "ABC" },
            { action: Actions.concat("X"), state: "ABCX" },
            { action: StoreActions.finish(), state: "ABCX" },
          ]));
        });
      });    // When actions are dispatched
    });    // Given effects reacting to state
  });    // Given a store
});    // startEffects/startEffectsOn
