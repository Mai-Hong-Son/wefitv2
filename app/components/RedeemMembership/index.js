/**
 * @providesModule WeFit.Components.RedeemMembership
 */

import React from 'react';
import PropTypes from 'prop-types';
import I18n from 'react-native-i18n';
import _ from 'lodash';

// Components
import ConfirmableRequest, { getNavigationOptions } from 'app/components/Reusables/ConfirmableRequest';

// Constants
import { DEBUGS } from 'app/constants/Flags';
import { INTRO_ROUTES, MAIN_ROUTES } from 'app/constants/RouteNames';

// Models
import Membership from 'app/models/Membership';
import RemoteConfigs from 'app/models/RemoteConfigs';
import User from 'app/models/User';

// Locals
import ActivationCodeInput from './ActivationCodeInput';
import RedeemCodeInput from './RedeemCodeInput';
import FinishMessage from './FinishMessage';
import withConnect from './withConnect';

@withConnect
export default class RedeemMembership extends React.PureComponent {
  static navigationOptions = getNavigationOptions();

  static propTypes = {
    mainRouter: PropTypes.object.isRequired,
    membership: PropTypes.instanceOf(Membership).isRequired,
    membershipActivation: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    navigateMainTab: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      state: PropTypes.shape({
        params: PropTypes.shape({
          headerHidden: PropTypes.bool,
        }),
        routeName: PropTypes.string.isRequired,
      }).isRequired,
      setParams: PropTypes.func.isRequired,
    }).isRequired,
    redeemMembership: PropTypes.func.isRequired,
    remoteConfigs: PropTypes.instanceOf(RemoteConfigs).isRequired,
    rootRouter: PropTypes.object.isRequired,
    userData: PropTypes.instanceOf(User).isRequired,
  };

  constructor(props) {
    super(props);

    this.navigateMainTab = this.props.navigateMainTab.bind(this);
    this.redeemMembership = this.props.redeemMembership.bind(this);
    this.state = { code: null, disabledConfirm: true, finished: false };
  }

  componentWillReceiveProps(nextProps) {
    const { membership } = this.props;
    const { membership: nextMembership } = nextProps;

    if (membership !== nextMembership)
      this.finalize();
  }

  get forActivationScreen() {
    const { navigation: { state: { routeName } } } = this.props;
    return routeName === INTRO_ROUTES.ACTIVATION;
  }

  finalize = () => {
    const { navigation: { setParams } } = this.props;
    this.setState({ finished: true });
    setParams({ headerHidden: true });
  };

  onSubmitCode = () => {
    const { code } = this.state;
    if (_.isEmpty(code)) return;

    if (DEBUGS.REDEEM_MEMBERSHIP) {
      this.finalize();
      return;
    }
    
    this.redeemMembership(code);
  };

  onChangeCode = ({ code, disabledConfirm }) => this.setState({ code, disabledConfirm });
  
  onViewSchedules = () => {
    // Not necessary to navigate after pop for activation screen
    const tabName = this.forActivationScreen ? undefined : MAIN_ROUTES.OVERALL_SCHEDULES;
    this.navigateMainTab(tabName);
  };
  
  render() {
    const {
      membership,
      membershipActivation: { loading },
      remoteConfigs: { hotline_default: hotline },
    } = this.props;
    const { disabledConfirm, finished } = this.state;
    
    const confirmTitle = this.forActivationScreen
      ? null : I18n.t('redeemMembership.buttons.confirm');
    const CodeInput = this.forActivationScreen ? ActivationCodeInput : RedeemCodeInput;

    return (
      <ConfirmableRequest
        confirmTitle={confirmTitle}
        disabledConfirm={disabledConfirm}
        finishTitle={I18n.t('redeemMembership.buttons.finish')}
        finished={finished}
        loadingConfirm={loading}
        onConfirm={this.onSubmitCode}
        onFinish={this.onViewSchedules}
      >
        <CodeInput
          hotline={hotline}
          loading={loading}
          onChangeCode={this.onChangeCode}
          onSubmitEditing={this.onSubmitCode}
          ref={ref => this.codeInput = ref}
        />
        <FinishMessage membership={membership} />
      </ConfirmableRequest>
    );
  }
}
