'use strict';

import React, {
  PropTypes,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Layout from './Layout';


const onSelect = props => el => {
  props.actions.changeTab({
    from: props.activeTab,
    name: el.props.name,
    navigator: props.navigator,
  });



  return {
    selectionColor: props.tabStyles.tint || '#037AFF',
  };
};

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
    let { title, badge, selectedStyle, routes } = this.props;

    let icon = React.Children.only(this.props.children);

    if (title) {
      title =
        <Text
          numberOfLines={1}
          style={[styles.title, this.props.titleStyle, routes.activeTab ===  title ? selectedStyle : null ]}>
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
    this.props.actions.changeTab({
      from: this.props.routes.activeTab,
      name: this.props.title,
      popTo: this.props.changeRoute,
      // tabBarName: this.props.title,
      navigator: this.props.nav,
    });
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
