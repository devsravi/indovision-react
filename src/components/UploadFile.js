import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';

export default class UploadFile extends Component{
    constructor(props) {
        super(props)
        this.state = {
            fileName: '',
            getData: [],
            fileUriToView: '',
            setShow: false,
            fileContent: '',
            reponseMessage: '',
            messageStatus: ''
        }

    }
    componentDidMount() {
        this.getDatafromApi();
    }

    getDatafromApi = (e) => {
        axios.get('http://127.0.0.1:8000/api/get-data').then(res => {
           
            if (res.data) {
                this.setState({
                    getData : res.data
                })
            }
        })
    }
    // create function to handle file name
    getFileName = (e) => {
        this.setState({
            fileName: e.target.files[0]
        })
    }

    // submit form to send data in server
    submitForm = (e) => {
        e.preventDefault();
        const apiURL = "http://127.0.0.1:8000/api/upload-and-extract-file";
        const data = new FormData();
        data.append('uploadFileName', this.state.fileName)
        axios.post(apiURL, data).then(response => {
            
            if (response.data.error) {
                this.setState({
                    messageStatus:'danger',
                    reponseMessage: response.data.messages.uploadFileName[0]
                })
            } else {
                this.setState({
                     messageStatus:'success',
                    reponseMessage: response.data.message
                })
                this.getDatafromApi();
            }
            
        })
        
    }

    viewUploadedFile = (e) => {
        const filelink = `http://127.0.0.1:8000/${e.target.getAttribute('data-filelink')}`;
        console.log(filelink);
        if (filelink) {
            window.open(filelink, '_blank');
        }
    }

    handleShow = (e) => { 
        this.setState({
            setShow: true
        })
        this.setState({
            fileContent: e.target.getAttribute('data-content') ? e.target.getAttribute('data-content') : ''
        })

    }
    handleClose = () => this.setState({
                setShow: false
    })
    render(){
        return (
            <>
            <center>
                <Alert key={this.state.messageStatus} variant={this.state.messageStatus}>
                    {this.state.reponseMessage !== '' ? this.state.reponseMessage : this.state.reponseMessage}
                </Alert>
                <h1>Submit Your PDF or Docx</h1>
                    <div className="upload mb-5 m-3">
                        
                        <form className="row" onSubmit={this.submitForm}>
                        <label htmlFor="formFileSm" className="form-label">
                            Select PDF or docx to extract data
                        </label>
                        <div className="form-group mb-5">
                            <input
                            className="form-control"
                            id="formFileSm"
                            type="file"
                            name="uploadFileName"
                            accept=".pdf, .docx"
                            onChange={this.getFileName}           
                            />
                        </div>
                        <div className="form-group">
                            <button className="btn btn-info form-control" type="submit">
                            Submit form
                            </button>
                        </div>
                    </form>
                </div>
                <div className="card mb-4 upload">
                    <div className="card-header text-center">
                        <h2>Show Data</h2>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive-md">
                            
                            <table className="table table-hover">
                                
                                <thead className="mdb-color darken-3">
                                    <tr className="text-white">
                                        <th>#</th>
                                        <th>File</th>
                                        <th>Origin File Name</th>
                                        <th>File extension</th>
                                        <th>Content</th>

                                    </tr>
                                </thead>
                                    <tbody>
                                        {this.state.getData.length > 0 ?
                                            this.state.getData.map((item, index) => (
                                            <tr>
                                                <th scope="row">{index + 1}</th>
                                                <td>
                                                <button
                                                    className="btn btn-info"
                                                    data-filelink={item.filename}   
                                                    rel="noopener noreferrer"
                                                    onClick={this.viewUploadedFile}
                                                    >
                                                    View File
                                                </button>
                                                </td>
                                                <td>{item.orig_filename}</td>
                                                <td>{item.extension}</td>
                                                <td><button
                                                className="btn btn-info"data-content={item.content} onClick={this.handleShow}>View</button></td>
                                            </tr>
                                            )) : null}
                                        
                                </tbody>
                                
                            </table>
                        
                        </div>
                    </div>
                        
                </div>
                    
                
                </center>
                <Modal
                        show={this.state.setShow}
                        onHide={this.handleClose}
                        backdrop="static"
                        keyboard={false}
                        dialogClassName="modal-90w"
                    >
                        <Modal.Header closeButton>
                        <Modal.Title>Uploaded File Content</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {this.state.fileContent !== ''?this.state.fileContent:''}
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="danger" onClick={this.handleClose}>
                            Close
                        </Button>
                        </Modal.Footer>
                    </Modal>
            </>
        );

    }
}


    