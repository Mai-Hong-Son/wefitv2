/**
 * @providesModule WeFit.Components.Reusables.UserAvatar
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, View } from 'react-native';

export default function UserAvatar({ uri }) {
  const defaultSource = require('app/assets/images/placeholder-avatar.png');
  const props = uri == null
    ? { source: defaultSource }
    : { defaultSource, source: { uri } };
  
  return (
    <View style={styles.container}>
      <Image {...props} style={styles.avatar} />
    </View>
  );
}

UserAvatar.propTypes = {
  uri: PropTypes.string,
};

UserAvatar.defaultProps = {
  uri: null,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 50,
    height: 100,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 100,
  },
  avatar: {
    borderRadius: 46,
    height: 92,
    width: 92,
  },
});
