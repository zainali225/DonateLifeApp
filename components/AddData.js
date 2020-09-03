import React from 'react'
import { View, Text, TextInput, StyleSheet, Picker, ToastAndroid, Image, ActivityIndicator, Keyboard, ScrollView, KeyboardAvoidingView, TouchableOpacity, Modal, Linking } from 'react-native'
import * as firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient'
import { AntDesign } from '@expo/vector-icons'
import * as lib_location from 'expo-location'
import MapView, { Marker } from 'react-native-maps';


class AddData extends React.Component {
    state = {
        name: '', emergency: '', email: '', blood: 'A+', city: 'City', pass: '', image: false, userPhone: '',
        loading: false, pColor: '#A5D7E7', activity: 'ad', googleMood: false, locationMood: false, region: [],

    }
    async componentDidMount() {

        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
            .get().then(ss => {
                if (ss.exists) {
                    this.props.navigation.navigate('main');
                }
            })
        let pd = await firebase.auth().currentUser.providerData[0];
        if (pd.providerId === 'google.com') {
            this.setState({ image: pd.photoURL, name: pd.displayName, googleMood: true })
        }
        this.getLocation();
    }
    signUp = () => {
        Keyboard.dismiss();
        alert(this.state.region)
        this.setState({ loading: true })
        // if (this.state.name === '' || this.state.emergency === '' || this.state.blood === '' || this.state.userPhone === '') {
        //     alert('All Fields are Required');
        //     this.setState({ loading: false })
        //     return;
        // }
        // if (this.state.userPhone.length !== 13 && this.state.userPhone.length !== 11) {

        //     alert('Invalid user number' + this.state.userPhone.length)
        //     this.setState({ loading: false })
        //     return;
        // }
        // if (this.state.emergency.length !== 13 && this.state.emergency.length !== 11) {
        //     alert('Invalid emergency number' + this.state.emergency.length)
        //     this.setState({ loading: false })
        //     return;
        // }
        // if (this.state.image === false) {
        //     alert('Image is Required');
        //     this.setState({ loading: false });
        //     return;
        // }
      
        let a = [];
        a[0] =  this.state.region[0].toFixed(6)
        a[1] =  this.state.region[1].toFixed(6)
        a[2] =  this.state.region[2]?this.state.region[2]:false;

        let uid = firebase.auth().currentUser.uid;
        let data = {
            name: this.state.name, emergency: this.state.emergency, uid: uid,
            blood: this.state.blood,
            email: firebase.auth().currentUser.email, imageUrl: this.state.googleMood ? this.state.image : false,
            userPhone: this.state.userPhone, bloodDate: 0, appointment: [], region: a,
            doner: true,
        };

        firebase.firestore().collection('users').doc(uid).set(data)
            .then(this.finshing())
    }
    finshing = () => {
        ToastAndroid.show("Data Saved", ToastAndroid.SHORT)
        firebase.auth().currentUser.updateProfile({ displayName: this.state.name, photoURL: null });
        this.setState({ loading: false })
        this.props.navigation.navigate('main')
    }
    pickImage = async () => {
        if (this.state.googleMood === true) { return; }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        this.setState({ image: result.uri })
        let response = await fetch(result.uri);
        let blip = await response.blob();
        var ref = firebase.storage().ref().child('avatar/' + firebase.auth().currentUser.uid);
        ref.put(blip);

    }
    getLocation = async () => {

        let { status } = await lib_location.requestPermissionsAsync();
        if (status !== 'granted') {
            alert("You denied to share your location");
            return;
        }
        let a = [];
        let location = await lib_location.getCurrentPositionAsync({});
        a[0] = location.coords.latitude;
        a[1] = location.coords.longitude;
        this.setState({ region: a })
    }
    getMarker = (region) => {
        let a = [];
        a[0] = region.latitude;
        a[1] = region.longitude;
        this.setState({ region: a })
    }
    getPoint = (name, region) => {
        let a = [];
        a[0] = region.latitude;
        a[1] = region.longitude;
        a[2] = name.substr(0, 18);
        this.setState({ region: a })
    }

