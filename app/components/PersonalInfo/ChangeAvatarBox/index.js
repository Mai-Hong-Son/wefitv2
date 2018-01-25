/**
 * @providesModule WeFit.Components.PersonalInfo.ChangeAvatarBox
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import Button from 'react-native-button';
import I18n from 'react-native-i18n';
import ImagePicker from 'react-native-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Circle as CircleProgress } from 'react-native-progress';
import { DeviceUtils, Logger } from '@onaclover/react-native-utils';

// Components
import UserAvatar from 'app/components/Reusables/UserAvatar';

// Constants
import { COLORS } from 'app/constants/AppStyles';

// Models
import User from 'app/models/User';

// Locals
import withConnect from './withConnect';

const SELECTED_IMAGE_POSITION = (DeviceUtils.screen.width - 16 * 2 - 100) / 2;

const AVATAR_SIZE = 92;
const BUTTON_SIZE = 30;

const BEGIN_DURATION = Platform.select({ android: 0, ios: 1000 });
const HIDE_DURATION = 200;
const END_DURATION = 500;

const SHOW_IMAGE_STOP = 0.5;
const SCALE_STOP = 1;
const RESET_STOP = 1.5;
const END_STOP = 2;

@withConnect
export default class ChangeAvatarBox extends React.PureComponent {
  static propTypes = {
    avatarUpload: PropTypes.shape({
      error: PropTypes.object,
      loading: PropTypes.bool.isRequired,
      progress: PropTypes.number.isRequired,
    }).isRequired,
    resetAvatarUpload: PropTypes.func.isRequired,
    uploadAvatar: PropTypes.func.isRequired,
    userData: PropTypes.instanceOf(User).isRequired,
  };

  constructor(props) {
    super(props);

    const { resetAvatarUpload, uploadAvatar, userData: { avatar } } = this.props;
    this.resetAvatarUpload = resetAvatarUpload.bind(this);
    this.uploadAvatar = uploadAvatar.bind(this);

    this.transitionOffset = new Animated.Value(0);
    this.state = { avatar, selectedImage: {} };
  }

  componentWillReceiveProps(nextProps) {
    const { avatarUpload } = this.props;
    const { avatarUpload: nextAvatarUpload } = nextProps;

    if (avatarUpload !== nextAvatarUpload) {
      const { error, loading } = nextAvatarUpload;
      
      if (error != null) this.revertTransitions();
      else if (!loading) this.hideTransitions();
    }
  }

  get imagePickerOptions() {
    const { buttons, permissionDenied } = I18n.t('personalInfo.avatarPicker');
    const { chooseFromLibrary, takePhoto } = buttons;

    return {
      permissionDenied,
      allowsEditing: true,
      cameraType: 'front',
      chooseFromLibraryButtonTitle: chooseFromLibrary,
      maxHeight: 512,
      maxWidth: 512,
      mediaType: 'photo',
      storageOptions: { path: 'images', skipBackup: true },
      takePhotoButtonTitle: takePhoto,
      title: null,
    };
  }

  get editButtonAnimations() {
    const borderRadius = this.transitionOffset.interpolate({
      inputRange: [0, SHOW_IMAGE_STOP, SCALE_STOP, RESET_STOP, END_STOP],
      outputRange: [
        BUTTON_SIZE / 2,
        BUTTON_SIZE / 2,
        AVATAR_SIZE / 2,
        BUTTON_SIZE / 2,
        BUTTON_SIZE / 2,
      ],
    });
    
    const size = this.transitionOffset.interpolate({
      inputRange: [0, SHOW_IMAGE_STOP, SCALE_STOP, RESET_STOP, END_STOP],
      outputRange: [BUTTON_SIZE, BUTTON_SIZE, AVATAR_SIZE, BUTTON_SIZE, BUTTON_SIZE],
    });
    
    const translateX = this.transitionOffset.interpolate({
      inputRange: [0, SHOW_IMAGE_STOP, SCALE_STOP, SCALE_STOP + 0.02, RESET_STOP, END_STOP],
      outputRange: [0, 0, -4, -4, 150, 0],
    });

    const translateY = this.transitionOffset.interpolate({
      inputRange: [0, SHOW_IMAGE_STOP, SCALE_STOP, RESET_STOP, END_STOP],
      outputRange: [0, 0, -4, 0, 0],
    });    

    const opacity = this.transitionOffset.interpolate({ 
      inputRange: [0, SCALE_STOP, SCALE_STOP + 0.01, RESET_STOP, RESET_STOP + 0.01, END_STOP],
      outputRange: [1, 1, 0, 0, 1, 1],
    });

    return {
      borderRadius, opacity,
      height: size,
      transform: [{ translateX }, { translateY }],
      width: size,
    };
  }

  beginTransitions = () => {
    const timing = Animated.timing(this.transitionOffset, {
      duration: BEGIN_DURATION,
      easing: Easing.inOut(Easing.quad),
      toValue: SCALE_STOP,
    });
    
    timing.start(this.prepareUpload);
  };

  hideTransitions = () => {
    const timing = Animated.timing(this.transitionOffset, {
      delay: HIDE_DURATION,
      duration: END_DURATION - HIDE_DURATION,
      toValue: RESET_STOP,
    });

    timing.start(this.endTransitions);
  }

  endTransitions = () => {
    const timing = Animated.timing(this.transitionOffset, {
      duration: END_DURATION,
      easing: Easing.elastic(1.2),
      toValue: END_STOP,
    });

    timing.start(() => {
      this.resetAvatarUpload();
      this.transitionOffset.setValue(0);
    });
  }

  revertTransitions = () => {
    const timing = Animated.timing(this.transitionOffset, {
      delay: HIDE_DURATION,
      duration: BEGIN_DURATION,
      easing: Easing.inOut(Easing.quad),
      toValue: 0,
    });

    const { userData: { avatar } } = this.props;
    this.setState({ avatar }, timing.start);
  }

  prepareUpload = () => {
    const { selectedImage: { uri } } = this.state;
    this.setState({ avatar: uri });
    this.uploadAvatar(uri);
  };

  showImagePicker = () => ImagePicker.showImagePicker(
    this.imagePickerOptions,
    this.onImagePickerResponse,
  );

  onImagePickerResponse = ({ didCancel, error, uri }) => {
    if (didCancel) return;

    if (error != null) {
      Logger.debug(error);
      return;
    }

    this.setState({ selectedImage: { uri } }, this.beginTransitions);
  };

  renderEditButton = () => {
    const { selectedImage: { uri } } = this.state;
    const containerStyles = [styles.editButtonContainer, this.editButtonAnimations];

    const borderRadius = this.transitionOffset.interpolate({
      inputRange: [0, SHOW_IMAGE_STOP, SCALE_STOP, RESET_STOP, END_STOP],
      outputRange: [
        BUTTON_SIZE / 2,
        BUTTON_SIZE / 2,
        AVATAR_SIZE / 2,
        BUTTON_SIZE / 2,
        BUTTON_SIZE / 2,
      ],
    });

    const opacity = this.transitionOffset.interpolate({
      inputRange: [0, 0.25, SCALE_STOP, RESET_STOP],
      outputRange: [1, 0, 0, 1],
    });
    
    const rotate = this.transitionOffset.interpolate({
      inputRange: [0, RESET_STOP, END_STOP],
      outputRange: ['0deg', '0deg', '-360deg'],
    });

    const touchableAnimations = { opacity, transform: [{ rotate }] };

    return (
      <Animated.View style={containerStyles}>
        <Animated.Image source={{ uri }} style={[styles.editButtonBackground, { borderRadius }]} />
        <Animated.View style={[styles.editButtonTouchableContainer, touchableAnimations]}>
          <Button containerStyle={styles.editButtonTouchableContent} onPress={this.showImagePicker}>
            <FontAwesome color="white" name="pencil" size={15} />
          </Button>
        </Animated.View>
      </Animated.View>
    );
  };

  renderProgress = () => {
    const { avatarUpload: { progress } } = this.props;

    const opacity = this.transitionOffset.interpolate({
      inputRange: [0, SCALE_STOP, RESET_STOP, END_STOP],
      outputRange: [0, 1, 1, 0],
    });

    return (
      <Animated.View style={[styles.progressContainer, { opacity }]}>
        <CircleProgress
          borderWidth={0}
          color={COLORS.PINK}
          indeterminate={false}
          progress={progress}
          showsText={false}
          size={100}
          thickness={4}
          unfilledColor="white"
        />
      </Animated.View>
    );
  }

  render() {
    const { avatar } = this.state;
    
    return (
      <View style={styles.container}>
        <UserAvatar uri={avatar} />
        {this.renderProgress()}
        {this.renderEditButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: 20,
  },

  editButtonContainer: {
    backgroundColor: 'cyan',
    borderRadius: 15,
    bottom: 0,
    height: 30,
    overflow: 'hidden',
    position: 'absolute',
    right: SELECTED_IMAGE_POSITION,
    width: 30,
  },
  
  editButtonBackground: {
    borderRadius: 15,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },

  editButtonTouchableContainer: {
    backgroundColor: COLORS.PINK,
    borderRadius: 15,
    flex: 1,
  },
  
  editButtonTouchableContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  progressContainer: {
    backgroundColor: 'transparent',
    height: 100,
    position: 'absolute',
    left: SELECTED_IMAGE_POSITION,
    top: 0,
    width: 100,
  },
});
