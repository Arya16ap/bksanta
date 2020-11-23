import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Header,Icon,Badge} from 'react-native-elements';
import db from '../config';

export default class MyHeader extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            userId:firebase.auth().currentUser.email,
            value:""
        }
    }
    getNumberOfUnreadNotifications(){
        db.collection('all_notification').where('notification_status','==',"unread")
        .onSnapshot((snapshot)=>{
            var unreadNotifications = snapshots.docs.map((doc)=>doc.data())
            this.setState({
                value:unreadNotifications.length
            })
        })
    }
    componentDidMount(){
        this.getNumberOfUnreadNotifications();
    }
    bellIconWithBadge=()=>{
        return(
            <View>
                <Icon name = 'bell' type = 'font-awesome' color = '#696969' size = {25}
                onPress = {()=>this.props.navigation.navigate('Notification')}/>
                <Badge
                value = {this.state.value}
                containerStyle = {{position:'absolute',top:-4,right:-4}}/>
            </View>
        )
    }
    render(){
        return(
            <Header
            leftComponent = {<Icon name = 'bars' type = 'font-awesome' color = '#696969' onPress = {()=>props.navigation.toggleDrawer()}/>}
            centerComponent = {{text:props.title,style:{color:'#90a5a9',fontSize:20,fontWeight:"bold"}}}
            rightComponent = {<this.bellIconWithBadge{...this.props}/>}
            backgroundColor = "#eaf8fe"/>
        )
    }
}
