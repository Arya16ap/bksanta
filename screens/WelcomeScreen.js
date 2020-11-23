import React from 'react';
import{Text,View,StyleSheet,TouchableOpacity,TextInput,Modal,KeyboardAvoidingView,ScrollView}from'react-native';
import db from '../config';
import firebase from 'firebase';

export default class WelcomeScreen extends React.Component{
    constructor(){
        super()
        this.state = {
            emailId:'',
            password:'',
            firstName:'',
            lastName:'',
            address:'',
            contact:'',
            confirmPassword:'',
            isModalVisible:'false'

        }
    }
    userLogin = (emailId,password)=>{
        firebase.auth().signInWithEmailAndPassword(emailId,password)
        .then(()=>{
            alert("1")
            this.props.navigation.navigate('DonateBooks')
        })
        .catch((error)=>{
            var errorCode = error.code;
            var errorMessage = error.Message
            return alert(errorMessage)
        })
    }
    userSignUp = (emailId,password,confirmPassword)=>{
        if(password !== confirmPassword){
            return alert("password dosent match")
        }
        else{

        
            firebase.auth().createUserWithEmailAndPassword(emailId,password)
            .then(()=>{
                db.collection('users').add({
                    first_name:this.state.firstName,
                    last_name:this.state.lastName,
                    contact:this.state.contact,
                    email_id:this.state.emailId,
                    address:this.state.address
                })
                return alert(
                    'user added sucessfully',
                    '',
                    [
                        {text:'OK',onPress:()=>this.setState({"isModalVisible":false})}
                    ]
                )
            })
            .catch((error)=>{
                var errorCode = error.code;
                var errorMessage = error.Message
                return alert(errorMessage)
            })
        }
    }
    showModal=()=>{
        return(
            <Modal
            animationType = "fade"
            transparent = {true}
            visible = {this.state.isModalVisible}>
                <View style = {styles.modalContainer}>
                    <ScrollView style = {{width:'100%'}}>
                        <KeyboardAvoidingView style = {styles.KeyboardAvoidingView}>
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
                            }}/>
                            <TextInput
                            style = {styles.formTextInput}
                            placeholder = {"last name"}
                            maxLength = {8}
                            onChangeText = {(text)=>{
                                this.setState({
                                    lastName:text
                                })
                            }}/>
                            <TextInput
                            style = {styles.formTextInput}
                            placeholder = {"contact"}
                            maxLength = {10}
                            keyboardType = {'numeric'}
                            onChangeText = {(text)=>{
                                this.setState({
                                    contact:text
                                })
                            }}/>
                            <TextInput
                            style = {styles.formTextInput}
                            placeholder = {"address"}
                            multiline = {true}
                            onChangeText = {(text)=>{
                                this.setState({
                                    address:text
                                })
                            }}/>
                            <TextInput
                            style = {styles.formTextInput}
                            placeholder = {"email-Adress"}
                            keyboardType = {'email-address'}
                            onChangeText = {(text)=>{
                                this.setState({
                                    emailId:text
                                })
                            }}/>
                            <TextInput
                            style = {styles.formTextInput}
                            placeholder = {"password"}
                            secureTextEntry = {true}
                            onChangeText = {(text)=>{
                                this.setState({
                                    password:text
                                })
                            }}/>
                            <TextInput
                            style = {styles.formTextInput}
                            placeholder = {"confirm password"}
                            secureTextEntry = {true}
                            onChangeText = {(text)=>{
                                this.setState({
                                    confirmPassword:text
                                })
                            }}/>
                            <View style = {styles.modalBackButton}>
                                <TouchableOpacity
                                style = {styles.registerButton}
                                onPress = {()=>this.userSignUp(this.state.emailId,this.state.password,this.state.confirmPassword)}>
                                    <Text style = {styles.registerButtonText}>register</Text>
                                </TouchableOpacity>
                            </View>
                            <View style = {styles.modalBackButton}>
                                <TouchableOpacity
                                style = {styles.cancelButton}
                                onPress = {()=>this.setState({"isModalVisible":false})}>
                                    <Text style = {styles.registerButtonText}>cancel</Text>
                                </TouchableOpacity>
                            </View>






                        </KeyboardAvoidingView>
                    </ScrollView>
                </View>
            </Modal>
        )
    }
    render(){
        return(
            <View style = {styles.container}>
                <View style = {{justifyContent:'center',alignItems:'center'}}>{
                    this.showModal()
                }
                    
                </View>
                <View style = {styles.profileContainer}>
                    <Text style = {styles.title}>Book Santa</Text>
                </View>
                <View style = {styles.buttonContainer}>
                    <TextInput
                    style = {styles.loginBox}
                    placeholder = "example@booksanta.com"
                    placeholderTextColor = "#fff"
                    keyboardType = 'email-address'
                    onChangeText = {(text)=>{
                        this.setState({
                            emailId:text
                        })
                    }}/>
                     <TextInput
                    style = {styles.loginBox}
                    placeholder = "password"
                    placeholderTextColor = "#fff"
                    secureTextEntry = {true}
                    onChangeText = {(text)=>{
                        this.setState({
                            password:text
                        })
                    }}/>
                    <TouchableOpacity
                    style = {[styles.button,{marginBottom:20,marginTop:20}]}
                    onPress = {()=>{
                        this.userLogin(this.state.emailId,this.state.password)
                    }}>
                        <Text style = {styles.buttonText}>login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style = {styles.button}
                    onPress = {()=>{
                        this.setState({"isModalVisible":true})
                    }}>
                        <Text style = {styles.buttonText}>SignUp</Text>
                    </TouchableOpacity>

                </View>
            </View>
        )
    }
    
}
const styles = StyleSheet.create({
container:{
    flex:1,
    backgroundColor:'#f8be85'
},
profileContainer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
},
title:{
    fontSize:65,
    fontWeight:'300',
    paddingBottom:30,
    color:'#ff3d00'
},
loginBox:{
    width:300,
    height:40,
    borderBottomWidth:1.5,
    borderColor:'#ff8a65',
    fontSize:20,
    margin:0,
    paddingLeft:10
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
buttonContainer:{
    flex:1,
    alignItems:'center'
},
KeyboardAvoidingView:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
},
modalTitle:{
    justifyContent:'center',
    alignSelf:'center',
    fontSize:30,
    color:'#ff5722',
    margin:50
},
modalContainer:{
    flex:1,
    borderRadius:20,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ffff",
    marginRight:30,
    marginLeft:30,
    marginTop:80
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
registerButton:{
    width:200,
    height:40,
    alignItems:'center',
    justifyContent:'center',
    borderWidth:1,
    borderRadius:10,
    marginTop:30.,

},
registerButtonText:{
    color:'#ff5722',
    fontSize:15,
    fontWeight:'bold'
},
cancelButton:{
    width:200,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    marginTop:5
}

})