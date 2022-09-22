import {useEffect, useState} from "react";
import * as docx from "docx";
import { saveAs } from "file-saver";
import { HeadingLevel, Paragraph, Document, TextRun, AlignmentType, SectionType, UnderlineType, Table, TableRow, TableCell, ShadingType, WidthType, convertInchesToTwip, ImageRun} from "docx";
import React from 'react';
import {Button, Divider, Form, Grid, Message, Popup, Radio, Header as SemanticHeader, Icon} from 'semantic-ui-react';
import '../styles/GenerateWordDoc.css'

import {mobileText, webText} from '../components/Constants'
import ImageUploader from "./ImageUploader";

export const GenerateDoc = () => {
    const [asAnOwner, setAsAnOwner] = useState('Business Owner')
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
    // const [scopeMessage, setScopeMessage] = useState('Missing Fields!')
    const [googleAnalytics, setGoogleAnalytics] = useState(false)
    const [universalAnalytics, setUniversalAnalytics] = useState(false)
    const [areChecked, setAreChecked] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageWidth, setImageWidth] = useState(300)
    const [imageHeight, setImageHeight] = useState(350)
    const [isValid, setIsValid] = useState(false)

    const spacing = 200;
    let aTable;
    let googleOrUniversal;
    let image;


    useEffect(() => {
        if(!googleAnalytics & !universalAnalytics){
            setAreChecked(false)
        } else {
            setAreChecked(true)
        }
    },[googleAnalytics, universalAnalytics]);

    const resetStates = () => {
        setAllScopes([])
        setScopeNames([])
        setAsAnOwner('Business Owner')
        setUserInteraction('')
        setUserMeasurement('')
        setFileName('')
        setClientName('')
        setDocTitle('')
        setScopeTitle('')
        setDraftType('Web')
        setDisableDocTitle(false)
        setSelectedImage(null)
        setImageHeight(350)
        setImageWidth(300)
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

    const BulletPoints = [
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
    ]

    const TableMargins = {
        top: convertInchesToTwip(0.05),
        bottom: convertInchesToTwip(0.05),
        left: convertInchesToTwip(0.05),
        right: convertInchesToTwip(0.05)
    }

    if(googleAnalytics && !universalAnalytics){
        googleOrUniversal = [
            new Paragraph('   custom_parameter1: "{{<<DYNAMIC VALUE1>>}}",'),
            new Paragraph('   custom_parameter2: "<<STATIC VALUE2>>",'),
            new Paragraph('   custom_parameter3: "<<STATIC VALUE3>>" // or <<ALTERNATE STATIC VALUE3>>'),
        ]
    } else if(universalAnalytics && !googleAnalytics){
        googleOrUniversal = [
            new Paragraph('   event_category: "<<CATEGORY>>",'),
            new Paragraph('   event_action: "<<ACTION>>"'),
            new Paragraph('   event_label: "<<LABEL>>'),
        ]
        
    } else if(universalAnalytics && googleAnalytics) {
        googleOrUniversal = [
            new Paragraph('   event_category: "<<CATEGORY>>",'),
            new Paragraph('   event_action: "<<ACTION>>"'),
            new Paragraph('   event_label: "<<LABEL>>'),
            new Paragraph('   custom_parameter1: "{{<<DYNAMIC VALUE1>>}}",'),
            new Paragraph('   custom_parameter2: "<<STATIC VALUE2>>",'),
            new Paragraph('   custom_parameter3: "<<STATIC VALUE3>>" // or <<ALTERNATE STATIC VALUE3>>')
        ]
    } else {
        googleOrUniversal = [
            new Paragraph('    PLEASE SELECT GOOGLE OR UNIVERSAL BOX FROM THE FORM!')
        ]
    }

    if(draftType === 'Web'){
        aTable = new Table({
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            shading: {
                                fill: "eeeeee",
                                type: ShadingType.CLEAR,
                                color: "auto",
                            },
                            margins: TableMargins,
                            children: [
                                new Paragraph('dataLayer.push({'),
                                new Paragraph('   event: "<<EVENT NAME>>",'),
                                ...googleOrUniversal,
                                new Paragraph('}); ')
                            ]
                        })
                    ],
                }),
            ],
            width: {
                size: 100,
                type: WidthType.PERCENTAGE
            },
        })
    } else {
        aTable = new Table({
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        shading: {
                            fill: "eeeeee",
                            type: ShadingType.CLEAR,
                            color: "auto",
                        },
                        margins: TableMargins,
                        children: [
                            new Paragraph('mFirebaseAnalytics.logEvent("<<EVENT NAME>>", { '),
                            ...googleOrUniversal,
                            new Paragraph('}); ')
                    ]
                    })
                ],
            }),
        ],
        width: {
            size: 100,
            type: WidthType.PERCENTAGE
        }
        })
    }
    if(selectedImage){
        image = [
            new TextRun({
                text: "ON:  ",
                bold: true
            }),
            new ImageRun({
                data: selectedImage,
                transformation: {
                  width: imageWidth ? imageWidth : 300,
                  height: imageHeight ? imageHeight : 400
                }
            })
        ]
    } else {
        image = [
            new TextRun({text: "ON:  ",bold: true}),
            new TextRun({text: "   No image provided uploaded",})
        ]
    }


    const Scenario = [
        new Paragraph({
            children: [
                new TextRun({
                    text: "SCENARIO:",
                    bold: true,
                })
            ],
            spacing: {before: spacing, after: spacing}
        }),
        new Paragraph({
            children: [...image],
        }),
        new Paragraph({
            children: [
                new TextRun({
                    text: "WHEN:  ",
                    bold: true,
                }),
                new TextRun({
                    text: " A user interacts with the REORDER button",
                })
            ]
        }),
        new Paragraph({
            children: [
                new TextRun({
                    text: "THEN:  ",
                    bold: true,
                }),
                new TextRun({
                    text: "  Push the following data layer code:",
                })
            ],
            spacing: {after: spacing},
        }),
        aTable   
    ]   

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
                ...BulletPoints,
                LineBreak,
                AcceptanceCriteria,
                ...Scenario,
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "References:  ",
                            bold: true,
                        }),
                        new TextRun({
                            text: draftType === 'Web' ? webText : mobileText,
                        })
                    ],
                    spacing: {before: 400, after: 600}
                })
            ]
        }
        setAllScopes(oldArray => [...oldArray, scope]);
        setSelectedImage(null)
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
        resetStates();
        docx.Packer.toBlob(doc).then((blob) => {
        saveAs(blob, `${fileName.slice()}.docx`)
        });


      }
    }

    const selectDraftType = (e, data) => {
        setDraftType(data.value);
    }

    const InputForm = () => {
        return(
            <Grid.Column style={{width:'70rem'}} className="inputForm" >
                <Form onSubmit={checkForEmptyFields}>
                    <Grid columns={2}>
                        <Grid.Row style={{justifyContent: 'center'}}> <h2 >Draft Requirement Word Document Generator!</h2></Grid.Row>
                        <Divider horizontal>
                            <SemanticHeader as='h4'>
                                <Icon name='file word' />
                                {`File Name & Business Requirements`}
                            </SemanticHeader>
                        </Divider>
                        <Grid.Row>
                            {/* UPPER LEFT COL */}
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
                                <Form.Input value={scopeTitle}
                                    maxLength={45}
                                    required 
                                    className="input-labal" 
                                    label={`Scope ${scopeNames.length+1} name:` }
                                    placeholder="Scope Title" 
                                    onChange={(e) => setScopeTitle(e.target.value)} />
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
                            </Grid.Column>

                            {/* UPPER RIGHT COL */}
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
                                <br />
                                
                                <Grid columns={2}>
                                    <Grid.Row >
                                        <Grid.Column width={3} >
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
                                        <Grid.Column width={12}>
                                            <Form.Checkbox
                                                checked={googleAnalytics}
                                                label={<label>Google Analytics 4</label>}
                                                onClick={(e, data) => setGoogleAnalytics(data.checked)}
                                                error={areChecked ? false:{
                                                    content: 'Select one',
                                                    pointing: 'left',
                                                }}
                                            />
                                            <Form.Checkbox
                                                checked={universalAnalytics}
                                                label={<label>Universal Analytics</label>}
                                                onClick={(e, data) => setUniversalAnalytics(data.checked)}
                                                error={areChecked ? false:{
                                                    content: 'Select one',
                                                    pointing: 'left',
                                                }}
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>   
                        <Divider horizontal>
                            <SemanticHeader as='h4'>
                                <Icon name='image' />
                                Select Image and add Scope
                            </SemanticHeader>
                        </Divider>
                        <Grid.Row>
                            {/* LOWER LEFT COL */}
                            <Grid.Column>
                                <div style={{backgroundColor: '#ccc', padding: '15px', borderRadius:'15px', textAlign:'center'}}>
                                    <Form.Group style={{justifyContent: 'center'}}>
                                        <Form.Input maxLength={3} style={{width: '70px'}} size="mini" label={'Width'} value={imageWidth} placeholder={'e.x. 300'} onChange={(e,data) => setImageWidth(data.value)}></Form.Input>
                                        <Form.Input maxLength={3} style={{width: '70px'}} size="mini" label={'Height'} value={imageHeight} placeholder={'e.x. 350'} onChange={(e,data) => setImageHeight(data.value)}></Form.Input>
                                    </Form.Group>
                                    <label>Preivew shows 300px by 350px. Doc will use fields above</label>
                                    <ImageUploader setSelectedImage={setSelectedImage} />
                                    <br />
                                    {selectedImage && <img width={300} height={350} style={{borderRadius:'15px'}} alt="not found"  src={selectedImage} />}
                                </div>
                                <label pointing>Then: Push the following data layer code</label>
                                <br />
                                
                                <Message>
                                    <p> You currrently have <strong>{scopeNames.length}</strong> scopes in this document</p>
                                </Message> 
                            </Grid.Column>

                            {/* LOWER RIGHT COL */}
                            <Grid.Column>
                                <Grid stretched style={{height: '100%'}}>
                                <Grid.Row stretched>
                                        <Grid.Column>
                                            <Message style={{overflowY: 'auto'}}>
                                                <Message.Header> Scenarios you add to the document will appear here</Message.Header>
                                                <Message.List>
                                                    <Message.Item style={{color:'#999'}}>{"Scanerio 1: Some example scenario for button click"}</Message.Item>
                                                    <Message.Item style={{color:'#999'}}>{"Scenario 2: Some other scenario for search field"}</Message.Item>
                                                </Message.List>
                                            </Message>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row stretched>
                                        <Grid.Column>
                                            {scopeNames.length>0 ?
                                                <Message style={{overflowY: 'auto'}}>
                                                    <Message.List>
                                                        {scopeNames.map((scope, id) => {
                                                        return  <Message.Item>{`Scope ${id+1}:  ${scope}`}</Message.Item>
                                                        })}
                                                    </Message.List>
                                                </Message>
                                            :
                                                <Message style={{overflowY: 'auto'}}>
                                                <Message.Header> Scopes you add to the document will appear here</Message.Header>
                                                    <Message.List>
                                                        <Message.Item style={{color:'#999'}}>{"Scope 1: Some example scope for button click"}</Message.Item>
                                                        <Message.Item style={{color:'#999'}}>{"Scope 2: Some other scope for search field"}</Message.Item>
                                                    </Message.List>
                                                </Message>
                                            }
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <br/>
                    <Button color={'teal'} type="button" style={{float:'right'}} onClick={startPDF} >
                        Generate {draftType.toUpperCase()} Word Document
                    </Button>
                    <Button color={'blue'} type="submit" style={{float:'right'}}>Add this Scope</Button>
                    {/* <Popup 
                        content={!isValid ? 'Missing Fields!' : `${scopeTitle} scope added!` }
                        on='click'
                        pinned
                        trigger={<Button color={'blue'} type="submit" style={{float:'right'}}>Add this scope</Button>}
                    /> */}
                    <Popup
                        content={isValid ? 'Missing Fields!' : `${scopeTitle} scope added!` }
                        on='click'
                        pinned
                        trigger={<Button disabled color={'green'}  type="submit" style={{float:'right'}}>{'Add this Scenario (coming soon)'}</Button>}
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
        scopeTitle && scopeTitle.trim() !== '' &&
        (googleAnalytics || universalAnalytics)
        
        if(isValid){
            setIsValid(true)
            // setScopeMessage(`${scopeTitle} scope added!`)
            CreateScope()
            setScopeTitle('')
            setIsValid(true)
        }
    }

    return (
        <div className="container">
            <div className="inputs">
                {InputForm()}              
            </div>
            <br />
            <br />
        </div>
    );
}

