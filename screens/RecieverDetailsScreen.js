import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Card, Header, Icon} from 'react-native-elements';
import firebase from 'firebase';
import db from '../config.js';

export default class RecieverDetailsScreen extends React.Component{
   constructor(props){
       super(props)
       this.State = {
           userId:firebase.auth().currentUser.email,
           recieverId:this.props.navigation.getParam('details')["user_id"],
           requestId:this.props.navigation.getParam('details')["request_id"],
           bookName:this.props.navigation.getParam('details')["book_name"],
           reason_for_requesting:this.props.navigation.getParam('details')["reason_to_request"],
           recieverName:'',
           recieverContact:'',
           recieverAddress:'',
           recieverRequestDocId:''



       }
   }
   getRecieverDetails(){
       db.collection('users').where('email_id','==',this.state.recieverId).get()
       .then((snapshot)=>{
           snapshot.forEach(doc=>{
            this.setState({
                recieverName:doc.data().first_name,
                recieverContact:doc.data().contact,
                recieverAddress:doc.data().address
            })
 
           })
       })
       db.collection('requested_books').where('request_id','==',this.state.requestId).get()
       .then((snapshot)=>{
           snapshot.forEach(doc=>{
            this.setState({
                recieverRequestDocId:doc.id
            })
 
           })
       })

       
   }
   
   getUserDetails=(userId)=>{
    db.collection('users').where('email_id','==',userId).get()
    .then((snapshot)=>{
        snapshot.forEach(doc=>{
         this.setState({
            userName:doc.data().first_name + " " + doc.data().last_name
        })

        })
    })

   }
   updateBookStatus = ()=>{
       db.collection("all_donations").add({
        "book_name":this.state.bookName,
        "request_id":this.state.requestId,
        "requested_by":this.state.recieverName,
        "donor_id":this.state.userId,
        "request_status":"donor_interested"

       })
   }
   addNotifications = ()=>{
       var message = this.state.userName+" has shown interest in donating the book"
    db.collection("all_notifications").add({
     "book_name":this.state.bookName,
     "request_id":this.state.requestId,
     "target_user_id":this.state.recieverId,
     "donor_id":this.state.userId,
     "date":firebase.firestore.FieldValue.serverTimestamp(),
     "notification_status":"unread",
     "message":message

    })
}


componentDidMount(){
    this.getRecieverDetails()
    this.getUserDetails(this.state.userId)
}

render(){
    return(
        <View style = {styles.container}>
            <View style = {{flex:0.1}}>
            <Header
        leftComponent = {<Icon name = 'arrow-left' type = 'feather' color = '#696969' onPress = {()=>this.props.navigation.goBack()}/>}
        centerComponent = {{text:"donate boooks",style:{color:'#90a5a9',fontSize:20,fontWeight:"bold"}}}
        backgroundColor = "#eaf8fe"/>

            </View>
            <View style = {{flex:0.3}}>
                <Card title = {"book information"}
                titleStyle = {{fontSize:20}}>
                    <Card>
                        <Text style = {{fontWeight:'bold'}}>name:{this.state.bookName}</Text>
                        </Card>
                        <Card>
                        <Text style = {{fontWeight:'bold'}}>reason:{this.state.reason_for_requesting}</Text>
                        </Card>

                </Card>
                <Card title = {"reciever information"}
                titleStyle = {{fontSize:200}}>
                    <Card>
                        <Text style = {{fontWeight:'bold'}}>name:{this.state.recieverName}</Text>
                        </Card>
                        <Card>
                        <Text style = {{fontWeight:'bold'}}>contact:{this.state.recieverContact}</Text>
                        </Card>
                        <Text style = {{fontWeight:'bold'}}>address:{this.state.recieverAddress}</Text>
                        </Card>
                        <Card>

            

                </Card>
            <View
            style = {styles.buttonContainer}>
                {
                    this.state.recieverId!==this.state.userId
                    ?(
                        <TouchableOpacity
                        style= {styles.button}
                        onPress = {()=>{
                            this.updateBookStatus()
                                this.addNotifications()
                                this.props.navigation.navigate("my donations")
                            
                        }}>
                            <Text>i wannna donnate</Text>
                        </TouchableOpacity>
                    ):null
                }
            </View>
            </View>
        </View>
    )
}
}

const styles = StyleSheet.create(
    {
        container:{
            flex:1
        },
        buttonContainer:{
            flex:0.3,
            justifyContent:'center',
            alignItems:'center'
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
        
    }
)