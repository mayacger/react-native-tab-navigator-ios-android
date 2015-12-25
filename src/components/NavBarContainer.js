'use strict';

import React, {
  StyleSheet,
  View,
  Text,
  Component,
} from 'react-native';


import NavBarContent  from './NavBarContent';


export default class NavBarContainer extends Component {

  constructor (props) {
    super(props);

    this.state = {
      backButtonOpacity: 0,
      previousRoute: {} // Keep previousRoute for smooth transitions
    }
    this.goBack = this.goBack.bind(this);
    this.goForward = this.goForward.bind(this);
    this.customAction = this.customAction.bind(this);
  }

  componentWillReceiveProps (newProps) {
    if (this.props && this.props.currentRoute.index !== newProps.currentRoute.index) {
      this.setState({
        previousRoute: this.props.currentRoute
      });
    }
  }

  goBack () {
    this.props.toBack(this.props.navigator);
  }

  goForward (route) {
    this.props.toRoute(route, this.props.navigator);
  }

  customAction (opts) {
    this.props.customAction(opts);
  }

  // We render both the current and the previous navbar (for animation)
  render () {
    return (
        <View style={[styles.navbarContainer]}>
          <NavBarContent
            route={this.state.previousRoute}
            backButtonComponent={this.props.backButtonComponent}
            rightCorner={this.props.rightCorner}
            headerStyle={this.props.style}
            titleStyle={this.props.titleStyle}
            willDisappear="true"
          />
          <NavBarContent
            route={this.props.currentRoute}
            backButtonComponent={this.props.backButtonComponent}
            rightCorner={this.props.rightCorner}
            headerStyle={this.props.style}
            titleStyle={this.props.titleStyle}
            goBack={this.goBack}
            goForward={this.goForward}
            customAction={this.customAction}
          />
        </View>

    )
  }


}


var styles = StyleSheet.create({

  navbarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 64,
    // backgroundColor: '#5589B7'
  }
});
