/**
 * @providesModule WeFit.Components.SessionBooking
 */

import React from 'react';
import PropTypes from 'prop-types';
import I18n from 'react-native-i18n';
import _ from 'lodash';

// Components
import ConfirmableRequest, { getNavigationOptions } from 'app/components/Reusables/ConfirmableRequest';

// Constants
import { DEBUGS } from 'app/constants/Flags';
import { MAIN_ROUTES } from 'app/constants/RouteNames';
import { GLOBAL_ALERT_TYPES } from 'redux/constants';

// Models
import { FitnessType } from 'app/models/BaseStaticData';
import Reservation from 'app/models/Reservation';
import Session from 'app/models/Session';
import Studio from 'app/models/Studio';

// Utils
import { formatText } from 'app/utils';
import AlertUtils from 'app/utils/AlertUtils';

// Locals
import FinishMessage from './FinishMessage';
import modes from './modes';
import SessionInfo from './SessionInfo';
import withConnect from './withConnect';

const { CANCEL, RESERVE } = modes;

export { modes };

@withConnect
export default class SessionBooking extends React.PureComponent {
  static navigationOptions = getNavigationOptions();

  static propTypes = {
    cancelSession: PropTypes.func.isRequired,
    navigateMainTab: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      state: PropTypes.shape({
        params: PropTypes.shape({
          fitnessTypes: PropTypes.arrayOf(PropTypes.instanceOf(FitnessType)).isRequired,
          headerHidden: PropTypes.bool,
          mode: PropTypes.oneOf(_.values(modes)).isRequired,
          session: PropTypes.instanceOf(Session).isRequired,
          studio: PropTypes.instanceOf(Studio).isRequired,
        }).isRequired,
      }).isRequired,
      setParams: PropTypes.func.isRequired,
    }).isRequired,
    reserveSession: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    sessionCancel: PropTypes.shape({
      data: PropTypes.instanceOf(Reservation),
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    sessionReserve: PropTypes.shape({
      data: PropTypes.instanceOf(Reservation),
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    showGlobalAlert: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.cancelSession = this.props.cancelSession.bind(this);
    this.navigateMainTab = this.props.navigateMainTab.bind(this);
    this.reserveSession = this.props.reserveSession.bind(this);
    this.showGlobalAlert = this.props.showGlobalAlert.bind(this);

    this.state = { finished: false };
  }

  componentWillReceiveProps(nextProps) {
    const {
      sessionCancel: { data: cancelData },
      sessionReserve: { data: reserveData },
    } = this.props;
    
    const {
      sessionCancel: { data: nextCancelData },
      sessionReserve: { data: nextReserveData },
    } = nextProps;

    if (cancelData !== nextCancelData || reserveData !== nextReserveData)
      this.finalize();
  }

  get localizedTexts() {
    const { mode } = this.passedProps;

    const { [mode]: confirm, viewMySessions: finish } = I18n.t('sessionBooking.buttons');
    const { [mode]: { contents, title } } = I18n.t('sessionBooking.finishMessage');

    return { confirm, contents, finish, title };
  }

  get passedProps() {
    const { fitnessTypes, mode, session, studio } = this.props.navigation.state.params;
    return { fitnessTypes, mode, session, studio };
  }

  copyReservationCode = () => {
    const {
      sessionReserve: { data: { reservationCode } = {} },
    } = this.props;

    const { content, message, title } = I18n.t('sessionBooking.finishMessage.clipboard');
    AlertUtils.copyToClipboard(formatText(content, reservationCode));
    this.showGlobalAlert({ message, title, type: GLOBAL_ALERT_TYPES.SUCCESS });
  };

  finalize = () => {
    const { navigation: { setParams } } = this.props;
    this.setState({ finished: true });
    setParams({ headerHidden: true });
  }

  // Interact booking means Reserve/Cancel
  onInteractBooking = () => {
    const { mode, session: { id } } = this.passedProps;

    if ((mode === CANCEL && DEBUGS.CANCEL_SESSIONS) ||
        (mode === RESERVE && DEBUGS.RESERVE_SESSIONS)) {
      this.finalize();
      return;
    }

    if (mode === CANCEL)
      this.cancelSession(id);
    else
      this.reserveSession(id);
  };

  render() {
    const {
      sessionCancel: { loading: loadingCancel },
      sessionReserve: { data: { reservationCode } = {}, loading: loadingReserve },
    } = this.props;
    const { fitnessTypes, mode, session, studio } = this.passedProps;
    const { finished } = this.state;

    const { confirm, contents, finish, title } = this.localizedTexts;

    return (
      <ConfirmableRequest
        confirmTitle={confirm}
        finishTitle={finish}
        finished={finished}
        loadingConfirm={mode === RESERVE ? loadingReserve : loadingCancel}
        onConfirm={this.onInteractBooking}
        onFinish={() => this.navigateMainTab(MAIN_ROUTES.MY_SESSIONS)}
      >
        <SessionInfo
          fitnessTypes={fitnessTypes}
          mode={mode}
          session={session}
          studio={studio}
        />
        <FinishMessage
          contents={contents}
          onCopyCode={this.copyReservationCode}
          reservationCode={mode === RESERVE ? reservationCode : null}
          title={title}
        />
      </ConfirmableRequest>
    );
  }
}
