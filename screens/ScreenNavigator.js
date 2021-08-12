import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, ImageBackground, useEffect } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';


var houseSelected;

export default class ScreenNavigator extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            showRealApp: false,
            selected: ''
        }

    }

    componentDidMount() {

        houseSelected = this.props.route.params.site1;

        AsyncStorage.setItem('house', JSON.stringify(houseSelected));

        console.log("Data Saved successfully : " + JSON.stringify(houseSelected));

        if (houseSelected === 'HAR') {

            this.props.navigation.navigate('HarInventory');

        } else if (houseSelected === 'GER') {

            this.props.navigation.navigate('HarInventory');

        } else if (houseSelected === 'OHA') {

            this.props.navigation.navigate('HarInventory');


        } else if (houseSelected === 'REP') {

            this.props.navigation.navigate('HarInventory');



        }else {

        }



    }




    render() {

        return (

            <View style={styles.container}>




            </View>
        )


    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ebebeb'
    },

    buttonContainer1: {
        //backgroundColor: 'rgba(0,0,0,0.65)',
        borderRadius: 5,
        padding: 10,
        margin: 20,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center'

    },

    buttonContainer: {
        backgroundColor: '#D3D3D3',
        borderRadius: 5,
        padding: 10,
        margin: 20,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center'

    },

    textStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 19,
        color: '#000000',
        fontWeight: 'bold'

    },

    buttonText: {
        fontSize: 19,
        color: '#000000',
        fontWeight: 'bold',

    },
    backgroundImage: {

        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    }
})


