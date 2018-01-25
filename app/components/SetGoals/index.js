/**
 * @providesModule WeFit.Components.SetGoals
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import I18n from 'react-native-i18n';
import { Logger } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Components
import CollapsibleScrollView, { FooterBox } from 'app/components/Reusables/CollapsibleScrollView';
import { LoadingPlaceholder } from 'app/components/Reusables/Loadings';
import OptionsBox from 'app/components/Reusables/OptionsBox';
import Props from 'app/components/Reusables/Props';

// Constants
import { COLORS } from 'app/constants/AppStyles';

// Locals
import withConnect from './withConnect';

@withConnect
export default class SetGoals extends React.PureComponent {
  static navigationOptions = () => ({
    title: I18n.t('setGoals.title'),
  });

  static propTypes = {
    goals: Props.goals.isRequired,
  };

  get sectionTitles() {
    return [I18n.t('setGoals.sections.plans'), I18n.t('setGoals.sections.detail')];
  }

  get planConfigs() {
    return [
      {
        basis: I18n.t('setGoals.durations.week'),
        level: 1,
        name: I18n.t('setGoals.planNames.basic'), target: 8,
      },
      {
        basis: I18n.t('setGoals.durations.week'),
        level: 2,
        name: I18n.t('setGoals.planNames.standard'), target: 3,
      },
      {
        basis: I18n.t('setGoals.durations.week'),
        level: 3,
        name: I18n.t('setGoals.planNames.advanced'), target: 5,
      },
      {
        basis: I18n.t('setGoals.durations.day'),
        level: 0,
        name: I18n.t('setGoals.planNames.custom'), target: 1,
      },
    ];
  }
  
  onClearGoals = () => {
    this.optionsBox.clear();
  };

  onSelectOption = planIndex => Logger.debug(planIndex);
  onSubmitGoals = () => {};

  render() {
    return (
      <View style={styles.container}>
        <CollapsibleScrollView
          collapsible={false}
          scrollEnabled={false}
          sectionTitles={this.sectionTitles}
        >
          <OptionsBox
            onSelectOption={this.onSelectOption}
            optionTexts={_.map(this.planConfigs, 'name')}
            ref={ref => this.optionsBox = ref}
          />
          <LoadingPlaceholder color="#ffffff" size={40} style={styles.placeholder} />
        </CollapsibleScrollView>
        <FooterBox
          clearTitle={I18n.t('setGoals.buttons.clear')}
          onClear={this.onClearGoals}
          onSubmit={this.onSubmitGoals}
          submitTitle={I18n.t('setGoals.buttons.submit')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WEFIT,
  },
  placeholder: {
    paddingTop: 10,
  },
});
