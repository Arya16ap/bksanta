import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';
import firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';
import { Avatar } from 'react-native-elements';
import db from '../config';

export default class CustomSideBarMenu extends React.Component {
    state = {
        userId: firebase.auth().currentUser.email,
        image: null,
        name: "",
        docId: ""
    }
    selectPicture = async()=>{
        const {cancelled,uri}=await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.all,
            allowsEditing:true,
            aspect:[4,3],
            quality:1
        })
        if(!cancelled){
            this.loadImage(uri,imageName);

        }
    }
    uploadImage = async(uri,imageName)=>{
        var response = await fetch(uri);
        var blob  = await response.blob();

        var ref = firebase
        .ref()
        .storage()
        .child("user_profiles/"+imageName);
        return ref.put(blob).then((response)=>{
            this.fetchImage(imageName)
        })
    }
    fetchImage = (imageName)=>{
        var storageRef = firebase
        .ref()
        .storage()
        .child("user_profiles/"+imageName);

        storageRef
        .getDownloadURL()
        .then((url)=>{
            this.setState({
                image:url
            })
        })
        .catch((error)=>{
            this.setState({
                image:"#"
            })

        })
    }
    getUserProfile(){
        db.collection("users")
        .where("emai_id","==",this.state.userId)
        .onSnapshot((querySnapshot)=>{
            querySnapshot.forEach((doc)=>{
                this.setState({
                    name:doc.data().first_name+" "+doc.data().last_name,
                    docId:doc.id,
                    image:doc.data().image
                })
            })
        })
    }
    componentDidMount(){
        this.fetchImage(this.state.userId);
        this.getUserProfile();
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style  = {{flex:0.5,alignItems:"center",backgroundColor:"orange"}}>
                    <Avatar
                    rounded
                    source = {{uri:this.state.image}}
                    size = "medium"
                    onPress = {()=>this.selectPicture()}
                    containerStyle = {style.imageContainer}
                    showEditButton/>
                    <Text style = {{fontWeight:"100",fontSize:20,paddingTop:10}}>{this.state.name}</Text>
                </View>
                <View style={{ flex: 0.8 }}>
                    <DrawerItems {...this.props} />
                </View>
                <View style={{ flex: 0.2, justifyContent: 'flex-end', paddingBottom: 20 }}>
                    <TouchableOpacity style={{ height: 30, width: '100%', justifyContent: "center", padding: 10 }}
                        onPress={() => {
                            this.props.navigation.navigate('WelcomeScreen')
                            firebase.auth().signOut()
                        }}>
                        <Text>logOut</Text>
                    </TouchableOpacity>

                </View>

            </View>
        )
    }
}