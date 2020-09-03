import React from 'react'
import { Text, View, StyleSheet, Button, Image, ImageBackground, TouchableOpacity, ToastAndroid } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { LinearGradient } from 'expo-linear-gradient';
import About from '../Drawer/About'
import Profile from '../App/Profile'
import Index from './Index'
import FindBlood from '../components/FindBlood'
import Emergency from './Emergency'
import Appointment from './Appointment'
import InviteFriends from '../Drawer/InviteFriends'
import PrivacyPolicy from '../Drawer/PrivacyPolicy'
import Help from '../Drawer/Help'
import FindDoctor from '../components/FindDoctor'
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, } from '@react-navigation/drawer';
import Animated from 'react-native-reanimated';
import * as firebase from 'firebase'
import { AntDesign, Octicons, Entypo } from '@expo/vector-icons'
import AddDocData from '../components/AddDocData';
import AddData from '../components/AddData'
import AdminPanel from '../App/AdminPanel'

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const Screens = ({ navigation, style }) => {

  return (
    <Animated.View style={StyleSheet.flatten([styles.stack, style])}>
      <Stack.Navigator>
        <Stack.Screen options={{ headerLeft: () => (<TouchableOpacity onPress={() => navigation.openDrawer()}><AntDesign style={{ marginHorizontal: 20, marginTop: 5 }} name="menuunfold" color="white" size={24} /></TouchableOpacity>), headerTransparent: true, headerTitle: '' }} name="Index">{props => <Index {...props} />}</Stack.Screen>
        <Stack.Screen options={{ headerTransparent: true, headerTitle: '', headerTintColor: 'white' }} name="Profile">{props => <Profile {...props} />}</Stack.Screen>
        <Stack.Screen options={{ headerTitle: '', headerTransparent: true, headerTintColor: 'white' }} name='Emergency'>{props => <Emergency {...props} />}</Stack.Screen>
        <Stack.Screen options={{ headerTitle: '', headerTransparent: true, headerTintColor: 'white' }} name="findBlood">{props => <FindBlood {...props} />}</Stack.Screen>
        <Stack.Screen options={{ headerTitle: '', headerTransparent: true, headerTintColor: 'white' }} name='Appointments'>{props => <Appointment {...props} />}</Stack.Screen>
        <Stack.Screen options={{ headerTitle: '', headerTransparent: true, headerTintColor: 'white' }} name="About">{props => <About {...props} />}</Stack.Screen>
        <Stack.Screen options={{ headerTitle: '', headerTransparent: true, headerTintColor: 'white' }} name="Help" >{props => <Help {...props} />}</Stack.Screen>
        {/* <Stack.Screen options={{ headerTitle: '', headerTransparent: true, headerLeft: null }} name="addData" >{props => <AddData {...props} />}</Stack.Screen> */}
        <Stack.Screen options={{ headerTitle: '', headerTransparent: true, headerTintColor: 'white' }} name="InviteFriends">{props => <InviteFriends {...props} />}</Stack.Screen>
        <Stack.Screen options={{ headerTitle: '', headerTransparent: true, headerTintColor: 'white' }} name="PrivacyPolicy">{props => <PrivacyPolicy {...props} />}</Stack.Screen>
        <Stack.Screen options={{ headerTitle: '', headerTransparent: true, headerTintColor: 'white' }} name="addDocData">{props => <AddDocData {...props} />}</Stack.Screen>
        <Stack.Screen options={{ headerTitle: '', headerTransparent: true, headerTintColor: 'white' }} name="findDoctor">{props => <FindDoctor {...props} />}</Stack.Screen>
        <Stack.Screen options={{ headerTitle: '', headerTransparent: true, headerTintColor: 'white' }} name="AdminPanel">{props => <AdminPanel {...props} />}</Stack.Screen>

      </Stack.Navigator>
    </Animated.View>
  );
};

