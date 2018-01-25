/**
 * @providesModule WeFit.Components.PersonalInfo.ChangeAvatarBox.withConnect
 */

import { connect } from 'react-redux';
import { serviceApi } from 'redux/actions';

function mapStateToProps(state) {
  const { userData } = state.auth;
  const { avatarUpload } = state.serviceApi;
  return { avatarUpload, userData };
}

function mapDispatchToProps(dispatch) {
  return {
    resetAvatarUpload: () => dispatch(serviceApi.resetAvatarUpload()),
    uploadAvatar: fileUri => dispatch(serviceApi.uploadAvatar(fileUri)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
