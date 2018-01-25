/**
 * @providesModule WeFit.Components.Reusables.DetailScrollView.HeaderRightButtons
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, View } from 'react-native';
import Button from 'react-native-button';
import I18n from 'react-native-i18n';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Logger } from '@onaclover/react-native-utils';

// Constants
import { COLORS } from 'app/constants/AppStyles';
import { FEATURES } from 'app/constants/Flags';
import { GLOBAL_ALERT_TYPES } from 'redux/constants';

// Models
import Session from 'app/models/Session';
import Studio from 'app/models/Studio';

// Utils
import CalendarUtils from 'app/utils/CalendarUtils';
import { formatText } from 'app/utils';

// Locals
import withConnect from './withConnect';

@withConnect
export default class HeaderRightButtons extends React.PureComponent {
  static propTypes = {
    favorStudio: PropTypes.func.isRequired,
    getStudioDetail: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    session: PropTypes.instanceOf(Session),
    showGlobalAlert: PropTypes.func.isRequired,
    studio: PropTypes.instanceOf(Studio),
    studioDetail: PropTypes.shape({
      data: PropTypes.object,
    }).isRequired,
    studioFavorStatuses: PropTypes.objectOf(PropTypes.bool).isRequired,
    studioFavorUpdate: PropTypes.shape({
      error: PropTypes.object,
    }).isRequired,
    updateStudioFavorStatus: PropTypes.func.isRequired,
  };
  
  static defaultProps = {
    session: null,
    studio: null,
  };

  constructor(props) {
    super(props);

    this.favorStudio = this.props.favorStudio.bind(this);
    this.getStudioDetail = this.props.getStudioDetail.bind(this);
    this.showGlobalAlert = this.props.showGlobalAlert.bind(this);
    this.updateStudioFavorStatus = this.props.updateStudioFavorStatus.bind(this);

    const { router: { index } } = this.props;
    this.screenIndex = index;
  }

  componentDidMount() {
    this.getStudioDetail(this.studioId);
  }

  componentWillReceiveProps(nextProps) {
    const { studioDetail, studioFavorUpdate } = this.props;
    const {
      studioDetail: nextStudioDetail,
      studioFavorUpdate: nextStudioFavorUpdate,
      studioFavorStatuses: { [this.studioId]: favorited },
    } = nextProps;

    if (studioDetail !== nextStudioDetail) {
      const { data: { is_favorited: favorited = false } = {}, loading, error } = nextStudioDetail;
      if (!loading && error == null) this.updateStudioFavorStatus({ [this.studioId]: favorited });
    }

    if (studioFavorUpdate !== nextStudioFavorUpdate) {
      const { error, loading } = nextStudioFavorUpdate;
      this.handleFavorRequestDone({ error, favorited, loading });
    }
  }

  get studioId() {
    const { session, studio } = this.props;
    const { id } = studio || {};
    const { studio_id: sessionStudioId } = session || {};
    return id || sessionStudioId;
  }

  checkAndUpdateFavoritedState = () => {
    const { router: { index: currentStackIndex } } = this.props;

    if (this.screenIndex !== currentStackIndex)
      this.getStudioDetail(this.studioId);
  };

  handleFavorRequestDone = ({ error, favorited, loading }) => {
    if (loading) return;
    
    if (error != null) {
      // Rollback if error
      this.updateStudioFavorStatus({ [this.studioId]: !favorited });
      return;
    }
    
    const { on, off, title } = I18n.t('detailScrollView.favorStudioAlerts');
    this.showGlobalAlert({
      title,
      message: favorited ? on : off,
      type: GLOBAL_ALERT_TYPES.INFO,
    });
  };
  
  onAddToCalendar = async () => {
    const {
      error: alertError, success: alertSuccess, title: alertTitle,
    } = I18n.t('detailScrollView.header.addToCalendar');

    try {
      const authorized = await CalendarUtils.authorize();
      if (!authorized) return;

      const { session, studio } = this.props;
      const { name: sessionName, end_at: endDate, start_at: startDate } = session;
      const { name: studioName, address: location, navigation_tip: notes } = studio || {};

      const timeRange = { endDate, startDate };
      const title = `${sessionName} @ ${studioName}`;

      await CalendarUtils.addToCalendar({ location, notes, timeRange, title });

      this.showGlobalAlert({
        message: alertSuccess,
        title: alertTitle,
        type: GLOBAL_ALERT_TYPES.INFO,
      });
    } catch (error) {
      Logger.warn(error);
      this.showGlobalAlert({
        message: formatText(alertError, error.message),
        title: alertTitle,
        type: GLOBAL_ALERT_TYPES.ERROR,
      });
    }
  };

  onFavorStudio = () => {
    const { studioFavorStatuses: { [this.studioId]: currentFavorited } } = this.props;
    const favorited = !currentFavorited;
    const studioId = this.studioId;

    this.updateStudioFavorStatus({ [this.studioId]: favorited });
    this.favorStudio({ favorited, studioId });
  };

  onShare = () => {};

  renderFavoriteButton = () => {
    const { studioFavorStatuses: { [this.studioId]: favorited } } = this.props;
    const iconName = favorited ? 'heart' : 'heart-o';
    const iconColor = favorited ? COLORS.PINK : 'white';

    return (
      <Button containerStyle={styles.buttonContainer} onPress={this.onFavorStudio}>
        <FontAwesome color={iconColor} name={iconName} size={18} style={styles.favoriteIcon} />
      </Button>
    );
  };
  
  render() {
    const { session } = this.props;

    return (
      <View style={styles.container}>
        {this.renderFavoriteButton()}
        {session != null && (
          <Button containerStyle={styles.buttonContainer} onPress={this.onAddToCalendar}>
            <Image source={require('app/assets/icons/calendar.png')} />
          </Button>
        )}
        {FEATURES.SHARE_SESSIONS_STUDIOS && (
          <Button containerStyle={styles.buttonContainer} onPress={this.onShare}>
            <Image source={require('app/assets/icons/share.png')} />
          </Button>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 16,
  },

  buttonContainer: {
    height: 18,
    justifyContent: 'flex-end',
    marginLeft: 20,
  },
  favoriteIcon: {
    height: 18,
  },
});
