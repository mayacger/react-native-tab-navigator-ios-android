/**
* mayacger
* react-native-tab-navigator-ios-android
**/
'use strict';
import React, {
  StyleSheet,
  Navigator,
  StatusBarIOS,
  View,
  Component,
  Platform,
  Text,
} from 'react-native';

import NavBarContainer from './src/components/NavBarContainer';
import Layout from './src/components/Layout';
import Tabitem from './src/components/Tabitem';
import Tab from './src/components/Tab';
import TabBar from './src/components/TabBar';
import Badge from './src/components/Badge';

import * as actions from './src/actions';
import reducer from './src/reducers';

const actionTypes = actions.actionTypes;

class Router extends Component {


  constructor (props) {
    super(props);
    // const { actions = {}, dispatch } = props;
    this.state = {
      route: {
        name: null,
        index: null
      },
      dragStartX: null,
      didSwitchView: null,
    }

    this.routes = {};

    this.onBack = this.onBack.bind(this);
    this.onForward = this.onForward.bind(this);
    this.customAction = this.customAction.bind(this);
    this.renderScene = this.renderScene.bind(this);
    this.onDidFocus = this.onDidFocus.bind(this);
    // this._setNavigatorRef = this._setNavigatorRef.bind(this);
  }

  /*
   * This changes the title in the navigation bar
   * It should preferrably be called for "onWillFocus" instad >
   * > but a recent update to React Native seems to break the animation
   * onDidFocus 已废弃
   */
  onDidFocus (route) {
    this.setState({ route: route });
  }

  onBack (navigator) {
    if (this.state.route.index > 0) {
      navigator.pop();
    }
  }

  onForward (route, navigator) {
    route.index = this.state.route.index + 1 || 1;
    navigator.push(route);
  }

  customAction (opts) {
    this.props.customAction(opts);
  }

  componentDidMount() {
    this.props.actions.init({name: 'home'});
  }

  componentWillReceiveProps(nextProps) {

    const routeKey = router => (
      '' + router.activeTabBar + router.activeTab + router.currentRoute
    );
    // if (routeKey(this.props.router) !== routeKey(nextProps.router)) {
      this.handleRouteChange(nextProps.router);
    // }
  }

  handleRouteChange(router) {
    const { data = {}, mode } = router;

    if (mode === actionTypes.ROUTER_CHANGE_TAB) {
      let routes = [];

      if (router.routeStacks[router.activeTab]) {
        routes = router.routeStacks[router.activeTab];
        this.setState ({
          route: routes[routes.length -1]
        })
      } else {

        routes.push(router.popTo[router.activeTab]);
          this.setState ({
            route: router.popTo[router.activeTab]
          })
      }
      this.refs.nav.immediatelyResetRouteStack(routes);
    }

    if (mode === actionTypes.ROUTER_POP) {
      const num = data.num || 1;
      const routes = this.refs.nav.getCurrentRoutes();
      if (num < routes.length) {
        this.refs.nav.popToRoute(routes[routes.length - 1 - num]);
      } else {
        this.refs.nav.popToTop();
      }
    }

    if (mode === actionTypes.ROUTER_PUSH) {
      let route = router.nav;
      this.onForward(route, this.refs.nav);
    }

    if (mode === actionTypes.ROUTER_REPLACE) {
      // this.refs.nav.replace(this.getRoute(
      //   this.routes[router.currentRoute], router
      // ));
    }

    if (mode === actionTypes.ROUTER_RESET) {
      // this.refs.nav.immediatelyResetRouteStack([
      //   this.getRoute(this.routes[router.currentRoute], router)
      // ]);
    }
  }

