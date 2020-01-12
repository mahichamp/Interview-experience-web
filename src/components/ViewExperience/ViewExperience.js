import React from 'react'
import AuthContext from '../../context/auth-context'
import MessageModal from '../Modal/MessageModal/MessageModal'
import Backdrop from '../Backdrop/Backdrop'
import FloatingButton from '../FloatingButton/FloatingButton'
import './ViewExperience.css'
const jsPDF = require('jspdf')
const html2canvas = require('html2canvas')



class ViewExperience extends React.Component{


    constructor(props) {
        super(props)

        this.state = {
            modalEnabled: false,
            viewData : {
                title: "Default",
                company:"Default",
                content:"Default",
                creator_name:"",
                expUserId:null
            },
           
        }

        this.messageRef = React.createRef();
    }


    static contextType = AuthContext

    componentDidMount(){
            this.handleViewExperienceClick()
    }


    handleViewExperienceClick = async() => {

        const requestBody = {
            query: `
                query {
                    experiences(expId:"${this.props.viewExpId}"){
                        _id
                        title
                        company
                        date
                        profile
                        content
                        creator{
                            _id
                            firstname
                        }
                    }
                }
            `
            }

    try{

        const response = await fetch(process.env.REACT_APP_API_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers:{
                'Content-Type':'application/json'
            }

        })

        if(response.status !== 200 && response.status !== 201){
                throw new Error('Failed')
        }

        const resData  = await response.json()
        const exp = resData.data.experiences[0]
        console.log(exp)
        this.setState({
            viewData: {
                title: exp.title,
                company:exp.company,
                content:exp.content,
                creator_name :exp.creator.firstname,
                expUserId: exp.creator._id
            },
            
        })
    }
    catch(err){
        console.log(err)
    }
}


     //Handle download button
     handleViewExperienceSave = () => {
        // save pdf logic/

        console.log("save pdf")
        const filename  = 'ThisIsYourPDFFilename.pdf';
		html2canvas(document.querySelector('#view-experience-data'),{scale:1.5}).then(canvas => {
            console.log(canvas)
            const canvasWidth = canvas.width
            const canvasHeight = canvas.height

            const styles = canvas.style.cssText.split(';')
            console.log(styles)
            
            //
            const imageWidth = +styles[0].match(/(\d+)/)[0]
            const imageHeight = +styles[1].match(/(\d+)/)[0]
            
            console.log(imageHeight)
            console.log(imageWidth)



			let pdf = new jsPDF('p', 'px',[canvasWidth,canvasHeight]);
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0,imageWidth,imageHeight);
			pdf.save(filename);
        });
    
    }



    //Send Message
    handleViewExperienceMessage = () => {
        this.setState({
            modalEnabled:true
        })
    }



    sendMessageModalHandler = async(event)  => {

        const eventName = event.target.name
        // if cancel is pressed in modal
        if(eventName === 'cancel'){
                console.log("cancelled")
                this.setState({
                    modalEnabled:false
                })
        }else{
            //Send the message to the user
            console.log(this.messageRef.current.value)
            const message = this.messageRef.current.value.trim()
            
            const requestBody = {
                query:`
                    mutation {
                        sendMessage(messageInput: {
                            message:"${message}",
                            timestamp:"${new Date().toLocaleString()}",
                            sender:"${this.context.userId}",
                            reciever:"${this.state.viewData.expUserId}"        
                        }){
                            message
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
            this.setState({
                modalEnabled:false
            })
        }
       
    }



    
    render(){

       
        const modalDecider = this.state.viewData.expUserId === this.context.userId ? true : false 

        return(
            <div id="view-experience">       
                {this.state.modalEnabled ?<Backdrop/> : null}
                {this.state.modalEnabled ?<MessageModal modalHandler={this.sendMessageModalHandler}
                                            title={"Message to "+this.state.viewData.creator_name}
                                            messageRef={this.messageRef}/> : null}

                <div id="view-experience-data">
                    <div className="experience-head">
                        <h1>{this.state.viewData.title}</h1>
                        <h3>{this.state.viewData.company}</h3>
                        <h3>{this.state.viewData.creator_name}</h3>
                    </div>
                  {/** <textarea spellCheck="false" id="view-exp-content" readonly value={this.state.viewData.content}/>*/}
                  <div id="view-exp-content">{`${this.state.viewData.content}`}</div>
                </div>
                <div className="somethingg">
                <FloatingButton icon="fa-arrow-circle-left" style={modalDecider ?{right:90}:{right:160}} onClick={this.props.onClickBack}/>
                { !modalDecider ? <FloatingButton icon="fa-comments-o" style={{right:90}} onClick={this.handleViewExperienceMessage}/>: null}
                <FloatingButton icon="fa-download"   
                 onClick={this.handleViewExperienceSave}/>
                </div>
            </div>
        )
    }
}



export default ViewExperience