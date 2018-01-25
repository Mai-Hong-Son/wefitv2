/**
 * @providesModule WeFit.Components.Reusables.ReservationCodeBox
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import Button from 'react-native-button';
import I18n from 'react-native-i18n';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Components
import Tooltips from 'app/components/Reusables/Tooltips';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

// Content width = 33% of container width
const SHOW_TITLE_TRIGGER = 0.33;

export default class ReservationCodeBox extends React.PureComponent {
  static propTypes = {
    code: PropTypes.string,
    onCopy: PropTypes.func,
  };
  
  static defaultProps = {
    code: null,
    onCopy: null,
  };

  state = { containerWidth: 0, contentWidth: 0 };

  get shouldShowTitle() {
    const { containerWidth, contentWidth } = this.state;
    return contentWidth / containerWidth <= SHOW_TITLE_TRIGGER;
  }

  onContainerLayout = event => {
    if (this.state.containerWidth > 0) return;
    const { width } = event.nativeEvent.layout;
    this.setState({ containerWidth: width });
  };
  
  onContentLayout = event => {
    if (this.state.contentWidth > 0) return;
    const { width } = event.nativeEvent.layout;
    this.setState({ contentWidth: width });
  };

  onHelp = () => this.tooltips.showForNode(
    this.helpIcon,
    I18n.t('sessionDetail.reservationCode.tooltips'),
  );

  render() {
    const { code, onCopy } = this.props;
    if (_.isEmpty(code)) return null;

    const helpButton = (
      <Button
        containerStyle={styles.helpButton}
        onPress={this.onHelp}
        ref={ref => this.helpIcon = ref}
      >
        <FontAwesome color={COLORS.PINK} name="question-circle" size={28} />
      </Button>
    );

    const copyButton = (
      <Button containerStyle={styles.copyButton} onPress={onCopy}>
        <MaterialCommunityIcons color={COLORS.WEFIT} name="content-copy" size={24} />
      </Button>
    );
  
    return (
      <View
        onLayout={this.onContainerLayout}
        style={[styles.container, onCopy == null && styles.containerFlex]}
      >
        {this.shouldShowTitle && (
          <Text style={styles.title}>{I18n.t('sessionDetail.reservationCode.title')}</Text>
        )}
        <Text onLayout={this.onContentLayout} style={styles.reservationCode}>{code}</Text>
        {onCopy != null ? copyButton : helpButton}
        <Tooltips ref={ref => this.tooltips = ref} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...SHEETS.horizontalFlex,
    alignSelf: 'stretch',
    backgroundColor: COLORS.PINK_OPAQUE,
    borderRadius: 4,
    height: 44,
    marginTop: 16,
  },
  containerFlex: {
    flex: 1,
  },
  title: FontUtils.build({
    color: COLORS.WEFIT,
    size: 14,

    // Extra
    marginRight: 5,
  }),
  reservationCode: FontUtils.build({
    color: COLORS.WEFIT,
    size: 24,
    weight: 'semibold',
  }),
  helpButton: {
    bottom: 0,
    position: 'absolute',
    right: 16,
    top: 8,
  },
  copyButton: {
    position: 'absolute',
    right: 16,
  },
});
