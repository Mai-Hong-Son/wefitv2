/**
 * @providesModule WeFit.Controllers.AppLinksController
 */

/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import PropTypes from 'prop-types';
import { Linking } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Extensions, Logger } from '@onaclover/react-native-utils';
import qs from 'qs';
import urlParse from 'url-parse';
import _ from 'lodash';

// Constants
import { APP_CONFIGS } from 'app/constants/AppConstants';
import { AUTH_ROUTES, MAIN_ROUTES } from 'app/constants/RouteNames';

// Models
// import Studio from 'app/models/Studio';
import User from 'app/models/User';

// Locals
import BaseController from '../BaseController';
import withConnect from './withConnect';

const { RESET_PASSWORD } = AUTH_ROUTES;
const { ARTICLE_TRAININGS_LIST, STUDIO_DETAIL } = MAIN_ROUTES;

@withConnect
export default class AppLinksController extends BaseController {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    navigateStudio: PropTypes.func.isRequired,
    rehydrated: PropTypes.bool.isRequired,
    userData: PropTypes.instanceOf(User),
  };

  static defaultProps = {
    userData: null,
  };

  constructor(props) {
    super(props);
    
    this.dispatch = this.props.dispatch.bind(this);
    this.navigateStudio = this.props.navigateStudio.bind(this);
    this.pendingUrl = null;
  }

  componentDidMount() {
    this.setupDeepLinks();
  }

  componentWillReceiveProps(nextProps) {
    const { rehydrated } = this.props;
    const { rehydrated: nextRehydrated } = nextProps;

    if (!rehydrated && nextRehydrated)
      this.dequeuePendingUrl();
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.enqueuePendingUrl);
  }

  dequeuePendingUrl = async () => {
    await Extensions.nap(300);
    
    const parsedUrl = this.parseUrl(this.pendingUrl);
    if (!_.isEmpty(parsedUrl)) this.handleParsedUrl(parsedUrl);
  };

  enqueuePendingUrl = url => {
    this.pendingUrl = url;
    if (!this.props.rehydrated) return;

    // Dequeue immediately if app is already rehydrated
    this.dequeuePendingUrl();
  };

  handleParsedUrl = ({ params, path }) => {
    const routeName = _.camelCase(path);
    Logger.log(`Handle applink ${this.pendingUrl} - matched routeName: ${routeName}`);

    if (routeName === RESET_PASSWORD) {
      if (this.props.userData == null)
        this.dispatch(NavigationActions.navigate({ params, routeName }));
      return;
    }

    if (routeName === STUDIO_DETAIL) {
      const { studioId } = params;
      this.navigateStudio({ studioId });
      return;
    }

    if (routeName === ARTICLE_TRAININGS_LIST) {
      const { id: idString, title } = params;
      const id = parseInt(idString);
      const type = 'full-size-articles';
      this.dispatch(NavigationActions.navigate({ params: { id, title, type }, routeName }));
    }
  };

  parseUrl = url => {
    if (_.isEmpty(url)) return {};
    
    const parsedUrl = urlParse(url);
    const { pathname, protocol, query } = parsedUrl;
    const path = _.last(_.split(pathname, '/'));
    
    if (_.isEmpty(path) || (protocol !== APP_CONFIGS.URI_PROTOCOL && protocol !== 'https:'))
      return {};

    const params = qs.parse(query, { ignoreQueryPrefix: true });
    return { params, path };
  };

  setupDeepLinks = async () => {
    Linking.addEventListener('url', ({ url }) => this.enqueuePendingUrl(url));

    // Initial URL
    const url = await Linking.getInitialURL();
    this.enqueuePendingUrl(url);
  };
}
