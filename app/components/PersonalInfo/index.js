/**
 * @providesModule WeFit.Components.PersonalInfo
 */

import React from 'react';
import PropTypes from 'prop-types';
import { BackHandler, StyleSheet, View } from 'react-native';
import Button from 'react-native-button';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Components
import { TextButton } from 'app/components/Reusables/Buttons';
import FlexibleScrollView from 'app/components/Reusables/FlexibleScrollView';

// Constants
import { PATTERNS } from 'app/constants/AppConstants';
import { COLORS } from 'app/constants/AppStyles';
import { DEBUGS } from 'app/constants/Flags';
import { MAIN_ROUTES, ROOT_ROUTES } from 'app/constants/RouteNames';
import { GLOBAL_ALERT_TYPES } from 'redux/constants';

// Locals
import ChangeAvatarBox from './ChangeAvatarBox';
import InputFields from './InputFields';
import withConnect from './withConnect';

@withConnect
export default class PersonalInfo extends React.PureComponent {
  static navigationOptions = () => ({
    title: I18n.t('personalInfo.title'),
  });

  static propTypes = {
    deauthorize: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
      navigate: PropTypes.func.isRequired,
      state: PropTypes.shape({
        routeName: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    personalInfo: PropTypes.shape({
      error: PropTypes.object,
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    showGlobalAlert: PropTypes.func.isRequired,
    updatePersonalInfo: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.deauthorize = this.props.deauthorize.bind(this);
    this.showGlobalAlert = this.props.showGlobalAlert.bind(this);
    this.updatePersonalInfo = this.props.updatePersonalInfo.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('backPress', () => this.forFirstTimeUpdate);
  }

  componentWillReceiveProps(nextProps) {
    const { navigation: { goBack }, personalInfo } = this.props;
    const { personalInfo: nextPersonalInfo } = nextProps;

    if (personalInfo !== nextPersonalInfo) {
      const { error, loading } = nextPersonalInfo;
      
      if (!loading && error == null) {
        this.showGlobalAlert({
          message: I18n.t('personalInfo.success'),
          title: I18n.t('globalAlert.updatePersonalInfo'),
          type: GLOBAL_ALERT_TYPES.SUCCESS,
        });

        goBack();
      }
    }
  }

  get forFirstTimeUpdate() {
    const { navigation: { state: { routeName } } } = this.props;
    return routeName === ROOT_ROUTES.UPDATE_INFO;
  }

  validateInputs = () => {
    const { city_code: cityCode, email, name, phone } = this.inputFields.infoData;
    const {
      emptyCity, emptyEmail, emptyName, emptyPhone, invalidEmail, invalidPhone,
    } = I18n.t('validations');

    if (_.isEmpty(name)) return emptyName;
    
    if (_.isEmpty(phone)) return emptyPhone;
    if (phone.match(PATTERNS.PHONE) == null) return invalidPhone;
    
    if (cityCode == null) return emptyCity;
    
    if (_.isEmpty(email)) return emptyEmail;
    if (email.match(PATTERNS.EMAIL) == null) return invalidEmail;

    return null;
  };

  onNavigateChangePassword = () => {
    const { navigation: { navigate } } = this.props;
    navigate(MAIN_ROUTES.CHANGE_PASSWORD);
  };
  
  onSaveChanges = () => {
    const message = this.validateInputs();
    
    if (_.isEmpty(message)) {
      this.updatePersonalInfo(this.inputFields.infoData);
      return;
    }

    const { updatePersonalInfo: title } = I18n.t('globalAlert');
    this.showGlobalAlert({ message, title, type: GLOBAL_ALERT_TYPES.ERROR });
  };

  render() {
    const { personalInfo: { loading } } = this.props;

    return (
      <FlexibleScrollView
        autoLock
        shouldAwareKeyboard
        style={styles.container}
      >
        <View style={this.forFirstTimeUpdate && styles.contentFirstTime}>
          <ChangeAvatarBox />
          <InputFields
            forFirstTimeUpdate={this.forFirstTimeUpdate}
            onChangePassword={this.onNavigateChangePassword}
            onRef={ref => this.inputFields = ref}
          />
        </View>
        <TextButton
          containerStyle={styles.saveButton}
          loading={loading}
          onPress={this.onSaveChanges}
          title={I18n.t('personalInfo.saveChanges')}
        />
        {DEBUGS.LOGOUT_IN_PERSONAL_INFO && (
          <Button onPress={this.deauthorize} style={styles.logoutButton}>
            {I18n.t('settings.appInfo.logout')}
          </Button>
        )}
      </FlexibleScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WEFIT,
    paddingHorizontal: 16,
  },
  contentFirstTime: {
    paddingTop: 20,
  },
  saveButton: {
    marginBottom: 16,
    marginTop: 20,
  },
  logoutButton: FontUtils.build({
    align: 'center',
    color: 'white',
    marginBottom: 16,
    size: 17,
    weight: 'semibold',
  }),
});