    render() {
        return (
            <View>
                <LinearGradient style={styles.top} colors={['#E86C63', "#E68B4B"]}>
                    <Text style={{ color: 'white', fontSize: 20, }}>Your Credentials</Text>
                </LinearGradient>

                {/* body for add Data */}
                <LinearGradient style={styles.bottom} colors={['#E6E6E6', "#E6E6E6"]}>
                    <KeyboardAvoidingView behavior="padding" enabled={true}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}>

                            <TouchableOpacity onPress={() => this.pickImage()} >
                                <Image style={styles.img}
                                    source={this.state.image ? { uri: this.state.image } : require('../assets/user.png')} />

                            </TouchableOpacity>

                            <TextInput returnKeyType="next" onSubmitEditing={() => this.numTextInput.focus()} style={styles.elements} value={this.state.name} placeholderTextColor={this.state.pColor} placeholder='Name' onChangeText={name => this.setState({ name })} />
                            <TextInput returnKeyType="next" ref={(num) => { this.numTextInput = num; }} onSubmitEditing={() => this.emerTextInput.focus()} style={styles.elements} placeholderTextColor={this.state.pColor} placeholder='Your Number' keyboardType="number-pad" onChangeText={userPhone => this.setState({ userPhone })} />
                            <TextInput returnKeyType="next" ref={(emer) => { this.emerTextInput = emer; }} style={styles.elements} placeholderTextColor={this.state.pColor} placeholder='Emergency Number' keyboardType="number-pad" onChangeText={emergency => this.setState({ emergency })} />

                            <View style={styles.element1}>
                                <TouchableOpacity style={styles.btnViewLocation} onPress={() => Linking.openURL('https://www.google.com/maps/search/?api=1&query=' + this.state.region[0] + ',' + this.state.region[1])} >
                                    <Text style={{ paddingHorizontal: 10, fontSize: 13, color: 'white' }}>{this.state.region[2] ? this.state.region[2] : 'View location'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ locationMood: true })} style={styles.btnSetLocation} ><Text style={{ color: 'white', fontSize: 13 }}>Set location</Text></TouchableOpacity>
                            </View>

                            <View style={styles.picker}>
                                <Picker style={{ width: 270 }} selectedValue={this.state.blood} mode="dropdown" onValueChange={blood => this.setState({ blood })}>
                                    <Picker.Item label='A+' value='A+' color="#7DC2ED" />
                                    <Picker.Item label='A-' value='A-' color="#7DC2ED" />
                                    <Picker.Item label='B+' value='B+' color="#7DC2ED" />
                                    <Picker.Item label='B-' value='B-' color="#7DC2ED" />
                                    <Picker.Item label='O+' value='O+' color="#7DC2ED" />
                                    <Picker.Item label='O-' value='O-' color="#7DC2ED" />
                                    <Picker.Item label='AB+' value='AB+' color="#7DC2ED" />
                                    <Picker.Item label='AB-' value='AB-' color="#7DC2ED" />
                                </Picker>
                            </View>


                            {
                                this.state.loading ? <ActivityIndicator size="large" /> :
                                    <TouchableOpacity onPress={() => this.signUp()} >
                                        <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#344566', "#516593"]} style={styles.btn}>
                                            <Text style={{ color: 'white', textAlign: 'center' }}>Save data</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                            }
                        </ScrollView>
                    </KeyboardAvoidingView>
                </LinearGradient>

                {/*Modal     locationMood  */}
                <Modal onRequestClose={() => this.setState({ locationMood: false })} visible={this.state.locationMood} >
                    <LinearGradient style={styles.topModal} colors={['#E86C63', "#E68B4B"]}>
                        <View style={{ flexDirection: 'row', width: '89%', justifyContent: 'space-between', marginTop: -20, marginLeft: -10 }} >
                            <TouchableOpacity onPress={() => this.setState({ showModal: false })} >
                                <AntDesign name='arrowleft' size={24} color="white" />
                            </TouchableOpacity>
                            <Text style={{ color: 'white', fontSize: 20 }}>Set Location</Text>
                            <Text></Text>
                        </View>
                    </LinearGradient>
                    <LinearGradient style={styles.bottom} colors={['#E6E6E6', "#E6E6E6"]}>
                        <MapView
                            initialRegion={{ latitude: this.state.region[0], longitude: this.state.region[1], latitudeDelta: 0.01, longitudeDelta: 0.01, }}
                            onPress={(cord) => this.getMarker(cord.nativeEvent.coordinate)} onMarkerSelect={() => alert('marked')}
                            onPoiClick={(cord) => this.getPoint(cord.nativeEvent.name, cord.nativeEvent.coordinate)}
                            style={{ width: '100%', height: '80%', borderTopRightRadius: 50 }} >
                            <Marker
                                coordinate={{ latitude: this.state.region[0] ? this.state.region[0] : 31.4504, longitude: this.state.region[1] ? this.state.region[1] : 73.1350 }}
                                title="Select this?"
                                description={this.state.region[2]}
                            />
                        </MapView>
                        {/* <View style={{}}>
                            <Text>{this.state.region[0]}</Text>
                            <Text>{this.state.region[1]}</Text>
                        </View> */}
                        <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => this.setState({ locationMood: false })} >
                            <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#344566', "#516593"]} style={styles.btn}>
                                <Text style={{ color: 'white', textAlign: 'center' }}>Select this location</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </LinearGradient>
                </Modal>
            </View>
        )
    }
}
export default AddData;

