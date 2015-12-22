/**
* mayacger
* react-native-tab-navigator-ios-android
**/
'use strict';
import { Set } from 'immutable';
import React, {
  PropTypes,
  StyleSheet,
  View,
  Text,
  Component,
} from 'react-native';
import TabBar from './src/TabBar';
import Layout from './src/Layout';
import Tab from './src/tab';

export default class Tabs extends Component {
  static propTypes = {
    ...View.propTypes,
    sceneStyle: View.propTypes.style,
    // tabBarStyle: TabBar.propTypes.style,
    // tabBarShadowStyle: TabBar.propTypes.shadowStyle,
    hidesTabTouch: PropTypes.bool
  }

  constructor (props) {
    super(props);
    console.log(props.children)
    this.state = {
      renderedSceneKeys: this._updateRenderedSceneKeys(props.children),
    };
    this._renderTab = this._renderTab.bind(this);
  }


  componentWillReceiveProps(nextProps) {
    let { renderedSceneKeys } = this.state;
    this.setState({
      renderedSceneKeys: this._updateRenderedSceneKeys(
        nextProps.children,
        renderedSceneKeys,
      ),
    });
  }

  _updateRenderedSceneKeys(children, oldSceneKeys = Set()): Set {
    let newSceneKeys = Set().asMutable();
    // React.Children.forEach(children, (item, index) => {
    //   let key = this._getSceneKey(item, index);
    //   if (oldSceneKeys.has(key) || item.props.selected) {
    //     newSceneKeys.add(key);
    //   }
    // });
    return newSceneKeys.asImmutable();
  }

  _renderTab(item) {
    let icon;
    if (item.props.selected) {
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

    return (
      <Tab
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
  }

  render () {
    let { style, children, tabBarStyle, tabBarShadowStyle, sceneStyle, ...props } = this.props;
    let scenes = [];
    return (
      <View {...props} style={[styles.container, style]}>
        {scenes}
        <TabBar style={tabBarStyle} shadowStyle={tabBarShadowStyle}>
          {React.Children.map(children, this._renderTab)}
        </TabBar>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sceneContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: Layout.tabBarHeight,
  },
  hiddenSceneContainer: {
    overflow: 'hidden',
    opacity: 0,
  },
  defaultSelectedTitle: {
    color: 'rgb(0, 122, 255)',
  },
  defaultSelectedIcon: {
    tintColor: 'rgb(0, 122, 255)',
  },
});
