import React from 'react';
import { StyleSheet, Text, View ,TouchableOpacity,FlatList} from 'react-native';
import {Card,Icon,ListItem} from 'react-native-elements';
import MyHeader from '../components/MyHeader';
import db from '../config';
import firebase from 'firebase';

export default class MyDonationScreen extends React.Component{
    static navigationOptions = {
        header:null
    }
    constructor(){
        super();
        this.state = {
            donorId:firebase.auth().currentUser.email,
            allDonations:[],
            donorName:""
        },
        this.requestRef = null

    }
    getDonorDetails = (donorId)=>{
        db.collections("users").where("email_id",'==',donorId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                this.setState({
                    "donorName":doc.data().first_name+" "+doc.data().last_name
                })
            })
            
        })
    }
    getAllDonations = ()=>{
        this.requestRef = db.collections("all_donations").where("donor_id",'==',this.state.userId)
        .onSnapshot((snapshot)=>{
            var allDonations = []
            snapshot.docs.map((doc)=>{
                var donation = doc.data()
                donation["doc_id"]=doc.id
                allDonations.push(donation)
            })
            this.setState({
                allDonations:allDonations
            })
        })


    }
    sendBook =(bookDetails)=>{
        if(bookDetails.request_status==="Book Sent"){
            var requestStatus = "donor Interested"
            db.collection("all_donations").doc(bookDetails.doc_id).update({
                "request_status":"Donor Interested"

            })
            this.sendNotifications(bookDetails,requestStatus)
        }
        else{
            var requestStatus = "Book Sent"
            db.collection("all_donations").doc(bookDetails.doc_id).update({
                "request_status":"Book Sent"

            })
            this.sendNotifications(bookDetails,requestStatus)

        }
    }
    sendNotifications = (bookDetails,requestStatus)=>{
        var requestId = bookDetails.request_id
        var donorId = bookDetails.donor_id
        db.collection("all_notifications")
        .where("request_id","==",requestId)
        .where("donor_id","==",donorId)
        .get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                var message = ""
                if(requestStatus==="Book Sent"){
                    message = this.state.donorName+"sent you a bookk"
                }
                else{
                    message = this.state.donorName+"has shown interesst"

                }
                db.collection("all_notifications").doc(doc.id).update({
                    "message":message,
                    "notification_status":"unread",
                    "date":firebase.firestore.FieldValue.serverTimestamp()
                })
            })
        })
    }

    
    keyExtractor = (item,index)=>index.toString()

    renderItem = ({item,i})=>{
        return(
            <ListItem
            key = {i}
            title = {item.book_name}
            subtitle = {"requested by : "+item.requested_by+"\nStatus: "+item.request_status}
            leftElement = {<Icon name = "book" type = "font-awesome" color = '#696969'/>}
            titleStyle = {{color:'black',fontWeight:'bold'}}
            rightElement = {
                <TouchableOpacity style = {[styles.button,{backgroundColor:item.request_status==="Book Sent"?"green":"red"}]}
                onPress = {()=>{
                    this.sendBook(item)
                }}>
                    <text style = {{color:'#ffff'}}>{item.request_status==="book sent"?"book sent":"send book"}</text>
                </TouchableOpacity>
            }
            bottomDivider />
        )
    }
    componentDidMount(){
        this.getAllDonations()
        this.getDonorDetails(this.state.donorId)
    }
    componentWillUnmount(){
        this.requestRef()
    }
    render(){
        return(
            <View style = {{flex:1}}>
                <MyHeader title = "My donations" navigation = {this.props.navigation}/>
                <View style = {{flex:1}}>{
                    this.state.allDonations.length === 0
                    ?(
                        <View style = {styles.subContainer}>
                            <Text style = {{fontSize:20}}>list of all book donations</Text>
                            </View>
                    ):(
                        <FlatList
                        keyExtractor = {this.keyExtractor}
                        data = {this.state.allDonations}
                        renderItem = {this.renderItem}
                        />

                    )
                }

                </View>
            </View>
        )
    }


}
const styles = StyleSheet.create({
    subContainer:{
        flex:1,
        fontSize:20,
        justifyContent:'center',
        alignItems:'center'
    },
    button:{
        width:100,
        height:30,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:"#ff5722",
        shadowColor:"#000",
        shadowOffset:{
            width:0,
            height:8
        },
    },
    
})

 

