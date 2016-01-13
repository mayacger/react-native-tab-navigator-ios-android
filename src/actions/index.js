import { createConstants } from '../constants/utils';

export const actionTypes = createConstants(
  'ROUTER_CHANGE_TAB',
  'ROUTER_INIT',
  'ROUTER_POP',
  'ROUTER_PUSH',
  'ROUTER_REPLACE',
  'ROUTER_RESET',
);

const filter = data => {
  if (typeof(data) !== 'object') {
    return data;
  }
  if (!data) {
    return;
  }

  var proto = (data || {}).constructor.name;

  if (proto != 'Object') {
    data = {};
  }
  if (data.data) {
    data.data = filter(data.data);
  }

  return data;
};

export function changeTab(data) {
  return {
    type: actionTypes.ROUTER_CHANGE_TAB,
    payload: filter(data),
  };
}

export function init(data) {
  return {
    type: actionTypes.ROUTER_INIT,
    payload: filter(data),
  };
}

export function pop(data) {
  return {
    type: actionTypes.ROUTER_POP,
    payload: filter(data),
  };
}

export function push(data) {
  return {
    type: actionTypes.ROUTER_PUSH,
    payload: filter(data),
  };
}

export function reset(data) {
  return {
    type: actionTypes.ROUTER_RESET,
    payload: filter(data),
  };
}

export function replace(data) {
  return {
    type: actionTypes.ROUTER_REPLACE,
    payload: filter(data),
  };
}
