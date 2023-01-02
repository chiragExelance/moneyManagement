import React from 'react';
import {StyleSheet} from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import {colors} from '../helper/colorContant';

function Shadow({shadowStyle, children}) {
  return (
    <DropShadow style={[styles.shadowStyle, shadowStyle]}>
      {children}
    </DropShadow>
  );
}

const styles = StyleSheet.create({
  shadowStyle: {
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 3,
    shadowOpacity: 0.4,
    shadowColor: colors.grey,
  },
});

export default Shadow;