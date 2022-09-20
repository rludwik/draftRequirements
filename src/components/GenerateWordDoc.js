import {useState} from "react";
import * as docx from "docx";
import { saveAs } from "file-saver";
import { HeadingLevel, Paragraph, Document, TextRun, AlignmentType, SectionType, UnderlineType} from "docx";
import React from 'react';
import {Button, Form, Grid, Input, Radio} from 'semantic-ui-react';
import '../styles/GenerateWordDoc.css'

const GenerateDoc = () => {
    const [fileName, setFileName] = useState('WordDoc')
    const [clientName, setClientName] = useState('No Client')
    const [docTitle, setDocTitle] = useState('')
    const [draftType, setDraftType] = React.useState('')

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

    const body =  new Paragraph({
        children: [
        new TextRun(`As a`),
        new TextRun({
            text: "Foo Bar",
            bold: false,

        }),
        new TextRun({
            text: "\tGithub is the best",
            bold: true,
        }),
        ],
    })

    const startPDF = () => {
        setFileName('NewWordDoc')
        const doc = new Document({
        sections: [
            {
            properties: {type: SectionType.CONTINUOUS},
            children: [Title]
            },
            {
            properties: {type: SectionType.CONTINUOUS},
            children: [Header, body]
            }, 
            // {
            //   properties: {type: SectionType.CONTINUOUS},
            //   children: [Header,body]
            // }
        ],
        });  
        
        docx.Packer.toBlob(doc).then((blob) => {
        saveAs(blob, `${fileName}.docx`)
        });
    }

    const selectDraftType = (e, data) => {
        const isChecked = data.checked
        setDraftType(data.value)
        console.log(e)
        console.log(data.value, isChecked)
    }

    const form = () => {
        return(
            <Grid.Column className="inputForm" >
                <Form onSubmit={startPDF}>
                    <Grid columns={2}>
                        <Grid.Row>
                            <Grid.Column width={11}>
                            <Input className="input-labal" label="Title" placeholder="Title or word document " onChange={(e) => setDocTitle(e.target.value)} />
                                <br />
                                <br />
                                <Input className="input-labal" label="Client" placeholder="Arby's, UHC, etc. " onChange={(e) => setClientName(e.target.value)} />
                                <br/>
                                <br/>
                            
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Radio
                                    label='App'
                                    name='radioGroup'
                                    value='App'
                                    checked={draftType === 'App'}
                                    onChange={selectDraftType}
                                />
                                <br/>
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
                <Grid columns={3}>
                    <Grid.Row>
                    <Grid.Column></Grid.Column>
                    {form()}
                    <Grid.Column></Grid.Column>
                    </Grid.Row>
                </Grid>
                
            </div>
        </div>
    );
}

export default GenerateDoc;
