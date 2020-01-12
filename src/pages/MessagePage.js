import React from 'react'
import MessageSidebar from '../components/Messages/MessageSidebar/MessageSidebar'
import ChatItem from '../components/Messages/ChatItem/ChatItem'
import AuthContext from '../context/auth-context'



class MessagePage extends React.Component{


    constructor(props){
        super(props)

        this.state = {
            sidebarChats:[],
            currentChatThread:[],
            currentChatName:"",
            currentChatPartnerId:null
        }

        this.chatItem = null
        this.messageInputRef = React.createRef()
    }


    static contextType = AuthContext

    handleChatClick = async(e, partnerId, partnerName) => {

       console.log(partnerId)
       const requestBody = {
            query:`
                query {
                    messages(primaryUserId:"${this.context.userId}", secondaryUserId:"${partnerId}"){
                        message
                        timestamp
                        sender{
                            _id
                            firstname
                        }
                    }
                }
            `        
       }

        const authHeader = "bearer "+this.context.token
        const response = await fetch(process.env.REACT_APP_API_ENDPOINT,{

            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            }
        })

        const resData = await response.json()
        console.log(resData)

        this.setState({
            currentChatThread: resData.data.messages,
            currentChatName : partnerName,
            currentChatPartnerId:partnerId
        })   
    }


    componentDidMount(){

        this.fetchMessageSidebarData()
    
    } 


    fetchMessageSidebarData = async () => {


        const requestBody = {
            query:`
                query { 
                    chats(primaryUserId:"${this.context.userId}"){
                        lastMessage
                        partner{
                            firstname
                            _id
                        }
                    }
                }`
        }

        const authHeader = "bearer "+this.context.token
        const response = await fetch(process.env.REACT_APP_API_ENDPOINT,{

            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            }
        })

        const resData = await response.json()
        console.log(resData)
        this.setState({
            sidebarChats : resData.data.chats,
            
        })
    }


    handleSendMessage = async() => {

        const message = this.messageInputRef.current.value.trim()
        
        console.log(message)

        const requestBody = {
            query:`
                mutation {
                    sendMessage(messageInput: {
                        message:"${message}",
                        timestamp:"${new Date().toLocaleString()}",
                        sender:"${this.context.userId}",
                        reciever:"${this.state.currentChatPartnerId}"        
                    }){
                        message
                        timestamp
                        sender{
                            _id
                            firstname
                        }
                    }
                }`
        }
        
      

        const authHeader = "bearer "+this.context.token
        const response = await fetch(process.env.REACT_APP_API_ENDPOINT,{
            method:"POST",
            body:JSON.stringify(requestBody),
            headers: {
                'Content-Type':'application/json',
                'Authorization': authHeader
            }
        })

        const resData =  await response.json()
        console.log(resData)

        this.messageInputRef.current.value = "" 

        const updatedChatThread = [ ...this.state.currentChatThread ]

        updatedChatThread.push(resData.data.sendMessage)
        console.log(updatedChatThread)

        this.setState({
            currentChatThread : updatedChatThread
        })


    }


    render(){ 



        if(this.state.currentChatThread.length > 0){

            this.chatItems = this.state.currentChatThread.map((chatItem) => {
                console.log(chatItem)
                const right = (chatItem.sender._id === this.context.userId) ? true: false            
                return (
                    <ChatItem key={chatItem.timestamp} right={right} message={chatItem.message} time={chatItem.timestamp}/>
                )
            })
        }
        

        return(
            <div className="message-main">
                <MessageSidebar onChatClick={this.handleChatClick} sidebarChats={this.state.sidebarChats}/>
                <div className="message-centerbar">
                    <h3 id="chat-user-name">{this.state.currentChatName}</h3>
                    <div className="message-box">
                    {this.state.currentChatThread.length>0 ? this.chatItems : null}
                    </div>
                    <div id="message-send-box">
                    <input type="text" placeholder="Type message" ref={this.messageInputRef}/>
                    <button onClick={this.handleSendMessage}>Send</button>
                    </div>
                </div>
            </div>
        )
    }

}


export default MessagePage