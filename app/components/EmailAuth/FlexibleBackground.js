/**
 * @providesModule WeFit.Components.EmailAuth.FlexibleBackground
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Image, ScrollView, StyleSheet, View, ViewPropTypes } from 'react-native';
import { DeviceUtils } from '@onaclover/react-native-utils';

// Constants
import { COLORS, HEADER_HEIGHT, SCALE_FACTOR, SHEETS } from 'app/constants/AppStyles';

export default function FlexibleBackground({ children, contentContainerStyle }) {
  return (
    <View style={styles.container}>
      <ScrollView scrollEnabled={false} showsVerticalScrollIndicator={false}>
        <View style={[styles.content, contentContainerStyle]}>
          {children}
        </View>
        <Image source={require('app/assets/images/footer-art.png')} style={styles.footerArt} />
      </ScrollView>
    </View>
  );
}

FlexibleBackground.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  contentContainerStyle: ViewPropTypes.style,
};

FlexibleBackground.defaultProps = {
  contentContainerStyle: null,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.container,
    backgroundColor: COLORS.WEFIT,
  },
  content: {
    backgroundColor: 'transparent',
    marginTop: HEADER_HEIGHT + 46,
    paddingHorizontal: 16,
    paddingBottom: 40,
    width: DeviceUtils.screen.width,
  },
  footerArt: {
    marginTop: 5,
    height: 250 * SCALE_FACTOR,
    resizeMode: 'cover',
    width: DeviceUtils.screen.width,
  },
});
