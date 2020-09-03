import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import * as lib_location from 'expo-location'


export default class Test extends React.Component {
    state = {
         region: false, loading: true
    }

    componentDidMount() {
        this.getLocation()
    }loc

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
        this.setState({  region: a, loading: false })

    }
    getMarker = (region) => {
        let a = [];
        a[0] = region.latitude;
        a[1] = region.longitude;
        this.setState({ region: a })
    }
    getPoint = (name,region) => {
        let a = [];
        a[0] = region.latitude;
        a[1] = region.longitude;
        a[2] = name;
        this.setState({ region: a })
    }

    render() {
        return (
            <View style={styles.test} >
                {
                    this.state.loading ? <ActivityIndicator size="large" color="teal" style={{ width: '100%', height: 400 }} /> :
                        <MapView
                            initialRegion={{ latitude: this.state.region[0], longitude: this.state.region[1], latitudeDelta: 0.0922, longitudeDelta: 0.0421, }}
                             onPress={(cord) => this.getMarker(cord.nativeEvent.coordinate)} onMarkerSelect={()=>alert('marked')}
                             onPoiClick={(cord)=>this.getPoint(cord.nativeEvent.name,cord.nativeEvent.coordinate)}
                            style={{ width: '100%', height: 400 }}
                        >
                            {
                                this.state.region ? <Marker
                                    coordinate={{ latitude: this.state.region[0], longitude: this.state.region[1] }}
                                    title="Select this?"
                                    description="mark for "
                                />
                                    : null
                            }
                        </MapView>

                }


                <Text style={{ backgroundColor: 'teal' }}>{this.state.region[0]}</Text>
                <Text style={{ backgroundColor: 'teal' }}>{this.state.region[1]}</Text>
            </View>

        )
    }
}
const styles = StyleSheet.create({
    test: {
        flex: 1,
    }
})