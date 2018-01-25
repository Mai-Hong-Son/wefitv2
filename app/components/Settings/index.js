/**
 * @providesModule WeFit.Components.Settings
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import I18n from 'react-native-i18n';
import _ from 'lodash';

// Components
import { TextButton } from 'app/components/Reusables/Buttons';
import CollapsibleScrollView from 'app/components/Reusables/CollapsibleScrollView';
import LanguagesBox from 'app/components/Reusables/LanguagesBox';
import FlexibleScrollView from 'app/components/Reusables/FlexibleScrollView';
import OptionsBox from 'app/components/Reusables/OptionsBox';

// Constants
import { COLORS } from 'app/constants/AppStyles';

// Models
import AccountSettings from 'app/models/AccountSettings';
import RemoteConfigs from 'app/models/RemoteConfigs';

// Utils
import { formatText } from 'app/utils';

// Locals
import AppInfoBox from './AppInfoBox';
import withConnect from './withConnect';

@withConnect
export default class Settings extends React.PureComponent {
  static navigationOptions = () => ({
    title: I18n.t('settings.title'),
  });

  static propTypes = {
    navigation: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
    remoteConfigs: PropTypes.instanceOf(RemoteConfigs).isRequired,
    settings: PropTypes.instanceOf(AccountSettings).isRequired,
    updateUserSettings: PropTypes.func.isRequired,
    userSettingsUpdate: PropTypes.shape({
      error: PropTypes.object,
      loading: PropTypes.bool.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    
    this.updateUserSettings = this.props.updateUserSettings.bind(this);

    const { settings: { language: selectedLanguage } } = this.props;
    const hideUnavailableIndices = this.hideUnavailableIndices;
    const notifyBeforeIndices = this.notifyBeforeIndices;

    this.state = {
      hideUnavailableIndices,
      notifyBeforeIndices,
      selectedLanguage,
    };
  }

  componentDidMount() {
    const { hideUnavailableIndices, notifyBeforeIndices } = this.state;
    this.unavailableSessionsOptions.selectOptions({ indices: hideUnavailableIndices });
    this.notifyBeforeOptions.selectOptions({ indices: notifyBeforeIndices });
  }

  componentWillReceiveProps(nextProps) {
    const { navigation: { goBack }, userSettingsUpdate } = this.props;
    const { userSettingsUpdate: nextUserSettings } = nextProps;

    if (userSettingsUpdate !== nextUserSettings) {
      const { error, loading } = nextUserSettings;
      if (!loading && error == null) goBack();
    }
  }

  get hideUnavailableIndices() {
    const { settings: { hide_unavailable_sessions: option } } = this.props;
    return option === true ? [0] : [];
  }

  get notifyBeforeIndices() {
    const {
      remoteConfigs: { notify_before_options: allOptions = [] },
      settings: { notify_before: notifyBefore },
    } = this.props;

    // Convert notifyBefore options into indices
    return _.map(notifyBefore, option => _.indexOf(allOptions, option));
  }

  get notifyBeforeTexts() {
    const { remoteConfigs: { notify_before_options: allOptions = [] } } = this.props;
    const template = I18n.t('settings.notifyBefore');
    return _.map(_.sortBy(allOptions), duration => formatText(template, duration));
  }

  get sectionTitles() {
    const { application, language, notifications, schedules } = I18n.t('settings.sections');
    
    // Last section with empty title is for SAVE CHANGES footer button
    return [schedules, notifications, language, application, ''];
  }

  get settingsParams() {
    const { remoteConfigs: { notify_before_options: allOptions = [] } } = this.props;
    const { hideUnavailableIndices, selectedLanguage, notifyBeforeIndices } = this.state;
    const hideUnavailableSessions = hideUnavailableIndices[0] === 0;
    const notifyBefore = _.map(notifyBeforeIndices, index => allOptions[index]);

    return {
      hide_unavailable_sessions: hideUnavailableSessions,
      language: selectedLanguage,
      notify_before: _.join(notifyBefore, ','),
    };
  }

  onSaveChanges = () => this.updateUserSettings(this.settingsParams);

  render() {
    const { userSettingsUpdate: { loading } } = this.props;
    const { selectedLanguage } = this.state;

    return (
      <FlexibleScrollView autoLock style={styles.container}>
        <CollapsibleScrollView
          collapsible={false}
          intermediate
          scrollEnabled={false}
          sectionTitles={this.sectionTitles}
        >
          <OptionsBox
            multiple
            onSelectMultipleOptions={options => (
              this.setState({ hideUnavailableIndices: options })
            )}
            optionTexts={[I18n.t('settings.hideUnavailableSessions')]}
            ref={ref => this.unavailableSessionsOptions = ref}
          /> 
          <OptionsBox
            multiple
            onSelectMultipleOptions={options => this.setState({ notifyBeforeIndices: options })}
            optionTexts={this.notifyBeforeTexts}
            ref={ref => this.notifyBeforeOptions = ref}
          />
          <LanguagesBox
            currentLanguage={selectedLanguage}
            formatDropdownName={({ nativeName }) => nativeName}
            formatName={({ nativeName }) => nativeName}
            onDataChanged={option => this.setState({ selectedLanguage: option })}
          />
          <AppInfoBox />
        </CollapsibleScrollView>
        <TextButton
          containerStyle={styles.saveButtonContainer}
          loading={loading}
          onPress={this.onSaveChanges}
          title={I18n.t('settings.saveChanges')}
        />
      </FlexibleScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WEFIT,
  },
  saveButtonContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
});