  renderScene (route, navigator) {

    var goForward = function(route) {
      route.index = this.state.route.index + 1 || 1;
      navigator.push(route);
    }.bind(this);

    var goBackwards = function() {
      this.onBack(navigator);
    }.bind(this);

    var goToFirstRoute = function() {
      navigator.popToTop()
    };

    var customAction = function(opts) {
      this.customAction(opts);
    }.bind(this);

    var didStartDrag = function(evt) {
      var x = evt.nativeEvent.pageX;
      if (x < 28) {
        this.setState({
          dragStartX: x,
          didSwitchView: false
        });
        return true;
      }
    }.bind(this);

    // Recognize swipe back gesture for navigation
    var didMoveFinger = function(evt) {
      var draggedAway = ((evt.nativeEvent.pageX - this.state.dragStartX) > 30);
      if (!this.state.didSwitchView && draggedAway) {
        this.onBack(navigator);
        this.setState({ didSwitchView: true });
      }
    }.bind(this);

    // Set to false to prevent iOS from hijacking the responder
    var preventDefault = function(evt) {
      return true;
    };




    var Content = route.component;

    // Remove the margin of the navigation bar if not using navigation bar
    var extraStyling = {};
    if (this.props.hideNavigationBar) {
      extraStyling.marginTop = 0;
    }

    return (
      <View
        style={[styles.container, this.props.bgStyle, extraStyling]}
        onStartShouldSetResponder={didStartDrag}
        onResponderMove={didMoveFinger}
        onResponderTerminationRequest={preventDefault}>
        <Content
          name={route.name}
          index={route.index}
          data={route.data}
          toRoute={goForward}
          toBack={goBackwards}
          reset={goToFirstRoute}
          customAction={customAction}
        />

      </View>
    )

  }

  render () {
    // Status bar color
    if (Platform.OS === 'ios') {
      if (this.props.statusBarColor === "black") {
        StatusBarIOS.setStyle(0);
      } else {
        StatusBarIOS.setStyle(1);
      }
    }


    var navigationBar;

    if (!this.props.hideNavigationBar) {

      navigationBar =
      <NavBarContainer
        style={this.props.headerStyle}
        navigator={navigator}
        currentRoute={this.state.route}
        backButtonComponent={this.props.backButtonComponent}
        rightCorner={this.props.rightCorner}
        titleStyle={this.props.titleStyle}
        toRoute={this.onForward}
        toBack={this.onBack}
        customAction={this.customAction}
      />
    }


    //toRoute in Tab
    let  _renderTab = function (item) {

      // this.routes[item.props.title] = [];
      // this.routes[item.props.title].push(item.props.changeRoute);
      let icon;

      if (item.props.selected) {
        if (this.refs.nav) {
          this.routes[item.props.title] = this.refs.nav.getCurrentRoutes();
        }
        this.routes.activeTab = item.props.title;
        if (item.props.renderSelectedIcon) {
          icon = item.props.renderSelectedIcon();
        } else if (item.props.renderIcon) {
          let defaultIcon = item.props.renderIcon();
          icon = React.cloneElement(defaultIcon, {
            style: [defaultIcon.props.style, styles.defaultSelectedIcon],
          });
        }
      } else if (item.props.renderIcon) {
        icon = item.props.renderIcon();
      }

      let badge;
      if (item.props.renderBadge) {
        badge = item.props.renderBadge();
      } else if (item.props.badgeText) {
        badge = <Badge>{item.props.badgeText}</Badge>;
      }

      // this.props.actions.init({
      //   // from: this.props.routes.activeTab,
      //   name: item.props.title,
      //   // tabBarName: this.props.title,
      //   navigator: this.props.nav,
      // });
      return (
        <Tab
          {...this.props}
          nav={this.refs.nav}
          routes={this.routes}
          changeRoute={item.props.changeRoute}
          title={item.props.title}
          titleStyle={[
            item.props.titleStyle,
            item.props.selected ? [
              styles.defaultSelectedTitle,
              item.props.selectedTitleStyle,
            ] : null,
          ]}
          badge={badge}
          onPress={item.props.onPress}
          hidesTabTouch={this.props.hidesTabTouch}>
          {icon}
        </Tab>
      );
    }.bind(this);

    let { style, children, tabBarStyle, tabBarShadowStyle, sceneStyle, ...props } = this.props;
    return (
      <View style={styles.container}>
        <Navigator
          initialRoute={this.props.firstRoute}
          navigationBar={navigationBar}
          renderScene={this.renderScene}
          ref="nav"
          onDidFocus={this.onDidFocus}
        />
        <TabBar style={tabBarStyle} shadowStyle={tabBarShadowStyle}>
          {React.Children.map(children, _renderTab)}
        </TabBar>
      </View>
    )
  };
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  tabsContainer: {
    backgroundColor: '#f8f8f8',
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: Layout.tabBarHeight,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  shadow: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    height: Layout.pixel,
    position: 'absolute',
    left: 0,
    right: 0,
    top: Platform.OS === 'android' ? 0 : -Layout.pixel,
  },

});

Router.Tabitem = Tabitem;


module.exports =  {
  actions,
  Router,
  reducer,
};
