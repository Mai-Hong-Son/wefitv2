/**
 * @providesModule WeFit.Components.AppNavigator.RootNavigator.MainStack.GoalsHeader
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, Text, View } from 'react-native';
import I18n from 'react-native-i18n';
import { DeviceUtils, FontUtils } from '@onaclover/react-native-utils';
import { Circle as CircleProgress } from 'react-native-progress';

// Components
import Props from 'app/components/Reusables/Props';
import { MAIN_ROUTES } from 'app/constants/RouteNames';

// Constants
import { FEATURES } from 'app/constants/Flags';
import { COLORS, NAVIGATION, SHEETS } from 'app/constants/AppStyles';

// Locals
import SetGoalsButton from './SetGoalsButton';
import withConnect from './withConnect';

@withConnect
export default class GoalsHeader extends React.PureComponent {
  static propTypes = {
    goals: Props.goals.isRequired,
    onPress: PropTypes.func.isRequired,
  };

  state = { progress: 0, progressText: '0' };

  componentDidMount() {
    setTimeout(this.updateProgress, 200);
  }

  updateProgress = () => {
    const { goals: { finish, target } } = this.props;
    const progress = target > 0 ? finish / target : 0;
    const progressText = target > 0 ? `${finish}/${target}` : '0';
    this.setState({ progress, progressText });
  };

  renderStatus() {
    const { goals: { basis, finish, target } } = this.props;
    
    const useTodayTemplate = basis === 'day';
    const basisText = I18n.t(`setGoals.durations.${basis}`);

    if (target === 0)
      return <Text style={styles.info}>{I18n.t('setGoals.header.noGoals')}</Text>;

    // Already finished
    if (finish === target) {
      if (useTodayTemplate)
        return <Text style={styles.info}>{I18n.t('setGoals.header.finishedToday')}</Text>;

      const [congrats, thisDuration] = I18n.t('setGoals.header.finished');
      return <Text style={styles.info}>{congrats + basisText + thisDuration}</Text>;
    }

    const [youHave, moreSessions, thisDuration] = useTodayTemplate
      ? I18n.t('setGoals.header.remainToday').split(/\{\d\}/)
      : I18n.t('setGoals.header.remain').split(/\{\d\}/);

    return (
      <Text style={styles.info}>
        {youHave}
        <Text style={styles.highlight}>{target - finish}</Text>
        {thisDuration == null ? moreSessions : moreSessions + basisText + thisDuration}
      </Text>
    );
  }

  render() {
    const { onPress } = this.props;
    const { progress, progressText } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          {this.renderStatus()}
          <SetGoalsButton onPress={onPress} />
        </View>
        <CircleProgress
          borderWidth={0}
          color={COLORS.PINK}
          formatText={() => progressText}
          indeterminate={false}
          progress={progress}
          showsText
          size={82}
          textStyle={styles.progressText}
          thickness={6}
          unfilledColor={COLORS.ALL_E}
        />
      </View>
    );
  }
}

export const withGoalsHeader = {
  navigationOptions: ({ navigation: { navigate } }) => {
    if (!FEATURES.TRAINING_GOALS) return {
      headerStyle: NAVIGATION.defaultHeader,
      headerTitleStyle: NAVIGATION.headerTitle,
      title: I18n.t('mySessions.title'),
    };
    
    return {
      headerStyle: [NAVIGATION.defaultHeader, NAVIGATION.goalsHeader],
      headerTitle: <GoalsHeader onPress={() => navigate(MAIN_ROUTES.GOALS)} />,
    };
  },
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.horizontalFlex,
    backgroundColor: 'white',
    borderRadius: 4,
    height: 114,
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: DeviceUtils.screen.width - 16 * 2,
    ...Platform.select({ android: { marginLeft: 16 } }),
  },

  content: {
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'space-between',
    marginRight: 16,
    marginTop: 6,
  },

  info: FontUtils.build({
    color: COLORS.WEFIT,
    size: 14,
  }),
  highlight: FontUtils.build({
    color: COLORS.PINK,
    size: 14,
    weight: 'semibold',
  }),

  progressText: FontUtils.build({
    color: COLORS.WEFIT,
    size: 30,
  }),
});
