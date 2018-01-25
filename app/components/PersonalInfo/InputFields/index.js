/**
 * @providesModule WeFit.Components.PersonalInfo.InputFields
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import I18n from 'react-native-i18n';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { FontUtils } from '@onaclover/react-native-utils';
import moment from 'moment';
import _ from 'lodash';

// Components
import DropdownMenu from 'app/components/Reusables/DropdownMenu';
import { TextButton } from 'app/components/Reusables/Buttons';

// Constants
import { FORMATS } from 'app/constants/AppConstants';
import { COLORS, SHEETS } from 'app/constants/AppStyles';
import { DEBUGS, FEATURES } from 'app/constants/Flags';

// Models
import { City } from 'app/models/BaseStaticData';
import Studio from 'app/models/Studio';
import User from 'app/models/User';

// Locals
import ButtonBox from './ButtonBox';
import InputBox from './InputBox';
import withConnect from './withConnect';

/* eslint-disable newline-per-chained-call */
const MAX_BIRTHDAY = moment().subtract(15, 'years').startOf('day').toDate();
const MIN_BIRTHDAY = moment().subtract(85, 'years').startOf('day').toDate();
/* eslint-enable newline-per-chained-call */

@withConnect
export default class InputFields extends React.PureComponent {
  static propTypes = {
    cities: PropTypes.arrayOf(PropTypes.instanceOf(City)).isRequired,
    forFirstTimeUpdate: PropTypes.bool,
    onChangePassword: PropTypes.func.isRequired,
    onRef: PropTypes.func,
    studiosByCity: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.instanceOf(Studio))).isRequired,
    userData: PropTypes.instanceOf(User).isRequired,
  };

  static defaultProps = {
    forFirstTimeUpdate: false,
    onRef: null,
  };

  constructor(props) {
    super(props);

    const { cities, onChangePassword, onRef, studiosByCity, userData } = this.props;

    this.onChangePassword = onChangePassword.bind(this);
    if (onRef != null) onRef.bind(this)(this);

    const pairs = _.map(studiosByCity, (studios, cityCode) => [
      cityCode, _.countBy(studios, 'is_enabled')[true],
    ]);
    this.studiosCountByCity = _.fromPairs(pairs);
    
    const { birthday, city_code: cityCode, email, gender: genderCode, name, phone } = userData;
    const city = _.find(cities, { code: cityCode });
    const gender = _.find(this.genders, { code: genderCode });
    this.state = {
      city, email, gender, name, phone,
      birthday: birthday == null ? null : moment(birthday),
      datePickerVisible: false,
    };
  }

  get genders() {
    const { female, male, other } = I18n.t('personalInfo.fields.genders');

    return [
      { code: 'f', name: female },
      { code: 'm', name: male },
      { code: 'o', name: other },
    ];
  }

  get infoData() {
    const {
      birthday, email, name, phone,
      city: { code: cityCode } = {},
      gender: { code: gender } = {},
    } = this.state;
    
    return {
      email, gender, name, phone,
      birthday: birthday == null ? undefined : birthday.format(FORMATS.JSON_DATE),
      city_code: cityCode,
    };
  }

  onSelectBirthday = date => this.setState({ birthday: moment(date), datePickerVisible: false });
  onSelectCity = city => this.setState({ city });
  onSelectGender = gender => this.setState({ gender });

  renderCityOption = ({ code, name }) => {
    const { [code]: studiosCount } = this.studiosCountByCity;

    return (
      <View style={styles.optionContainer}>
        <Text numberOfLines={1} style={styles.optionTitle}>{name}</Text>
        {FEATURES.STUDIOS_COUNT_ON_CITY_SELECT && (
          <Text style={styles.optionSubTitle}>
            {`${studiosCount} ${I18n.t('personalInfo.fields.city.studios')}`}
          </Text>
        )}
      </View>
    );
  };
  
  renderGenderOption = ({ name }) => (
    <View style={styles.optionContainer}>
      <Text numberOfLines={1} style={styles.optionTitle}>{name}</Text>
    </View>
  );

  renderPickerCancelIOS = () => (
    <View style={styles.pickerActionContainer}>
      <Text style={[styles.pickerActionText, styles.pickerActionCancel]}>
        {I18n.t('personalInfo.birthdayPicker.cancel')}
      </Text>
    </View>
  );
  
  renderPickerConfirmIOS = () => (
    <View style={styles.pickerActionContainer}>
      <Text style={styles.pickerActionText}>
        {I18n.t('personalInfo.birthdayPicker.confirm')}
      </Text>
    </View>
  );

  render() {
    const { cities, forFirstTimeUpdate } = this.props;
    const { birthday, city, datePickerVisible, email, gender, name, phone } = this.state;

    const {
      buttonPlaceholder,
      city: cityField,
      email: emailField,
      fullName,
      genders,
      phone: phoneField,
    } = I18n.t('personalInfo.fields');

    const criticalEditable = DEBUGS.PERSONAL_INFO_EDITABLE || forFirstTimeUpdate;

    return (
      <View>
        <InputBox
          autoCapitalize="words"
          editable={criticalEditable}
          mandatory
          onChangeText={name => this.setState({ name })}
          onSubmitEditing={() => this.phoneInput.focus()}
          placeholder={fullName.placeholder}
          ref={ref => this.fullNameInput = ref}
          title={fullName.title}
          value={name}
        />
        <View style={SHEETS.horizontalFlex}>
          <InputBox
            editable={criticalEditable}
            flexSize
            keyboardType="phone-pad"
            mandatory
            onChangeText={phone => this.setState({ phone })}
            onSubmitEditing={() => this.emailInput.focus()}
            placeholder={phoneField.placeholder}
            ref={ref => this.phoneInput = ref}
            title={phoneField.title}
            value={phone}
          />
          <View style={styles.gap} />
          <ButtonBox
            buttonRef={ref => this.cityButton = ref}
            mandatory
            onPress={() => this.citiesDropdown.showForNode(this.cityButton)}
            placeholder={buttonPlaceholder}
            title={cityField.title}
            value={_.get(city, 'name')}
          />
        </View>
        <InputBox
          keyboardType="email-address"
          mandatory
          onChangeText={email => this.setState({ email })}
          placeholder={emailField.placeholder}
          ref={ref => this.emailInput = ref}
          title={emailField.title}
          value={email}
        />
        <View style={SHEETS.horizontalFlex}>
          <ButtonBox
            buttonRef={ref => this.genderButton = ref}
            onPress={() => this.gendersDropdown.showForNode(this.genderButton)}
            placeholder={buttonPlaceholder}
            title={genders.title}
            value={_.get(gender, 'name')}
          />
          <View style={styles.gap} />
          <ButtonBox
            onPress={() => this.setState({ datePickerVisible: true })}
            placeholder={buttonPlaceholder}
            title={I18n.t('personalInfo.birthdayPicker.title')}
            value={birthday == null ? null : birthday.format(I18n.t('formats.membershipDate'))}
          />
        </View>
        {!forFirstTimeUpdate && (
          <View style={styles.changePasswordContainer}>
            <TextButton
              bordering
              fitContent
              onPress={this.onChangePassword}
              short
              title={I18n.t('welcome.emailAuth.titles.changePassword')}
            />
          </View>
        )}
        <DropdownMenu
          onSelectOption={this.onSelectCity}
          options={cities}
          ref={ref => this.citiesDropdown = ref}
          renderOption={this.renderCityOption}
        />
        <DropdownMenu
          onSelectOption={this.onSelectGender}
          options={this.genders}
          ref={ref => this.gendersDropdown = ref}
          renderOption={this.renderGenderOption}
        />
        <DateTimePicker
          customCancelButtonIOS={this.renderPickerCancelIOS()}
          customConfirmButtonIOS={this.renderPickerConfirmIOS()}
          date={birthday == null ? MAX_BIRTHDAY : birthday.toDate()}
          isVisible={datePickerVisible}
          maximumDate={MAX_BIRTHDAY}
          minimumDate={MIN_BIRTHDAY}
          onCancel={() => this.setState({ datePickerVisible: false })}
          onConfirm={this.onSelectBirthday}
          titleIOS={I18n.t('personalInfo.birthdayPicker.title')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  gap: {
    width: 21,
  },

  optionContainer: {
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  optionTitle: FontUtils.build({
    color: COLORS.WEFIT,
    size: 17,
  }),
  optionSubTitle: FontUtils.build({
    color: COLORS.TRIPLE_6E,
    size: 14,
    
    // Extra
    marginTop: 3,
  }),

  changePasswordContainer: {
    ...SHEETS.horizontalFlex,
    marginTop: 20,
  },

  pickerActionContainer: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
  },
  pickerActionText: FontUtils.build({
    align: 'center',
    color: COLORS.WEFIT,
    size: 17,
    weight: 'semibold',
  }),
  pickerActionCancel: {
    color: COLORS.PINK,
  },
});
