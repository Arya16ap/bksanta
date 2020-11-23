import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View ,KeyboardAvoidingView, SnapshotViewIOS} from 'react-native';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import firebase from 'firebase';
import db from '../config';
import MyHeader from '../components/MyHeader';
import { TextInput, TouchableHighlight, TouchableOpacity} from 'react-native-gesture-handler';
import BookSearch from 'react-native-google-books';

export default class BookRequestScreen extends Component{
    constructor(){
        super()
        this.state = {
            userId:firebase.auth().currentUser.email,
            bookName:"",
            reasonToRequest:"",
            isBookRequestActive:"",
            requestedBookName:"",
            bookStatus:"",
            requestId:"",
            userDocId:"",
            docId:'',
            imageLink:'',
            dataSource:"",
            showFlatlist:false
        }
    }

    createUniqueId(){
        return Math.random().toString(36).substring(7)
    }
    addRequest = async(bookName,reasonToRequest)=>{
        var userId = this.state.userId
        var randomRequestId = this.createUniqueId()
        var books = await BookSearch.BookSearch.searchbook(bookName,'AIzaSyDPbkVspRv9h9HhPsky50njYPEQQ1chcPc')
        db.collection("requested_books").add({
            "user_id":userId,
            "book_name":bookName,
            "reason_to_request":reasonToRequest,
            "request_id":randomRequestId
        })
        await this.getBookRequest()
        db.collection("users").where("email_id","==",userId).get()
        .then()
        .then((Snapshot)=>{
            Snapshot.forEach((doc)=>{
                db.collection("users").doc(doc.id).update({
                    isBookRequestActive:true
                })
            })
        })
        this.setState({
            bookName:'',
            reasonToRequest:'',
            requestId:randomRequestId

        })
        return alert("book requested sucessfull")
    }
    recievedBooks = (bookName)=>{
        var userId = this.state.userId
        var requestId = this.state.requestId
        db.collection('recieved_books').add({
            "user_id":userId,
            "book_name":bookName,
            "request_id":requestId,
            "bookStatus":"recieved"
        })
    }
    getIsBookRequestActive(){
        db.collection('users')
        .where('email_id','==',this.state.userId)
        .onSnapshot(querySnapshot=>{
            querySnapshot.forEach(doc=>{
                this.setState({
                    isBookRequestActive:doc.data().isBookRequestActive,
                    userDocId:doc.id

                })
            })
        })
    }
    getBookRequest = ()=>{
        var BookRequest = db.collection('requested_books')
        .where('user_id','==',this.state.userId)
        .get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                if(doc.data().book_status!=="recieved"){
                    this.setState({
                        requestId:doc.data().request_id,
                        requestedBookName:doc.data().book_name,
                        bookStatus:doc.data().book_name,
                        bookStatus:doc.data().book_status,
                        docId:doc.id
    
                    })
                }
            })
        })
    }
    sendNotification = ()=>{
        db.collection('users').where('email_id','==',this.state.userId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                var name = doc.data().first_name;
                var lastName = doc.data().last_name

                db.collection('all_notifications').where('request_id','==',this.state.requestId).get()
                .then((snapshot)=>{
                    snapshot.forEach((doc)=>{
                        var donorId = doc.data().donor_id;
                        var bookName = doc.data().book_name

                        db.collection('all_notifications').add({
                            "targeted_user_id":donorId,
                            "message":name+" "+lastName+" recieved the booke"+bookName,
                            "notification_status":"unread",
                            "book_name":bookName
                        })
        
                    })
                })
        

            })
        })
    }
    componentDidMount(){
        this.getBookRequest();
        this.getIsBookRequestActive();
    }
    updateBookRequestStatus=()=>{
        db.collection('requested_books').doc(this.state.docId).update({
            book_status:'recieved'
            
        })
        db.collection('users').where('email_id','==',this.state.userId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                db.collection('users').doc(doc.id).update({
                    isBookRequestActive:false
                })
            })
        })
    }
    async getBooksFromAPI(bookName){
        this.setState({bookName:bookName})
        if(bookName.length>5){
            var books = await BookSearch.BookSearch.searchbook(bookName,'AIzaSyDPbkVspRv9h9HhPsky50njYPEQQ1chcPc')
            this.setState({
                dataSource:books.data,
                showFlatlist:true
            })
        }
    }
    renderItem = ({item,i})=>{
        let obj = {
            title:item.volumeInfo.title,
            selfLink:item.selfLink,
            buylink:item.saleInfo.buylink,
            imageLink:item.volumeInfo.imageLinks
        }
        return(
            <TouchableHighlight
            style = {{alignItems:"center",backgroundColor:"#dddd",padding:10,width:'90%'}}
            activeOpacity = {0.6}
            UnderlayColor = "#dddd"
            onPress = {()=>{
                this.setState({
                    showFlatlist:false,
                    bookName:item.volumeInfo.title
                })
            }}
            bottomDivider>
                <Text>{item.volumeInfo.title}</Text>
            </TouchableHighlight>
        )
    }
    render(){
        if(this.state.isBookRequestActive===true){
            <View style = {{flex:1,justifyContent:'center'}}>
                <View style = {{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
                    <Text>BooooookName</Text>
                    <Text>{this.state.requestedBookName}</Text>
                </View>
                <View style = {{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
                    <Text>Boooooook statusss</Text>
                    <Text>{this.state.bookStatus}</Text>
                </View>
            <TouchableOpacity style = {{borderWidth:1,borderColor:'orange',backgroundColor:"orange",alignSelf:'center',width:300,alignItems:'center',height:30,marginTop:30}}
            onPress = {()=>{
                this.sendNotification()
                this.updateBookRequestStatus()
                this.recievedBooks(this.state.requestedBookName)
            }}>
                <Text>recieve the book!!!!!! i took time to write!!!!</Text>
            </TouchableOpacity>
                </View>
        }
        else{

        
        return(
            <View style = {{flex:1}}>
                <MyHeader title = "request books" navigation = {this.props.navigation}/>
                <KeyboardAvoidingView style = {styles.KeyboardStyle}>
                    <TextInput
                    style = {styles.formTextInput}
                    placeholder = {"enter book name"}
                    onChangeText = {(text)=>{
                        this.setState({
                            bookName:text
                        })
                    }}
                    value = {this.state.bookName}
                    />
                    <TextInput
                    style = {[styles.formTextInput,{height:300}]}
                    multiline
                    numberOfLines = {8}
                    placeholder = {"why you need the book"}
                    onChangeText = {(text)=>{
                        this.setState({
                            reasonToRequest:text
                        })
                    }}
                    value = {this.state.reasonToRequest}
                    />
                    <TouchableOpacity
                    style= {styles.button}
                    onPress = {()=>{this.addRequest(this.state.bookName,this.state.reasonToRequest)}}>
                        <Text>request</Text>
                    </TouchableOpacity>

                </KeyboardAvoidingView>
            </View>
        )
    }
}
}
const styles = StyleSheet.create({
    KeyboardStyle:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
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
        elevation:16,
        

    },
    
})