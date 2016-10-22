import {
  Action, Dispatcher, Reducer, ActionCreator,
  EmptyReducer, EmptyActionDescription, TypedReducer, TypedActionDescription,
} from "./interfaces";
import "object-assign";
import objectAssign = require("object-assign");

export function actionCreator<TState>(nameSpace: string): ActionCreator<TState> {
  const untyped = (type: string, reducer?: EmptyReducer<TState>)
    : EmptyActionDescription<TState> => {
    const scopedName = nameSpace + type;
    const create = (): Action => ({ type: scopedName });
    const dispatchOn = (disp: Dispatcher) => disp(create());
    return { kind: "empty", type: scopedName, create, dispatchOn, reducer };
  };
  const of = <T>(type: string, reducer?: TypedReducer<TState, T>)
    : TypedActionDescription<TState, T> => {
    const scopedName = nameSpace + type;
    const create = (payload: T): Action => ({ type: scopedName, payload });
    const dispatchOn = (payload: T, disp: Dispatcher) => disp(create(payload));
    return { kind: "typed", type: scopedName, create, dispatchOn, reducer };
  };

  let result: any = untyped;
  result.of = of;
  return result;
};
