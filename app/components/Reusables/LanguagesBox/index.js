/**
 * @providesModule WeFit.Components.Reusables.LanguagesBox
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, ViewPropTypes } from 'react-native';
import _ from 'lodash';

// Components
import DropdownMenu from 'app/components/Reusables/DropdownMenu';

// Constants
import { AVAILABLE_LANGUAGES } from 'redux/constants';

// Locals
import LanguageButton from './LanguageButton';

export default class LanguagesBox extends React.PureComponent {
  static propTypes = {
    containerStyle: ViewPropTypes.style,
    currentLanguage: PropTypes.oneOf(_.map(AVAILABLE_LANGUAGES, 'code')).isRequired,
    formatDropdownName: PropTypes.func,
    formatName: PropTypes.func,
    onDataChanged: PropTypes.func.isRequired,
  };
  
  static defaultProps = {
    formatDropdownName: null,
    formatName: null,
    containerStyle: null,
  };

  constructor(props) {
    super(props);
    
    this.onDataChanged = this.props.onDataChanged.bind(this);

    const { currentLanguage } = this.props;
    const selectedLanguage = _.find(AVAILABLE_LANGUAGES, { code: currentLanguage });
    this.state = { selectedLanguage };
  }

  formatDropdownName = language => {
    const { formatDropdownName } = this.props;
    if (formatDropdownName == null) return null;
    return formatDropdownName.bind(this)(language);
  };

  formatName = language => {
    const { formatName } = this.props;
    if (formatName == null) return null;
    return formatName.bind(this)(language);
  };
  
  onChangeLanguage = () => this.languagesDropdown.showForNode(this.languageButton);
  onLayout = () => {};

  onSelectOption = language => {
    this.setState({ selectedLanguage: language });
    this.onDataChanged(language.code);
  };

  renderOption = language => {
    const { code } = language;
    const name = this.formatDropdownName(language);
    return <LanguageButton code={code} name={name} style={styles.languageOption} />;
  };

  render() {
    const { containerStyle } = this.props;
    const { selectedLanguage } = this.state;
    const { code } = selectedLanguage;
    const name = this.formatName(selectedLanguage);

    return (
      <View style={[styles.container, containerStyle]}>
        <LanguageButton
          code={code}
          hasCarret
          name={name}
          onPress={this.onChangeLanguage}
          ref={ref => this.languageButton = ref}
          style={styles.languageButton}
        />
        <DropdownMenu
          onSelectOption={this.onSelectOption}
          options={AVAILABLE_LANGUAGES}
          ref={ref => this.languagesDropdown = ref}
          renderOption={this.renderOption}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  languageButton: {
    borderRadius: 4,
  },
  languageOption: {
    backgroundColor: 'transparent',
  },
});
