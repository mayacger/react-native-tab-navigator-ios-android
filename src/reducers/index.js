import { createReducer } from '../constants/utils';
import { actionTypes } from '../actions/index';

const isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n);

const initialState = {
  activeTab: null,
  activeTabBar: null,
  currentRoute: null,
  mode: null,
  routeStacks: {},
  routes: [],
  tabs: {},
  nav: {},
};

const defaultUpdates = (payload, routes) => ({
  activeTabBar: payload.tabBarName || null,
  // currentRoute: routes[routes.length - 1] || null,
  data: payload.data,
  routes,
});

const findTabStack = (tabState, tabBar, tab) => {
  const tabs = Object.assign({}, tabState);

  if (tabBar) {
    tabs[tabBar] = tabs[tabBar] || {};
    tabs[tabBar][tab] = tabs[tabBar][tab] || [];
    return [tabs, tabs[tabBar][tab]];
  } else {
    return [tabs, null];
  }
};

export default createReducer(initialState, {
  [actionTypes.ROUTER_CHANGE_TAB]: (state, { payload = {} }) => {
    const routeStacks = Object.assign({}, state.routeStacks);
    const currentRoutes = payload.navigator.getCurrentRoutes();
    payload.tabBarName = payload.from ;//|| state.activeTabBar
    const [tabs, tabStack] = findTabStack(
      state.tabs, payload.tabBarName, payload.name);

    if (payload.from !== payload.to) {
      routeStacks[payload.from] = routeStacks[payload.from] || {};
      routeStacks[payload.from] = currentRoutes;
    }

    if (tabStack && tabStack.length === 0) {
      tabStack.push(payload.name);
    }
    let popTo = state.popTo || {};
    popTo[payload.name] = payload.popTo;
    return Object.assign({}, state, defaultUpdates(payload, tabStack), {
      activeTab: payload.name,
      mode: actionTypes.ROUTER_CHANGE_TAB,
      routeStacks,
      popTo,
      tabs,
    });
  },
  [actionTypes.ROUTER_INIT]: (state, { payload }) => {
    const [tabs, tabStack] = findTabStack(
      state.tabs, payload.tabBarName, payload.name);
    let tabsUpdates = { tabs };
    let updates = {};

    if (tabStack) {
      tabStack.push(payload.name);
      tabsUpdates.activeTab = payload.name;
      updates = defaultUpdates(payload, tabStack);
    } else {
      updates = defaultUpdates(payload, [payload.name]);
    }

    return Object.assign({}, state, updates, tabsUpdates);
  },
  [actionTypes.ROUTER_POP]: (state, { payload = {} }) => {
    payload.tabBarName = payload.tabBarName || state.activeTabBar;

    const routes = state.routes.slice();
    const [tabs, tabStack] = findTabStack(
      state.tabs, payload.tabBarName, state.activeTab || payload.name);
    let updates = {};
    let activeTab = state.activeTab
    let data = { num: 1 };

    if (isNumeric(payload)) {
      data = { num: payload };
    } else {
      data = Object.assign({}, data, payload.data);
    }

    data.name = state.currentRoute;

    if (tabStack) {
      for (let i = 0; i < data.num && tabStack.length > 1; i++) {
        tabStack.pop();
      }
      updates = defaultUpdates(payload, tabStack);
    } else {
      for (let i = 0; i < data.num && routes.length > 1; i++) {
        routes.pop();
      }
      updates = defaultUpdates(payload, routes);
    }

    return Object.assign({}, state, updates, {
      activeTab,
      data: data,
      mode: actionTypes.ROUTER_POP,
      tabs,
    });
  },
  [actionTypes.ROUTER_PUSH]: (state, { payload = {} }) => {

    payload.tabBarName = payload.tabBarName || state.activeTabBar;
    const routes = state.routes.slice();
    const [tabs, tabStack] = findTabStack(
      state.tabs, payload.tabBarName, state.activeTab || payload.name);
    let updates = {};
    let activeTab = state.activeTab

    if (tabStack) {
      tabStack.push(payload.name);
      updates = defaultUpdates(payload, tabStack);
    } else {
      routes.push(payload.name);
      updates = defaultUpdates(payload, routes);
    }

    // transition to tab bar for first time
    if (!state.activeTab && payload.tabBarName) {
      activeTab = payload.name;
    }
    return Object.assign({}, state, updates, {
      activeTab,
      mode: actionTypes.ROUTER_PUSH,
      tabs,
      nav: payload.popTo
    });
  },
  [actionTypes.ROUTER_REPLACE]: (state, { payload = {} }) => {
    const routes = state.routes.slice();
    routes.pop();
    routes.push(payload.name);

    return Object.assign({}, state, defaultUpdates(payload, routes), {
      mode: actionTypes.ROUTER_REPLACE,
    });
  },
  [actionTypes.ROUTER_RESET]: (state, { payload = {} }) => {
    const routes = [payload.name];

    return Object.assign({}, state, defaultUpdates(payload, routes), {
      activeTab: null,
      mode: actionTypes.ROUTER_RESET,
      tabs: {},
    });
  }
});