const styles = StyleSheet.create({
    label: {
        fontSize: 10, paddingHorizontal: 20, color: '#2CA2C7'
    },
    elements: {
        width: 280, height: 50,
        borderWidth: StyleSheet.hairlineWidth,
        margin: 10,
        fontSize: 17,
        borderRadius: 30,
        paddingHorizontal: 10,
        borderColor: '#2CA2C7',//"#D9ECF1",
        backgroundColor: '#F2F2F2',
    },
    element1: {
        width: 280, height: 50, flexDirection: 'row',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 30,
        marginBottom: 10,
        borderColor: '#2CA2C7',//"#D9ECF1",
        backgroundColor: '#F2F2F2', justifyContent: 'space-between', alignItems: 'center',
    },
    btnSetLocation: {
        height: '100%', width: '44%', justifyContent: 'center', alignItems: 'center',
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30, backgroundColor: '#E68B4B',
    },
    btnViewLocation: {
        height: '100%', width: '44%', justifyContent: 'center', alignItems: 'center',
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30, backgroundColor: '#E68B4B',
    },
    btn: {
        alignContent: 'center', justifyContent: 'center',
        width: 160, height: 37,
        borderColor: 'black', borderWidth: StyleSheet.hairlineWidth, borderRadius: 30,
        margin: 10, overflow: 'hidden',
    },
    picker: {
        justifyContent: 'center',
        borderRadius: 30, borderWidth: StyleSheet.hairlineWidth, borderColor: "#2CA2C7",
        width: 280, height: 50, margin: 10, paddingRight: 110, backgroundColor: '#F2F2F2'
    },
    img: { marginTop: 20, width: 80, height: 80, borderRadius: 50, borderColor: "#2CA2C7", borderWidth: 1 },
    top: {
        position: 'relative', flexDirection: 'row',
        width: "100%", height: 91,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        alignItems: 'center', justifyContent: 'center'
    },
    bottom: {
        marginTop: 10,
        position: 'relative',
        width: "100%", height: "90%",
        //  borderBottomLeftRadius:70,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        backgroundColor: '#E6E6E6',
    },
    topModal: {
        position: 'relative',
        width: "100%", height: '11.8%',
        borderBottomLeftRadius: 50, borderBottomRightRadius: 50,
        alignItems: 'center', justifyContent: 'center'
    },
})