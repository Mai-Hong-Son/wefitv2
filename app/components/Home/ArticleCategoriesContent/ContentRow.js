import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { FontUtils } from '@onaclover/react-native-utils';

const ContentRow = item => {
  const { name, gradient, image } = item.item;
  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={gradient}
        end={{ x: 0.2, y: 1.5 }}
        start={{ x: 0.0, y: 0.25 }}
        style={styles.linearGradient}
      >
        <View style={styles.container_img}>
          <Image
            source={{ uri: image }}
            style={styles.img}
          />
        </View >
        <View style={styles.description}>
          <Text style={styles.auth}>{name.toUpperCase()}</Text>
        </View >
      </LinearGradient>
    </View>
  );
};
export default ContentRow;

const styles = StyleSheet.create({
  linearGradient: {
    borderRadius:4,
    flex: 1,
  },
  container: {
    width: 343,
    height: 120,
    marginTop: 16,
    alignSelf: 'center',
  },
  container_img: {
    width: 36,
    height: 40,
    alignSelf: 'center',
    marginTop: 25,
  },
  img: {
    flex: 1,
    resizeMode: 'contain',
  },
  description: {
    alignSelf: 'center',
  },
  auth: FontUtils.build({
    color: 'white',
    marginTop: 10,
    size: 17,
  }),
});
