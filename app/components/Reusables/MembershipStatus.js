/**
 * @providesModule WeFit.Components.Reusables.MembershipStatus
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text } from 'react-native';

// Components
import HighlightText from 'app/components/Reusables/HighlightText';

export default function MembershipStatus({ color, expireStats, templates }) {
  const { hasExpired, noQuota, notActivated, quota: { plural, singular } } = templates;
  const { activated, expired, expireDate, remainQuota } = expireStats;

  const textStyle = [styles.text, { color }];

  if (!activated)
    return <Text style={textStyle}>{notActivated}</Text>;
  
  if (expired)
    return <Text style={textStyle}>{hasExpired}</Text>;

  const highlightWords = remainQuota == null ? [expireDate] : [expireDate, `${remainQuota}`];
  const remainQuotaTemplate = remainQuota > 1 ? plural : singular;
  const template = remainQuota == null ? noQuota : remainQuotaTemplate;
  
  return (
    <HighlightText
      highlightWords={highlightWords}
      style={textStyle}
      styleHighlight={styles.text}
      template={template}
    />
  );
}

MembershipStatus.propTypes = {
  color: PropTypes.string,
  expireStats: PropTypes.shape({
    activated: PropTypes.bool,
    expired: PropTypes.bool,
    expireDate: PropTypes.string,
    remainQuota: PropTypes.number,
  }).isRequired,
  templates: PropTypes.shape({
    hasExpired: PropTypes.string.isRequired,
    noQuota: PropTypes.string.isRequired,
    notActivated: PropTypes.string.isRequired,
    quota: PropTypes.shape({
      plural: PropTypes.string.isRequired,
      singular: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

MembershipStatus.defaultProps = {
  color: 'white',
  remainQuota: null,
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
  },
});
