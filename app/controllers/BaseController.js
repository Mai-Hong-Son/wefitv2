/**
 * @providesModule WeFit.Controllers.BaseController
 */

import React from 'react';

export default class BaseController extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return null;
  }
}
