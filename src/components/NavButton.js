'use strict';

import React, {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Component,
} from 'react-native';

export default class NavButton extends Component {

  constructor (props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress () {
    this.props.onPress();
  }

  render() {
    var backButton;

    if (this.props.backButtonComponent) {
      var BackButton = this.props.backButtonComponent;
      backButton = <View><BackButton /></View>
    } else {
      backButton = <Text style={styles.navbarText}>Back</Text>
    }

    return (
      <TouchableHighlight onPress={this.onPress} underlayColor="transparent">
        {backButton}
      </TouchableHighlight>
    )
  }

}

var styles = StyleSheet.create({
  navbarText: {
    color: 'white',
    fontSize: 16,
    margin: 10,
    fontWeight: '600',
    textAlign: 'center',
    alignItems: 'center',
  }
});
