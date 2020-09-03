import React from 'react'
import { StyleSheet, Text, Button, View, BackHandler } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { LinearGradient } from 'expo-linear-gradient';
import { Fontisto, Entypo, AntDesign, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import * as firebase from 'firebase'

class Index extends React.Component {
    state = {
        iconSize: 24,
        iconColor: 'white', uri: '', activity: 'index', docMood: false,
    }
    componentDidMount() {
        let pd = firebase.auth().currentUser.providerData[0];
        if (firebase.auth().currentUser.photoURL !== null &&pd.providerId !== 'google.com') {
            this.setState({ docMood: true })
        }

    }

    render() {
        return (
            <View>
                <LinearGradient style={styles.top} colors={['#E86C63', "#E68B4B"]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', width: '90%' }}>

                        <Text style={{ color: 'white', fontSize: 20, alignSelf: 'center' }}>Donate Life</Text>

                        {/* <Image style={{ width: 50, height: 50, borderRadius: 20, alignSelf: 'center' }} source={{ uri: this.state.uri }} /> */}
                    </View>
                </LinearGradient>

                <View style={styles.bottom} >
                    <Text style={{ marginTop: 20 }}></Text>
                    <View style={styles.row} >
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('findBlood')}  >
                            <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#E86C63', "#E68B4B"]} style={styles.item}>
                                <Fontisto style={styles.icon} name="blood-test" size={this.state.iconSize} color={this.state.iconColor} />
                                <Text style={styles.name}>Blood Help</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Appointments')} style={styles.item}>
                            <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#344566', "#516593"]} style={styles.item}>
                                <Entypo style={styles.icon} name="documents" size={this.state.iconSize} color={this.state.iconColor} />
                                <Text style={styles.name}>Appointments</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row} >
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('addDocData')} style={styles.item} >
                            <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#9764E0', "#9685FA"]} style={styles.item}>
                                <MaterialCommunityIcons style={styles.icon} name="doctor" size={this.state.iconSize} color={this.state.iconColor} />
                                <Text style={styles.name}>Are You Doctor</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('findDoctor')} style={styles.item} >
                            <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#35A29F', "#06CEA8"]} style={styles.item}>
                                <MaterialCommunityIcons style={styles.icon} name='account-search-outline' size={this.state.iconSize} color={this.state.iconColor} />
                                <Text style={styles.name}>Find Doctor</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row} >
                        <TouchableOpacity style={styles.item} onPress={() => this.props.navigation.navigate('InviteFriends')} style={styles.item} >
                            <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#5D9802', "#89C500"]} style={styles.item}>
                                <AntDesign style={styles.icon} name="sharealt" size={this.state.iconSize} color={this.state.iconColor} />
                                <Text style={styles.name}>Share</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        {
                            this.state.docMood ? null :

                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Emergency')} style={styles.item} >
                                    <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#0A80D7', "#0599DC"]} style={styles.item}>
                                        <FontAwesome5 style={styles.icon} name="hands-helping" size={this.state.iconSize} color={this.state.iconColor} />
                                        <Text style={styles.name}>Emergency</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                        }
                    </View>
                </View>

            </View>

        )
    }
}
export default Index;
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row', marginVertical: 8, width: "85%", justifyContent: 'space-between',
        alignSelf: 'center'
    },
    item: {
        height: 60, width: 145, alignItems: 'center', flexDirection: 'row',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.5,
        elevation: 1,
        borderRadius: 10,
    },
    scroll: {
        borderBottomWidth: StyleSheet.hairlineWidth, borderTopWidth: StyleSheet.hairlineWidth, maxHeight: 105,
    },
    card: {
        height: 80, width: 80, justifyContent: 'center', alignItems: 'center', margin: 10,
        shadowColor: 'black', shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, shadowOpacity: 0.5, elevation: 12,
        backgroundColor: '#EAFAFE', borderRadius: 20, borderWidth: 2,
    },
    name: {
        color: 'white',fontSize:10
    },
    icon: {
        width: 45, paddingHorizontal: 10,
    },
    top: {
        position: 'relative', flexDirection: 'row',
        width: "100%", height: '14%',
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        alignItems: 'center', justifyContent: 'center'
    },
    bottom: {
        marginTop: 10,
        position: 'relative',
        width: "100%", height: "86%",
        //  borderBottomLeftRadius:70,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        backgroundColor: '#E6E6E6',
    }

})