const DrawerContent = props => {

  const [image, setImage] = React.useState(false);
  const [iconSize, setIconSize] = React.useState(18);

  const ImageLoader = () => {
    let trig = 1
    let uid = firebase.auth().currentUser.uid;
    if (image === false) {
      firebase.firestore().collection('users').doc(uid)
        .get().then(ss => {
          if (ss.exists) {
            if (ss.data().imageUrl === false) {

              firebase.storage().ref('avatar/' + uid)
                .getDownloadURL().then((url) => {
                  setImage(url)

                }).catch((error) => {
                  console.log(error.message)

                })
            }
            else {
              setImage(ss.data().imageUrl)
            }
          }
          else {
            setTimeout(() => {
              ImageLoader();
            }, 5000);

          }
        })
    }
    else {
      return;
    }

  }

  return (
    <DrawerContentScrollView {...props} scrollEnabled={false}  >
      <View style={{ flex: 0.5, marginVertical: 30, justifyContent: 'center', alignItems: 'center' }}>
        {/* <ImageBackground style={{flex:0.5}} source={require('../assets/logoMain.png')} ></ImageBackground> */}
        <Image onLoad={ImageLoader()} style={{ width: 80, height: 80, borderRadius: 40, }} source={image ? { uri: image } : require('../assets/user.png')} />
      </View>
      <Text style={{ color: 'white', fontSize: 17, paddingHorizontal: 8 }}>{firebase.auth().currentUser.displayName}</Text>
      <Text style={{ color: 'white', fontSize: 12, marginTop: -5, marginBottom: 10, paddingHorizontal: 8,width:'130%'}} >{firebase.auth().currentUser.email}</Text>

      <DrawerItem labelStyle={styles.label} icon={() => <AntDesign name="home" style={styles.icon} color="white" size={iconSize} />} style={styles.item} label="Index" onPress={() => props.navigation.navigate('Index')} />

      <DrawerItem labelStyle={styles.label} icon={() => <AntDesign name="user" style={styles.icon} color="white" size={iconSize} />} style={styles.item} label="Profile" onPress={() => props.navigation.navigate('Profile')} />
      <DrawerItem labelStyle={styles.label} icon={() => <Entypo name="help" style={styles.icon} color="white" size={iconSize} />} style={styles.item} label="Help" onPress={() => props.navigation.navigate('Help')} />
      <DrawerItem labelStyle={styles.label} icon={() => <Entypo name="text-document" style={styles.icon} color="white" size={iconSize} />} style={styles.item} label="Privacy Policy" onPress={() => props.navigation.navigate('PrivacyPolicy')} />
      <DrawerItem labelStyle={styles.label} icon={() => <AntDesign name="sharealt" style={styles.icon} color="white" size={iconSize} />} style={styles.item} label="Invite Friends" onPress={() => props.navigation.navigate('InviteFriends')} />
      <DrawerItem labelStyle={styles.label} icon={() => <AntDesign name="infocirlceo" style={styles.icon} color="white" size={iconSize} />} style={styles.item} label="Why" onPress={() => props.navigation.navigate('About')} />
      <DrawerItem labelStyle={styles.label} icon={() => <Octicons name="sign-out" style={styles.icon} color="white" size={iconSize} />} style={styles.item} label="Sign out" onPress={() => { firebase.auth().signOut() }} />

    </DrawerContentScrollView>
  );
};

export default () => {

  const [progress, setProgress] = React.useState(new Animated.Value(0));
  const scale = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [1, 0.9],
  });
  const animatedStyle = { transform: [{ scale }] };

  return (
    <LinearGradient style={{ flex: 1 }} colors={['#F8C471', "#E68B4B", '#E86C63',]}>
      <NavigationContainer>
        <Drawer.Navigator drawerType="slide" overlayColor="transparent"
          drawerStyle={{ backgroundColor: 'transparent', width: '45%', }}
          drawerContentOptions={{ activeBackgroundColor: 'transparent', activeTintColor: 'transparent', inactiveTintColor: 'white', }}
          sceneContainerStyle={{ backgroundColor: 'transparent' }}
          drawerContent={props => {
            setProgress(props.progress);
            return <DrawerContent {...props} />;
          }}>
          <Drawer.Screen name="Screens">
            {props => <Screens {...props} style={animatedStyle} />}
          </Drawer.Screen>
        </Drawer.Navigator>

      </NavigationContainer>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  stack: {
    flex: 1,
  },
  label: {
    color: 'white',
    fontSize: 12, paddingHorizontal: -10,
  },
  item: {
    marginHorizontal: 20, width: '100%',
  },
  icon: {
    marginRight: -14
  }
})