import React, { Component, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, BackHandler, TextInput, Image, Alert, Modal, ActivityIndicator, Platform } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView } from 'react-native';
import { CheckBox } from 'react-native-elements'
import NetInfo from "@react-native-community/netinfo";


var checkUsername;

export default class HarInventory extends React.Component {


    constructor(props) {
        super(props)

        this.state = {

            isVisible: false,
            username: '',
            mrbShoes: '',
            beltBags: '',
            labCoats: '',
            overall: '',
            booties: '',
            cutProofGloves: '',
            droppingGloves: '',
            latexGloves: '',
            blueKnife: '',
            orangeKnife: '',
            checked: false,
            isItConnected: '',
            isLoading: false,
            clicked: 'no'


        }

    }

    async setItem(myKey, value) {
        try {
            this.setState({
                isDataSend: false,

            });

            return await AsyncStorage.setItem(myKey, JSON.stringify(value));
        } catch (error) {
            // console.error('AsyncStorage#setItem error: ' + error.message);
        }
    }

    //CHECKING CONNECTION

    handleConnectivityChange = state => {
        if (state.isConnected) {

            this.setState({ isItConnected: 'Online' });

        } else {

            this.setState({ isItConnected: 'Offline' });
        }
    };

    CheckConnectivity = () => {
        // For Android devices
        if (Platform.OS === "android") {
            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {
                    Alert.alert("You are online!");
                } else {
                    Alert.alert("You are offline!");
                }
            });
        } else {
            // For iOS devices
            NetInfo.isConnected.addEventListener(
                "connectionChange",
                this.handleFirstConnectivityChange
            );
        }
    };

    handleFirstConnectivityChange = isConnected => {
        NetInfo.isConnected.removeEventListener(
            "connectionChange",
            this.handleFirstConnectivityChange
        );

        if (isConnected === false) {
            Alert.alert("You are offline!");
        } else {
            Alert.alert("You are online!");
        }
    };

    //END

    // hide show modal
    displayModal(show) {
        this.setState({ isVisible: show })
    }

    updateTextInput = (text, field) => {
        this.setItem(field, text)
        const state = this.state
        state[field] = text;
        this.setState(state);
    }

    //save username
    saveUsername() {

        const { username } = this.state;

        if (username != '') {

            this.displayModal(false);

        } else {

            alert('Enter your name')

        }


    }

    handleBackButton = () => {

        BackHandler.exitApp();

    }

    changeCheckbox = () => {

        this.setState({ checked: !this.state.checked })

        this.sendDataToSheet();
    }

    onButtonPress = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        // then navigate
        navigate('NewScreen');
    }

    sendDataToSheet = () => {

        if (this.state.isItConnected == 'Online') {

            if (!this.state.checked) {

                var that = this;
                this.setState({ isLoading: true })

                const scriptUrl = 'https://script.google.com/macros/s/AKfycbx3f9YgrjfOhp1apFCELTwBygOve1XJlK7fxe-figyRL-oGvQA/exec';
                const url = `${scriptUrl}?
                callback=ctrlq&action=${'doPostHarInventory'}&user_name=${that.state.username}&mrb_shoes=${that.state.mrbShoes}&belt_bags=${that.state.beltBags}&lab_coats=${that.state.labCoats}&overalls=${that.state.overall}&booties=${that.state.booties}&cut_proof_gloves=${that.state.cutProofGloves}&dropping_gloves=${that.state.droppingGloves}&latex_gloves=${that.state.latexGloves}&blue_knifes=${that.state.blueKnife}&orange_knifes=${that.state.orangeKnife}`;

                console.log("URL : " + url);
                fetch(url, { mode: 'no-cors' }).then((response) => {

                    if (response.status === 200) {

                        this.setState({ isLoading: false, checked: false })


                    } else {


                    }
                });

            } else {


            }

        } else {

            Alert.alert(
                'No Internet Connection ?',
                'Please check your internet connection and try again',
                [
                    { text: 'OK', onPress: () => console.log('No button clicked'), style: 'cancel' },
                ],
                {
                    cancelable: false
                }
            );


        }


    }


    componentDidMount() {

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

        NetInfo.addEventListener(this.handleConnectivityChange);


        try {
            AsyncStorage.getItem('username').then((text1Value) => {
                checkUsername = JSON.parse(text1Value);
                this.setState({ username: checkUsername })

                console.log(checkUsername);
                if (checkUsername == null) {

                    this.displayModal(true)

                } else {

                    console.log("Async Storage is full");
                }

            }).done();
        } catch (error) {


        }
    }


    componentWillUnmount() {

        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    render() {

        if (this.state.isLoading) {
            return (
                <View style={styles.activity}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
        }

        return (

            <View style={styles.container}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 20 }}>

                    <View>

                        <TouchableOpacity onPress={() => this.displayModal(true)} >
                            <Image source={require('../assets/settings.png')} />
                        </TouchableOpacity>

                    </View>

                    <Text style={[Platform.OS == 'android'?styles.headerText: styles.headerTextIos]}>Inventory Control</Text>


                    <View>

                        <Image source={require('../assets/search.png')} />

                    </View>


                </View>

                <Modal
                    animationType={"fade"}
                    transparent={false}
                    visible={this.state.isVisible}
                    onRequestClose={() => {
                        console.log("Closed");
                    }}>

                    <View style={styles.customSettings}>

                        <Text style={styles.titleHeadingText}>Enter Your Name Below : </Text>

                        <View style={styles.borderEdit}>
                            <TextInput style={styles.textInputStyle}
                                autoCapitalize="sentences"
                                multiline={false}
                                autoCorrect={false}
                                enablesReturnKeyAutomatically={true}
                                onChangeText={(text) => this.updateTextInput(text, 'username')}
                                returnKeyType={"done"}
                                keyboardType={'default'}


                            />

                        </View>

                        <View style={styles.inBtnmarginDimension}></View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                this.saveUsername();
                            }}>
                            <Text style={styles.buttonText1}>Done</Text>
                        </TouchableOpacity>
                    </View>


                </Modal>

                <ScrollView style={styles.scrollMargin}
                    keyboardShouldPersistTaps='handled'>


                    <View style={styles.borderColoredEdit}>

                        <View style={styles.flexRowSettings}>

                            <View style={styles.flexSettings}>

                                <Text style={[Platform.OS == 'android'?styles.titleText: styles.titleTextIos]}>MRB Shoes</Text>
                                <View style={styles.imageMargin}>
                                    <Image source={require('../assets/shoe.png')} />
                                </View>
                            </View>

                            <View style={styles.flexSettings}>

                                <Text style={[Platform.OS == 'android'?styles.titleText: styles.titleTextIos]}>Quantity</Text>

                                <View style={{ marginBottom: 8 }}>

                                    <View style={styles.borderEdit2}>
                                        <TextInput style={[Platform.OS == 'android'?styles.textInputStyle2: styles.textInputStyle2Ios]}
                                            multiline={false}
                                            autoCorrect={false}
                                            enablesReturnKeyAutomatically={true}
                                            editable={true}
                                            keyboardType={'numeric'}
                                            blurOnSubmit={true}
                                            onChangeText={(text) => this.updateTextInput(text, 'mrbShoes')}
                                            returnKeyType={"done"}
                                        />

                                    </View>

                                </View>

                            </View>
                        </View>

                    </View>

                    <View style={styles.inBtnmarginDimension}></View>


                    <View style={styles.borderColoredEdit}>

                        <View style={styles.flexRowSettings}>

                            <View style={styles.flexSettings}>

                                <Text style={[Platform.OS == 'android'?styles.titleText: styles.titleTextIos]}>Belt Bags</Text>
                                <View style={styles.imageMargin}>
                                    <Image source={require('../assets/bags.png')} />
                                </View>
                            </View>

                            <View style={styles.flexSettings}>

                                <Text style={[Platform.OS == 'android'?styles.titleText: styles.titleTextIos]}>Quantity</Text>


                                <View style={styles.borderEdit2}>
                                    <TextInput style={[Platform.OS == 'android'?styles.textInputStyle2: styles.textInputStyle2Ios]}
                                        multiline={false}
                                        autoCorrect={false}
                                        enablesReturnKeyAutomatically={true}
                                        editable={true}
                                        keyboardType={'numeric'}
                                        blurOnSubmit={true}
                                        onChangeText={(text) => this.updateTextInput(text, 'beltBags')}
                                        returnKeyType={"done"}
                                    />


                                </View>

                            </View>
                        </View>

                    </View>

                    <View style={styles.inBtnmarginDimension}></View>


                    <View style={styles.borderColoredEdit}>

                        <View style={styles.flexRowSettings}>

                            <View style={styles.flexSettings}>

                                <Text style={[Platform.OS == 'android'?styles.titleText: styles.titleTextIos]}>Lab Coats</Text>
                                <View style={styles.imageMargin}>
                                    <Image source={require('../assets/coat.png')} />
                                </View>
                            </View>

                            <View style={styles.flexSettings}>

                                <Text style={[Platform.OS == 'android'?styles.titleText: styles.titleTextIos]}>Quantity</Text>


                                <View style={styles.borderEdit2}>
                                    <TextInput style={[Platform.OS == 'android'?styles.textInputStyle2: styles.textInputStyle2Ios]}
                                        multiline={false}
                                        autoCorrect={false}
                                        enablesReturnKeyAutomatically={true}
                                        editable={true}
                                        keyboardType={'numeric'}
                                        blurOnSubmit={true}
                                        onChangeText={(text) => this.updateTextInput(text, 'labCoats')}
                                        returnKeyType={"done"}
                                    />


                                </View>

                            </View>
                        </View>

                    </View>

                    <View style={styles.inBtnmarginDimension}></View>


                    <View style={styles.borderColoredEdit}>

                        <View style={styles.flexRowSettings}>

                            <View style={styles.flexSettings}>

                                <Text style={[Platform.OS == 'android'?styles.titleText: styles.titleTextIos]}>Overall</Text>
                                <View style={styles.imageMargin}>
                                    <Image source={require('../assets/coat.png')} />
                                </View>
                            </View>

                            <View style={styles.flexSettings}>

                                <Text style={[Platform.OS == 'android'?styles.titleText: styles.titleTextIos]}>Quantity</Text>


                                <View style={styles.borderEdit2}>
                                    <TextInput style={[Platform.OS == 'android'?styles.textInputStyle2: styles.textInputStyle2Ios]}
                                        multiline={false}
                                        autoCorrect={false}
                                        enablesReturnKeyAutomatically={true}
                                        editable={true}
                                        keyboardType={'numeric'}
                                        blurOnSubmit={true}
                                        onChangeText={(text) => this.updateTextInput(text, 'overall')}
                                        returnKeyType={"done"}
                                    />


                                </View>

                            </View>
                        </View>

                    </View>

                    <View style={styles.inBtnmarginDimension}></View>


                    <View style={styles.borderColoredEdit}>

                        <View style={styles.flexRowSettings}>

                            <View style={styles.flexSettings}>

                                <Text style={[Platform.OS == 'android'?styles.titleText: styles.titleTextIos]}>Booties</Text>
                                <View style={styles.imageMargin}>
                                    <Image source={require('../assets/boots.png')} />
                                </View>
                            </View>

                            <View style={styles.flexSettings}>

                                <Text style={[Platform.OS == 'android'?styles.titleText: styles.titleTextIos]}>Quantity</Text>


                                <View style={styles.borderEdit2}>
                                    <TextInput style={[Platform.OS == 'android'?styles.textInputStyle2: styles.textInputStyle2Ios]}
                                        multiline={false}
                                        autoCorrect={false}
                                        enablesReturnKeyAutomatically={true}
                                        editable={true}
                                        keyboardType={'numeric'}
                                        blurOnSubmit={true}
                                        onChangeText={(text) => this.updateTextInput(text, 'booties')}
                                        returnKeyType={"done"}
                                    />


                                </View>

                            </View>
                        </View>

                    </View>

                    <View style={styles.inBtnmarginDimension}></View>


                    <View style={styles.borderColoredEdit}>

                        <View style={styles.flexRowSettings}>

                            <View style={styles.flexSettings}>

                                <Text style={[Platform.OS == 'android'?styles.titleText: styles.titleTextIos]}>Gloves</Text>
                                <View style={{ marginTop: 8 }}></View>

                                <View style={styles.imageMargin}>
                                    <Image source={require('../assets/gloves.png')} />
                                </View>

                                <Text style={[Platform.OS == 'android'?styles.titleText2: styles.titleText2Ios]}></Text>

                            </View>

                            <View style={styles.flexSettings}>

                                <Text style={[Platform.OS == 'android'?styles.titleText: styles.titleTextIos]}></Text>


                                <Text style={[Platform.OS == 'android'?styles.titleText2: styles.titleText2Ios]}>Cut Proof</Text>
                                <Text style={[Platform.OS == 'android'?styles.titleText2: styles.titleText2Ios]}>Dropping</Text>
                                <Text style={[Platform.OS == 'android'?styles.titleText2: styles.titleText2Ios]}>Latex</Text>

                            </View>

                            <View style={styles.flexSettings}>

                                <Text style={[Platform.OS == 'android'?styles.titleText: styles.titleTextIos]}>Quantity</Text>

                                <View style={{ marginTop: 8 }}></View>


                                <View style={styles.borderEdit2}>
                                    <TextInput style={[Platform.OS == 'android'?styles.textInputStyle3: styles.textInputStyle3Ios]}
                                        multiline={false}
                                        autoCorrect={false}
                                        enablesReturnKeyAutomatically={true}
                                        editable={true}
                                        keyboardType={'numeric'}
                                        blurOnSubmit={true}
                                        onChangeText={(text) => this.updateTextInput(text, 'cutProofGloves')}
                                        returnKeyType={"done"}
                                    />


                                </View>

                                <View style={{ marginBottom: 8 }}></View>


                                <View style={styles.borderEdit2}>
                                    <TextInput style={[Platform.OS == 'android'?styles.textInputStyle3: styles.textInputStyle3Ios]}
                                        multiline={false}
                                        autoCorrect={false}
                                        enablesReturnKeyAutomatically={true}
                                        editable={true}
                                        keyboardType={'numeric'}
                                        blurOnSubmit={true}
                                        onChangeText={(text) => this.updateTextInput(text, 'droppingGloves')}
                                        returnKeyType={"done"}
                                    />


                                </View>

                                <View style={{ marginBottom: 8 }}></View>


                                <View style={styles.borderEdit2}>
                                    <TextInput style={[Platform.OS == 'android'?styles.textInputStyle3: styles.textInputStyle3Ios]}
                                        multiline={false}
                                        autoCorrect={false}
                                        enablesReturnKeyAutomatically={true}
                                        editable={true}
                                        keyboardType={'numeric'}
                                        blurOnSubmit={true}
                                        onChangeText={(text) => this.updateTextInput(text, 'latexGloves')}
                                        returnKeyType={"done"}
                                    />


                                </View>

                            </View>
                        </View>

                    </View>

                    <View style={styles.inBtnmarginDimension}></View>


                    <View style={styles.borderColoredEdit}>

                        <View style={styles.flexRowSettings}>

                            <View style={styles.flexSettings}>

                                <Text style={[Platform.OS == 'android'?styles.titleText: styles.titleTextIos]}>Knifes</Text>
                                <View style={{ marginTop: 8 }}></View>

                                <View style={styles.imageMargin}>
                                    <Image source={require('../assets/knife.png')} />
                                </View>

                                <Text style={[Platform.OS == 'android'?styles.titleText2: styles.titleText2Ios]}></Text>

                            </View>

                            <View style={styles.flexSettings}>

                                <Text style={[Platform.OS == 'android'?styles.titleText: styles.titleTextIos]}></Text>


                                <Image source={require('../assets/blue.png')} />
                                <View style={{ marginBottom: 0.1 }}></View>

                                <Image source={require('../assets/orange.png')} />
                                <View style={{ marginBottom: 0.1 }}></View>



                            </View>

                            <View style={styles.flexSettings}>

                                <Text style={[Platform.OS == 'android'?styles.titleText: styles.titleTextIos]}>Quantity</Text>

                                <View style={{ marginBottom: 8 }}></View>

                                <View style={styles.borderEdit2}>
                                    <TextInput style={[Platform.OS == 'android'?styles.textInputStyle3: styles.textInputStyle3Ios]}
                                        multiline={false}
                                        autoCorrect={false}
                                        enablesReturnKeyAutomatically={true}
                                        editable={true}
                                        keyboardType={'numeric'}
                                        blurOnSubmit={true}
                                        onChangeText={(text) => this.updateTextInput(text, 'blueKnife')}
                                        returnKeyType={"done"}
                                    />

                                </View>

                                <View style={{ marginBottom: 8 }}></View>


                                <View style={styles.borderEdit2}>
                                    <TextInput style={[Platform.OS == 'android'?styles.textInputStyle3: styles.textInputStyle3Ios]}
                                        multiline={false}
                                        autoCorrect={false}
                                        enablesReturnKeyAutomatically={true}
                                        editable={true}
                                        keyboardType={'numeric'}
                                        blurOnSubmit={true}
                                        onChangeText={(text) => this.updateTextInput(text, 'orangeKnife')}
                                        returnKeyType={"done"}
                                    />

                                </View>

                            </View>
                        </View>

                    </View>

                    <View style={styles.inBtnmarginDimension}></View>

                    <Text style={[Platform.OS == 'android'?styles.bottomText: styles.bottomTextIos]}>Is the inventory form completed ?</Text>

                    <View style={styles.inBtnmarginDimension}></View>

                    <Text style={[Platform.OS == 'android'?styles.bottomText: styles.bottomTextIos]}>Please tick the below box if it is done</Text>


                    <CheckBox style={styles.styleCheckbox}
                        center
                        title='Completed'
                        size={45}
                        uncheckedColor='red'
                        checkedColor='green'
                        checked={this.state.checked}
                        textStyle={[Platform.OS == 'android'?{ fontSize: 18, fontFamily: "Sedan_Regular" }: { fontSize: 18}]}
                        containerStyle={{ backgroundColor: 'transparent', border: 0 }}
                        onPress={() => this.changeCheckbox()}
                    />

                    <View style={styles.inBtnmarginDimension}></View>

                </ScrollView>




            </View>

        )


    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },

    imageMargin: {

        marginLeft: 15
    },

    styleCheckbox: {

        alignItems: 'center'

    },

    titleText: {

        fontSize: 18,
        color: 'black',
        fontFamily: "Sedan_Regular",
        textDecorationLine: 'underline'

    },

    titleTextIos: {

        fontSize: 18,
        color: 'black',
        textDecorationLine: 'underline'

    },

    bottomText: {

        fontSize: 18,
        color: 'black',
        fontFamily: "Sedan_Regular",
        textAlign: 'center'

    },

    bottomTextIos: {

        fontSize: 18,
        color: 'black',
        textAlign: 'center'

    },



    titleText2: {

        fontSize: 18,
        color: 'white',
        fontFamily: "Sedan_Regular",
        marginBottom: 5

    },

    titleText2Ios: {

        fontSize: 18,
        color: 'white',
        marginBottom: 5

    },

    activity: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },

    flexSettings: {

        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: 8,
        marginRight: 8

    },

    flexRowSettings: {

        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 8,
        marginRight: 8,
        marginBottom: 8

    },

    scrollMargin: {

        marginLeft: 22,
        marginRight: 22,


    },

    customSettings: {

        marginTop: 150,
        marginBottom: 10,
        width: '100%',
        height: 350,
        padding: 40,

    },

    inBtnmarginDimension: {

        marginTop: 25,

    },

    titleHeadingText: {

        color: 'black',
        fontSize: 20,
        fontWeight: 'bold'

    },
    textInputStyle: {
        fontSize: 15,
        color: 'black',
        padding: 8,
        height: 50,
        backgroundColor: '#ffffff',
    },

    textInputStyle2: {
        fontSize: 20,
        color: 'white',
        padding: 8,
        height: 50,
        fontFamily: "Sedan_Regular",
        textAlign: 'center',

    },

    textInputStyle2Ios: {
        fontSize: 20,
        color: 'white',
        padding: 8,
        height: 50,
        textAlign: 'center',

    },

    textInputStyle3: {
        fontSize: 16,
        color: 'white',
        padding: 8,
        fontFamily: "Sedan_Regular",
        textAlign: 'center',

    },

    textInputStyle3Ios: {
        fontSize: 16,
        color: 'white',
        padding: 8,
        textAlign: 'center',

    },


    headerText: {

        fontSize: 22,
        color: 'black',
        fontFamily: "Sedan_Regular",
    },

    headerTextIos: {

        fontSize: 22,
        color: 'black',
    },

    borderEdit: {

        marginTop: 12,
        borderColor: '#F1EEEC',
        borderWidth: 1,
        borderRadius: 10,
    },

    borderEdit2: {

        borderColor: '#F1EEEC',
        borderWidth: 1,
        borderRadius: 10,
    },

    borderColoredEdit: {

        backgroundColor: '#43b69b',
        padding: 8,
        borderRadius: 10,


    },

    button: {
        display: 'flex',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#15A483',
        shadowOpacity: 0.5,
        shadowOffset: {
            height: 10,
            width: 0
        },
        shadowRadius: 25,
    },
    closeButton: {
        display: 'flex',
        height: 60,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF3974',
        shadowColor: '#2AC062',
        shadowOpacity: 0.5,
        shadowOffset: {
            height: 10,
            width: 0
        },
        shadowRadius: 25,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 22,
    },
    image: {
        marginTop: 150,
        marginBottom: 10,
        width: '100%',
        height: 350,
    },
    text: {
        fontSize: 24,
        marginBottom: 30,
        padding: 40,
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

    buttonText1: {
        fontSize: 19,
        color: '#ffffff',
        fontWeight: 'bold',

    },
    backgroundImage: {

        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    }
})