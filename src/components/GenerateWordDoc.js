import {useState} from "react";
import * as docx from "docx";
import { saveAs } from "file-saver";
import { HeadingLevel, Paragraph, Document, TextRun, AlignmentType, SectionType, UnderlineType} from "docx";
import React from 'react';
import {Button, Form, Grid, Message, Popup, Radio} from 'semantic-ui-react';
import '../styles/GenerateWordDoc.css'

export const GenerateDoc = () => {
    const spacing = 200;
    const [asAnOwner, setAsAnOwner] = useState('')
    const [userInteraction, setUserInteraction] = useState('')
    const [userMeasurement, setUserMeasurement] = useState('')
    const [fileName, setFileName] = useState('')
    const [clientName, setClientName] = useState('')
    const [docTitle, setDocTitle] = useState('')
    const [scopeTitle, setScopeTitle] = useState('')
    const [draftType, setDraftType] = useState('Web')
    const [allScopes, setAllScopes] = useState([]);
    const [scopeNames, setScopeNames] = useState([]);
    const [disableDocTitle, setDisableDocTitle] = useState(false);

    
    const resetStates = () => {
        setAsAnOwner('')
        setUserInteraction('')
        setUserMeasurement('')
        setFileName('')
        setClientName('')
        setDocTitle('')
        scopeTitle('')
        setScopeNames('')
        setDraftType('Web')
        setAllScopes([])
        setScopeNames([])
        setDisableDocTitle(false)
    }

    const Title =  new Paragraph({
        children: [
        new TextRun({
            text: `AC: ${draftType} :: ${clientName} : ${docTitle}`,
            underline: {
                type: UnderlineType.SINGLE,
                color: "000000",
            },
            alignment: AlignmentType.CENTER,
            size: 28
        }),
    
        ],
    })

    const Header = new Paragraph({
        text: `Scope: ${draftType} - ${scopeTitle}`,
        heading: HeadingLevel.HEADING_2,
    });

    const Assumptions = new Paragraph({
        children: [
            new TextRun({
                text: "ASSUMPTIONS: ",
                bold: true,
            })
        ],
    });

    const LineBreak = new Paragraph({
        spacing: {before: 100, after: 100},
        thematicBreak: true,
    });

    const AcceptanceCriteria = new Paragraph({
        children: [
            new TextRun({
                text: "ACCEPTANCE CRITERIA: ",
                bold: true,
            })
        ],
    }); 

    const DocumentTitle = {
        properties: {type: SectionType.CONTINUOUS},
        children: [Title]
    }

    const CreateScope = () => {
        setDisableDocTitle(true)
        setScopeNames(oldArray => [...oldArray, scopeTitle]);
        const scope = {
            properties: {type: SectionType.CONTINUOUS},
            children: [
                Header,
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "AS A:  ",
                            bold: true,
                        }),
                        new TextRun({
                            text: asAnOwner,
                        }),
                    ],
                    spacing: {before: spacing}
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "I WANT TO: ",
                            bold: true,
                        }),
                        new TextRun({
                            text: `Measure engagement with ${userMeasurement}`,
                        }),
                    ],
                    spacing: {before: spacing}
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "SO THAT:  ",
                            bold: true,
                        }),
                        new TextRun({
                            text: `I can understand user's interaction with ${userInteraction}`,
                        }),
                    ],
                    spacing: {before: spacing},
                }),
                LineBreak,
                Assumptions,
                LineBreak,
                new Paragraph({
                    text: `Ticket is for ${draftType.includes('Web') ? draftType : `Mobile ${draftType}`}`,
                    bullet: {level: 0} //Max level is 9
                }),
                new Paragraph({
                    text: `Visitor is on ${draftType}`,
                    bullet: {level: 0}
                }),
                new Paragraph({
                    text: "Testing will be done by Ovative Analytics Team",
                    bullet: {level: 0}
                }),
                new Paragraph({
                    text: "Values in the provided code",
                    bullet: {level: 0}
                }),
                new Paragraph({
                    text: "If in quotes, indicate static values",
                    bullet: {level: 1}
                }),
                new Paragraph({
                    text: "If in double brackets, indicate dynamic values",
                    bullet: {level: 1}
                }),
                new Paragraph({
                    text: "If in quotes with a commented value, indicate possible static values",
                    bullet: {level: 1}
                }),
                LineBreak,
                AcceptanceCriteria
            ]
        }
        setAllScopes(oldArray => [...oldArray, scope]);

    }
    
    const startPDF = () => {
      if(allScopes.length === 0 || scopeNames.llength === 0){
        alert("Must submit at least 1 scope to generate a document")
      } else {
        const doc = new Document({
            sections: [
                // TITLE SECTION
                DocumentTitle,
                // MAIN BODY SECTION
                ...allScopes
            ]
        });  
        
        docx.Packer.toBlob(doc).then((blob) => {
        saveAs(blob, `${fileName.slice()}.docx`)
        });

        resetStates()

      }
    }

    const selectDraftType = (e, data) => {
        setDraftType(data.value);
    }

    const form = () => {
        return(
            <Grid.Column style={{width:'70rem'}} className="inputForm" >
                <Form onSubmit={startPDF}>
                    <Grid columns={2}>
                        <Grid.Row style={{justifyContent: 'center'}}> <h2 >Draft Requirement Word Document Generator!</h2></Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={8}>
                            <Form.Input
                                    disabled={disableDocTitle}
                                    value={docTitle}
                                    maxLength={45}
                                    required 
                                    className="input-labal" 
                                    label="Word Document Title" 
                                    placeholder="Recent Orders Authenticated SA-999" 
                                    onChange={(e) => setDocTitle(e.target.value)} 
                                />
                                <Form.Input
                                    value={scopeTitle}
                                    maxLength={45}
                                    required 
                                    className="input-labal" 
                                    label="Scope" 
                                    placeholder="Scope Title" 
                                    onChange={(e) => setScopeTitle(e.target.value)} 
                                />
                                <Form.Input 
                                    value={clientName}
                                    maxLength={45}
                                    required
                                    className="input-labal" 
                                    label="Client" 
                                    placeholder="Arby's, UHC, etc." 
                                    onChange={(e) => setClientName(e.target.value)}
                                />
                                <Form.Input
                                    maxLength={50}
                                    required
                                    label={fileName.length === 0 ? "Desired File Name" : `File: "${fileName}.docx"`}
                                    labelPosition='right'
                                    placeholder='Enter desired file name'
                                    className="input-labal"
                                    value={fileName}
                                    onChange={(e, data) => (setFileName(data.value))}
                                />
                                
                                <Message>
                                    <p> You currrently have <strong>{scopeNames.length}</strong> scopes in this document</p>
                                </Message>
                                {scopeNames.length>0 && <Message style={{overflowY: 'auto'}}>
                                    <Message.List>
                                        {scopeNames.map((scope, id) => {
                                           return  <Message.Item>{`Scope ${id+1}:  ${scope}`}</Message.Item>
                                        })}
                                    </Message.List>
                                </Message>}
                                
                            </Grid.Column>
                            <Grid.Column width={8}>
                            <Form.Input 
                                    value={asAnOwner}
                                    maxLength={30}
                                    required
                                    className="input-labal" 
                                    label="As a:" 
                                    placeholder="Business Owner" 
                                    onChange={(e) => setAsAnOwner(e.target.value)}
                                />
                                <Form.Input 
                                    value={userMeasurement}
                                    maxLength={45}
                                    required
                                    className="input-labal" 
                                    label="I Want to Measure Engagement with:" 
                                    placeholder='"The reorder button on the orders screen"' 
                                    onChange={(e) => setUserMeasurement(e.target.value)}
                                />
                                <Form.Input 
                                    value={userInteraction}
                                    maxLength={45}
                                    required
                                    className="input-labal" 
                                    label="So that I can understand user interaction with:" 
                                    placeholder='"The reorder button on the orders screen"' 
                                    onChange={(e) => setUserInteraction(e.target.value)}
                                />
                                <br />
                                <Radio
                                    label='App'
                                    name='radioGroup'
                                    value='App'
                                    checked={draftType === 'App'}
                                    onChange={selectDraftType}
                                />
                                <br />
                                <Radio
                                    label='Web'
                                    name='radioGroup'
                                    value='Web'
                                    checked={draftType === 'Web'}
                                    onChange={selectDraftType}
                                />
                               
                            </Grid.Column>
                        </Grid.Row>    
                    </Grid>
                   
                    <Button type="submit" style={{float:'right'}} >
                        Generate {draftType.toUpperCase()} Word Document
                    </Button>
                    <Popup
                        content={`"${scopeTitle}" scope added!`}
                        on='click'
                        pinned
                        trigger={<Button type="button" style={{float:'right'}} onClick={checkForEmptyFields} >
                        Add this scope
                    </Button>}
                    />
                    
                </Form>
            </Grid.Column>
        )
    }

    const checkForEmptyFields = () => {
        let isValid = asAnOwner && asAnOwner.trim() !== '' &&
        userInteraction && userInteraction.trim() !== '' &&
        userMeasurement && userMeasurement.trim() !== '' &&
        fileName && fileName.trim() !== '' &&
        clientName && clientName.trim() !== '' &&
        docTitle && docTitle.trim() !== '' &&
        scopeTitle && scopeTitle.trim() !== ''

        if(isValid){
            CreateScope()
        }else{
            alert('All fields are required!')
        }
    }

    return (
        <div className="container">
            <div className="inputs">
                {form()}                
            </div>
        </div>
    );
}

