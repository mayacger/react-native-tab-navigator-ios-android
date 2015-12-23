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
} from 'react-native';

import NavBarContainer from './src/components/NavBarContainer';

export default class Tabs extends Component {


  constructor (props) {
    super(props);
    this.state = {
      route: {
        name: null,
        index: null
      },
      dragStartX: null,
      didSwitchView: null,
    }
    this.onDidFocus = this.onDidFocus.bind(this);
    this.onBack = this.onBack.bind(this);
    this.onForward = this.onForward.bind(this);
    this.customAction = this.customAction.bind(this);
    this.renderScene = this.renderScene.bind(this);
  }

  /*
   * This changes the title in the navigation bar
   * It should preferrably be called for "onWillFocus" instad >
   * > but a recent update to React Native seems to break the animation
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

    return (
      <Navigator
        initialRoute={this.props.firstRoute}
        navigationBar={navigationBar}
        renderScene={this.renderScene}
        onDidFocus={this.onDidFocus}
      />
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    marginTop: 64
  },
});
