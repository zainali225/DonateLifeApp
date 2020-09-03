import React from 'react'
import { View, Button, StyleSheet, Text, Image, Share, TouchableOpacity } from 'react-native'
import { DrawerActions } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'

class InviteFriends extends React.Component {
  onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'App link to Whatsapp',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }

  }

  render() {
    return (
      <View>
        <LinearGradient style={styles.top} colors={['#E86C63', "#E68B4B"]}>
          <Text style={{ color: 'white', fontSize: 20 }}>Share</Text>
        </LinearGradient>
        <LinearGradient style={styles.bottom} colors={['#E6E6E6', "#E6E6E6"]}>
          <Text style={{ marginTop: 20 }} />
          <TouchableOpacity onPress={() => this.onShare()} >
            <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#344566', "#516593"]} style={styles.btn}>
              <Text style={{ color: 'white', textAlign: 'center' }}>Share</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    )
  }
}

export default InviteFriends;

const styles = StyleSheet.create({

  menu: {
    marginTop: 25,
    flexDirection: 'row',
    width: '57%',
    justifyContent: "space-between",
  },
  title: {
    fontSize: 25,
  },
  btn: {
    alignContent: 'center',
    justifyContent: 'center',
    width: 160,
    height: 37,
    borderColor: 'black',
    borderWidth: StyleSheet.hairlineWidth,
    margin: 15,
    borderRadius: 30,
    overflow: 'hidden',
  },
  top: {
    position: 'relative',
    width: "100%", height: 92,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottom: {
    marginTop: 10,
    position: 'relative',
    width: "100%", height: "80%",
    //  borderBottomLeftRadius:70,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: '#E6E6E6',
    alignItems: 'center',

  }
})