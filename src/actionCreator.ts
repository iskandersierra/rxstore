import {
  Action, Dispatcher, Reducer, ActionCreator,
  EmptyActionDescription, TypedActionDescription,
} from "./interfaces";
import "object-assign";
import objectAssign = require("object-assign");

export function actionCreator<TState>(nameSpace: string): ActionCreator<TState> {
  const untyped = (type: string, reducer?: (state: TState) => TState)
    : EmptyActionDescription<TState> => {
    const scopedName = nameSpace + type;
    const create = (): Action => ({ type: scopedName });
    const dispatchOn = (disp: Dispatcher) => disp(create());
    const result: any = create;
    objectAssign(result, { kind: "empty", type: scopedName, create, dispatchOn, reducer });
    return result;
  };
  const of = <T>(type: string, reducer?: (state: TState, payload: T) => TState)
    : TypedActionDescription<TState, T> => {
    const scopedName = nameSpace + type;
    const create = (payload: T): Action => ({ type: scopedName, payload });
    const dispatchOn = (payload: T, disp: Dispatcher) => disp(create(payload));
    const result: any = create;
    objectAssign(result, { kind: "typed", type: scopedName, create, dispatchOn, reducer });
    return result;
  };

  let result: any = untyped;
  result.of = of;
  return result;
};
