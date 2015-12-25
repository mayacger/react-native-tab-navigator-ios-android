'use strict';

import React, {
  PropTypes,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Layout from './Layout';

export default class Tab extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    titleStyle: Text.propTypes.style,
    badge: PropTypes.element,
    onPress: PropTypes.func,
    hidesTabTouch: PropTypes.bool
  };

  constructor(props, context) {
    super(props, context);

    this._handlePress = this._handlePress.bind(this);
  }

  render() {
    let { title, badge } = this.props;
    let icon = React.Children.only(this.props.children);

    if (title) {
      title =
        <Text
          numberOfLines={1}
          style={[styles.title, this.props.titleStyle]}>
          {title}
        </Text>;
    }

    if (badge) {
      badge = React.cloneElement(badge, {
        style: [styles.badge, badge.props.style],
      });
    }

    let tabStyle = [styles.container, title ? null : styles.untitledContainer];
    return (
      <TouchableOpacity
        activeOpacity={this.props.hidesTabTouch ? 1.0 : 0.8}
        onPress={this._handlePress}
        style={tabStyle}>
        <View>
          {icon}
          {badge}
        </View>
        {title}
      </TouchableOpacity>
    );
  }

  _handlePress(event) {
    console.log(this.props)
    let changeRoute = this.props.changeRoute;
    // this.props.toRoute({
    //   name: changeRoute.name,
    //   component: changeRoute.component,
    //   rightCorner: changeRoute.rightCorner,
    //   titleComponent: changeRoute.titleComponent,
    // })
    if (this.props.onPress) {
      this.props.onPress(event);
    }
  }
}

let styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  untitledContainer: {
    paddingBottom: 13,
  },
  title: {
    color: '#929292',
    fontSize: 10,
    textAlign: 'center',
    alignSelf: 'stretch',
    marginTop: 4,
    marginBottom: 1 + Layout.pixel,
  },
});
