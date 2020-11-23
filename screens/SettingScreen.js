import React from 'react';
import {  Text, View ,StyleSheet,TouchableOpacity,TextInput} from 'react-native';
import MyHeader from '../components/MyHeader';
import db from '../config';
import firebase from 'firebase';

export default class SettingScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            emailId:'',
            firstName:'',
            lastName:'',
            address:'',
            contact:'',
            docId:''
        }
    }
    getUserDetails=()=>{
        var email = firebase.auth().currentUser.email;
        db.collection('users').where('email_id','==',email).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                var data=doc.data()
                this.setState({
                    emailId:data.email_id,
                    firstName:data.first_name,
                    lastName:data.last_name,
                    address:data.address,
                    contact:data.contact,
                    docId:doc.id
                })
            })
        })
    }
    updateUserDetails=()=>{
        db.collection('users').doc(this.state.docId)
        .update({
            "first_name":this.state.firstName,
            "last_name":this.state.lastName,
            "address":this.state.address,
            "contact":this.state.contact
        })
        alert("profile updated sucessfully")
    }
    componentDidMount(){
        this.getUserDetails()
    }
    render(){
        return(
            <View style = {styles.container}>
                <MyHeader title = "settings" navigation = {this.props.navigation}/>
                <View style = {styles.formContainer}>
                <Text
                            style = {styles.modalTitle}>Registration</Text>
                            <TextInput
                            style = {styles.formTextInput}
                            placeholder = {"first name"}
                            maxLength = {8}
                            onChangeText = {(text)=>{
                                this.setState({
                                    firstName:text
                                })
                            }}
                            value = {this.state.firstName}
                            />
                            <TextInput
                            style = {styles.formTextInput}
                            placeholder = {"last name"}
                            maxLength = {8}
                            onChangeText = {(text)=>{
                                this.setState({
                                    lastName:text
                                })
                            }}
                            value = {this.state.lastName}
                            />
                            <TextInput
                            style = {styles.formTextInput}
                            placeholder = {"contact"}
                            maxLength = {10}
                            keyboardType = {'numeric'}
                            onChangeText = {(text)=>{
                                this.setState({
                                    contact:text
                                })
                            }}
                            value = {this.state.contact}
                            />
                            <TextInput
                            style = {styles.formTextInput}
                            placeholder = {"address"}
                            multiline = {true}
                            onChangeText = {(text)=>{
                                this.setState({
                                    address:text
                                })
                            }}
                            value = {this.state.address}
                            />
                            <TouchableOpacity style = {styles.button}
                            onPress = {()=>{
                                this.updateUserDetails()
                            }}
                            >
                                <Text style = {styles.buttonText}>Save</Text>
                            </TouchableOpacity>

                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    formContainer:{
        flex:1,
        width:'100%',
        alignItems:'center'
    },
    formTextInput:{
        width:"75%",
        height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10
    },
    button:{
        width:300,
        height:50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:25,
        backgroundColor:"#ff9800",
        shadowColor:"#000",
        shadowOffset:{
            width:0,
            height:8
        },
        shadowOpacity:0.30,
        shadowRadius:10.3,
        elevation:16
    },
    buttonText:{
        color:'#ffff',
        fontWeight:'200',
        fontSize:20
    },
})