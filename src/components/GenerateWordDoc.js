import {useState} from "react";
import * as docx from "docx";
import { saveAs } from "file-saver";
import { HeadingLevel, Paragraph, Document, TextRun, AlignmentType, SectionType, UnderlineType} from "docx";
import React from 'react';
import {Button, Form, Grid, Radio} from 'semantic-ui-react';
import '../styles/GenerateWordDoc.css'

const GenerateDoc = () => {
    const spacing = 200;
    const [asAnOwner, setAsAnOwner] = useState('')
    const [userInteraction, setUserInteraction] = useState('')
    const [userMeasurement, setUserMeasurement] = useState('')
    const [fileName, setFileName] = useState('')
    const [clientName, setClientName] = useState('')
    const [docTitle, setDocTitle] = useState('')
    const [draftType, setDraftType] = useState('Web')
    
    const resetStates = () => {
        setAsAnOwner('')
        setUserInteraction('')
        setUserMeasurement('')
        setFileName('')
        setClientName('')
        setDocTitle('')
        setDraftType('Web')
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
        text: `Scope: ${draftType} - ${docTitle}`,
        heading: HeadingLevel.HEADING_2,
    });

    const startPDF = () => {
        resetStates()
        const doc = new Document({
        sections: [
            {
                properties: {type: SectionType.CONTINUOUS},
                children: [Title]
            },
            {
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
                    new Paragraph({
                        spacing: {before: 100},
                        thematicBreak: true,
                    }),
                ]
            }, 
            // {
            //   properties: {type: SectionType.CONTINUOUS},
            //   children: [Header,body]
            // }
        ],
        });  
        
        docx.Packer.toBlob(doc).then((blob) => {
        saveAs(blob, `${fileName.slice()}.docx`)
        });
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
                                    value={docTitle}
                                    maxLength={45}
                                    required 
                                    className="input-labal" 
                                    label="Word Document Title" 
                                    placeholder="Title for word document " 
                                    onChange={(e) => setDocTitle(e.target.value)} 
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
                            </Grid.Column>
                            <Grid.Column width={8}>
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
                </Form>
            </Grid.Column>
        )
    }

    return (
        <div className="container">
            <div className="inputs">
                {form()}                
            </div>
        </div>
    );
}

export default GenerateDoc;
