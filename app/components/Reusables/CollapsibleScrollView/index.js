/**
 * @providesModule WeFit.Components.Reusables.CollapsibleScrollView
 */

import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet } from 'react-native';
import _ from 'lodash';

// Components
import { LoadingPlaceholder } from 'app/components/Reusables/Loadings';

// Locals
import CollapsibleSection from './CollapsibleSection';
import FooterBox from './FooterBox';

export { FooterBox };

export default class CollapsibleScrollView extends React.PureComponent {
  static propTypes = {
    ...ScrollView.propTypes,
    collapsible: PropTypes.bool,
    intermediate: PropTypes.bool,
    sectionTitles: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  static defaultProps = {
    ...ScrollView.defaultProps,
    collapsible: true,
    intermediate: false,
    scrollEnabled: true,
  }

  constructor(props) {
    super(props);
 
    this.state = {
      renderPlaceholderOnly: !this.props.intermediate,
      sectionVisibleStatuses: this.defaultVisibleStatuses,
    };
  }

  componentDidMount() {
    setTimeout(() => this.setState({ renderPlaceholderOnly: false }), 200);
  }

  get defaultVisibleStatuses() {
    const { sectionTitles: { length: sectionsCount } } = this.props;
    return _.zipObject(_.range(sectionsCount), Array(sectionsCount).fill(true));
  }

  clear = ({ scrollTop = true } = {}) => {
    scrollTop && this.scrollView.scrollTo({ animated: true, y: 0 });
    this.setState({ sectionVisibleStatuses: this.defaultVisibleStatuses });
  };
  
  onToggleSection = index => {
    const { sectionVisibleStatuses } = this.state;
    const { [index]: visible } = sectionVisibleStatuses;
    const newVisibleStatuses = { ...sectionVisibleStatuses, [index]: !visible };
    this.setState({ sectionVisibleStatuses: newVisibleStatuses });
  };

  renderSection = index => {
    // If we have only 1 child, then all indexes bigger than 0 can be eliminated
    if (_.isPlainObject(children) && index > 0) return null;

    const { children, collapsible, sectionTitles } = this.props;
    const { renderPlaceholderOnly, sectionVisibleStatuses: { [index]: visible } } = this.state;
    
    const key = `collapsible_section_${index}`;
    const title = sectionTitles[index];
    const onToggle = collapsible ? this.onToggleSection : undefined;

    const childContent = (children instanceof Array) ? children[index] : children;

    if (title == null || childContent == null) return null;

    const content = renderPlaceholderOnly
      ? <LoadingPlaceholder color="#ffffff" size={40} style={styles.placeholder} />
      : childContent;
    
    const sectionProps = { index, key, onToggle, renderPlaceholderOnly, title, visible };

    return (
      <CollapsibleSection {...sectionProps}>
        {content}
      </CollapsibleSection>
    );
  };

  render() {
    const { sectionTitles } = this.props;

    return (
      <ScrollView
        {...this.props}
        ref={ref => this.scrollView = ref}
        showsVerticalScrollIndicator={false}
      >
        {_.map(sectionTitles, (title, index) => this.renderSection(index))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  placeholder: {
    paddingTop: 10,
  },
});
