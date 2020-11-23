import React from 'react';
import { StyleSheet, Text, View ,TouchableOpacity,FlatList} from 'react-native';
import {Card,Icon,ListItem} from 'react-native-elements';
import MyHeader from '../components/MyHeader';
import db from '../config';
import firebase from 'firebase';
import SwipableFlatlist from '../components/swipableFlatlist';

export default class NotificationScreen extends React.Component{
    static navigationOptions = {
        header:null
    }
    constructor(){
        super();
        this.state = {
            userId:firebase.auth().currentUser.email,
            allNotifications:[]
        },
        this.notificationRef = null

    }
    getNotifications = ()=>{
        this.notificationRef = db.collections("all_notification").where("notification_staus",'==',"unread")
        .where("targeted_user_id",'==',this.state.userId)
        .onSnapshot((snapshot)=>{
            var allNotifications = [];
            snapshot.docs.map((doc)=>{
                var notification = doc.data()
                notification["doc_id"]= doc.id;
                allNotifications.push(notification)
            })
            this.setState({
                allNotifications:allNotifications
            })
        })

    }
    keyExtractor = (item,index)=>index.toString()

    renderItem = ({item,i})=>{
        return(
            <ListItem
            key = {i}
            title = {item.book_name}
            subtitle = {item.message}
            leftElement = {<Icon name = "book" type = "font-awesome" color = '#696969'/>}
            titleStyle = {{color:'black',fontWeight:'bold'}}
            
            bottomDivider />
        )
    }
    componentDidMount(){
        this.getNotifications()
    }
    componentWillUnmount(){
        this.notificationRef()
    }
    render(){
        return(
            <View style = {{flex:1}}>
                <MyHeader title = "My notifications" navigation = {this.props.navigation}/>
                <View style = {{flex:1}}>{
                    this.state.allNotifications.length === 0
                    ?(
                        <View style = {styles.subContainer}>
                            <Text style = {{fontSize:20}}>sorry u have notificationsss(kidding)</Text>
                            </View>
                    ):(
                        <SwipableFlatlist allNotifications = {this.state.allNotifications}/>
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

 

