/**
 * @providesModule WeFit.Components.Home.Articles.TrainingArticles.HeaderFilter
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from 'react-native-button';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import I18n from 'react-native-i18n';
import { MAIN_ROUTES } from 'app/constants/RouteNames';
import { COLORS } from 'app/constants/AppStyles';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

export default function HeaderFilter(navigation) {
  const { titleHeader, visible } = navigation;
  if (!visible) return null;
  const subjects = titleHeader.length !== 0 ? titleHeader : [I18n.t('home.swiper.allArticle')];
  return (
    <View style= {styles.container}>
      <View style= {styles.stylefilter}>
        <Button containerStyle= {styles.Buttonfilter} onPress={() => navigation.navigate(MAIN_ROUTES.FILTER_ARTICLES)} >
          <View style= {styles.containerFilter}>
            <MaterialCommunityIcons color={COLORS.PINK} name="filter-outline" size={25} style={styles.iconFilter} />
            {renderBulletPoint(subjects)}
          </View>
        </Button>
      </View>
    </View>
  );
}
function renderBulletPoint(subjects) {
  let title = '';
  _.forEach(subjects, subject => {
    if (title) {
      title = `${title}  \u2022  ${subject}`;
    } else {
      title = subject;
    }
  });
  return (
    <Text numberOfLines={1} style= {styles.textFilter}>{title}</Text>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WEFIT,
    justifyContent: 'center',
    height: 70,
  },
  stylefilter: {
    flex: 1,
  },
  Buttonfilter: {
    flex: 1,
    width: 343,
    height: 44,
    borderRadius:4,
    borderWidth: 1,
    backgroundColor: COLORS.WHITE_OPAQUE_MIN,
    borderColor: COLORS.WHITE_OPAQUE_MIN,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  iconFilter: {
    flex:1,
    marginLeft: 10,
  },
  containerFilter: {
    flexDirection: 'row',
  },
  textFilter: FontUtils.build({
    flex:8,
    alignItems: 'flex-start',
    size: 13,
    color: 'white',
    // marginLeft: 5,
    marginTop: 5,
  }),
});
