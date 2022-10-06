import {useState, useEffect} from "react";
import * as docx from "docx";
import { saveAs } from "file-saver";
import { HeadingLevel, Paragraph, Document, TextRun, AlignmentType, SectionType, UnderlineType, Table, TableRow, TableCell, ShadingType, WidthType, convertInchesToTwip, ImageRun} from "docx";
import React from 'react';
import {Button, Form, Grid, Message, Radio} from 'semantic-ui-react';
import '../styles/GenerateWordDoc.css'

import CustomDivider from '../components/Divider'
import {mobileText, webText} from '../components/Constants'
import ImageUploader from "./ImageUploader";


export const GenerateDoc = () => {
    const defaultString = 'test';
    const [newImage, setNewImage] = useState(false)
    const [allScopes, setAllScopes] = useState([]);
    const [scopeNames, setScopeNames] = useState([]);
    const [draftType, setDraftType] = useState('Web');
    const [imageWidth, setImageWidth] = useState(300);
    const [areChecked, setAreChecked] = useState(false);
    const [imageHeight, setImageHeight] = useState(350);
    const [allScenarios, setAllScenarios] = useState([]);
    const [scenarioCount, setScenarioCount] = useState(1);
    const [onInput, setOnInput] = useState(defaultString);
    const [fileName, setFileName] = useState(defaultString);
    const [docTitle, setDocTitle] = useState(defaultString);
    const [selectedImage, setSelectedImage] = useState(null);
    const [whenInput, setWhenInput] = useState(defaultString);
    const [clientName, setClientName] = useState(defaultString);
    const [scopeTitle, setScopeTitle] = useState(defaultString);
    const [asAnOwner, setAsAnOwner] = useState('Business Owner');
    const [googleAnalytics, setGoogleAnalytics] = useState(false);
    const [disableDocTitle, setDisableDocTitle] = useState(false);
    const [universalAnalytics, setUniversalAnalytics] = useState(false);
    const [scopeButtonDisabled, setScopeButtonDisabled] = useState(true);
    const [userInteraction, setUserInteraction] = useState(defaultString);
    const [userMeasurement, setUserMeasurement] = useState(defaultString);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
    
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
        setScopeButtonDisabled(true)
        setScopeButtonDisabled(true)
        setNewImage(false)
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

    const Conditions = [
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
                    text: `${userMeasurement}`,
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
                    text: `${userInteraction}`,
                }),
            ],
            spacing: {before: spacing},
        })
    ]

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

    const References = new Paragraph({
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

    if(selectedImage && newImage){
        image = [
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
            new TextRun({text: "   --- No image provided ---",})
        ]
    }

    const CreateScope = () => {
        setScopeNames(oldArray => [...oldArray, scopeTitle]);
        const scope = {
            properties: {type: SectionType.CONTINUOUS},
            children: [
                Header,
                ...Conditions,
                LineBreak,
                Assumptions,
                ...BulletPoints,
                LineBreak,
                AcceptanceCriteria,
                ...allScenarios,
                References
            ]
        }
        setAllScopes(oldArray => [...oldArray, scope]);
        setSelectedImage(null)
        setNewImage(false)
        setAllScenarios([])
    }

    const CreateScenario = () => {
        let isValid =  docTitle && docTitle.trim() !== '' &&
        clientName && clientName.trim() !== '' &&
        fileName && fileName.trim() !== '' &&
        scopeTitle && scopeTitle.trim() !== '' &&
        asAnOwner && asAnOwner.trim() !== '' &&
        userInteraction && userInteraction.trim() !== '' &&
        userMeasurement && userMeasurement.trim() !== '' &&
        onInput && onInput.trim() !== '' &&
        whenInput && whenInput.trim() !== '' && (googleAnalytics || universalAnalytics);

        if(isValid){
            const scenario = [
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `SCENARIO ${scenarioCount}:`,
                            bold: true,
                        })
                    ],
                    spacing: {after: spacing}
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "ON:  ",
                            bold: true,
                        }),
                        new TextRun({
                            text: onInput,
                        }),
                    ],
                    spacing: {before: spacing}
                }),
                new Paragraph({
                    children: [...image],
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "When:  ",
                            bold: true,
                        }),
                        new TextRun({
                            text: whenInput,
                            }),
                    ],
                    spacing: {before: spacing}
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Then push the following data layer code:",
                        })
                    ],
                    spacing: {before: spacing}
                }),
                aTable,
                new Paragraph({
                    spacing: {after: 400}
                }),
            ]
            setOnInput(defaultString)
            setWhenInput(defaultString)
            setGoogleAnalytics(false)
            setUniversalAnalytics(false)
            setScenarioCount(scenarioCount + 1)
            setScopeButtonDisabled(false)
            setDisableDocTitle(true)
            setAllScenarios(oldArray => [...oldArray, ...scenario])
            alert(`Scenario ${scenarioCount} added to Scope ${scopeNames.length +1}`)
            setSelectedImage(null)
            setNewImage(false)
        } else {
            alert('Some fields are still empty!')
        }
        
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
          setTimeout(() => {
            window.location.reload(false);
          }, "2000")
        }
    }

    const selectDraftType = (e, data) => {
        setDraftType(data.value);
    }

    const InputForm = () => {
        return(
            <Grid.Column style={{width: '70em', maxWidth:'80%'}} className="inputForm" >
                <Form onSubmit={CreateScenario}>
                    <Grid>
                        <Grid.Row style={{justifyContent: 'center'}}> <h2 >Draft Requirement Word Document Generator!</h2></Grid.Row>
                        <CustomDivider icon={'file word'} title={'File and Client Information'} />
                        <Grid.Row style={{justifyContent: 'center', marginBottom: '3rem'}}>
                            <Form.Group widths={'equal'}>
                                <Form.Input disabled={disableDocTitle} value={docTitle} maxLength={45} required className="input-labal" label="Word Document Title" placeholder="Recent Orders Authenticated SA-999" onChange={(e) => setDocTitle(e.target.value)} />
                                <Form.Input disabled={disableDocTitle} value={clientName} maxLength={45} required className="input-labal" label="Client" placeholder="Arby's, UHC, etc." onChange={(e) => setClientName(e.target.value)}/>
                                <Form.Input disabled={disableDocTitle} maxLength={50} required label={fileName.length === 0 ? "Desired File Name" : `File: "${fileName}.docx"`} labelPosition='right' placeholder='Enter desired file name' className="input-labal" value={fileName} onChange={(e, data) => (setFileName(data.value))} />                              
                            </Form.Group>
                            <Form.Group grouped style={{paddingLeft: '1rem'}}>
                            <label>Platform Type</label>
                            <Form.Field disabled={disableDocTitle} control={Radio} label='App' value='App' checked={draftType === 'App'} onChange={selectDraftType} />
                            <Form.Field disabled={disableDocTitle} control={Radio} label='Web' value='Web' checked={draftType === 'Web'} onChange={selectDraftType} />
                            </Form.Group>
                        </Grid.Row>
                        <CustomDivider title={`Business Requirements for Scope ${scopeNames.length+1} `} />
                        <Grid.Row style={{justifyContent: 'center', marginBottom: '3rem'}}>
                            <Form.Group widths={'equal'}>
                                <Form.Input value={scopeTitle} maxLength={45} required className="input-labal" label={`Scope ${scopeNames.length+1} name:` } placeholder="Scope Title" onChange={(e) => setScopeTitle(e.target.value)} />
                                <Form.Input placeholder="Business Owner" value={asAnOwner} maxLength={45} required className="input-labal" label="As a:" onChange={(e) => setAsAnOwner(e.target.value)} />
                                <Form.Input label="I Want to:" value={userMeasurement} maxLength={100} required className="input-labal" placeholder='"measure Engagement with the reorder button on the orders screen"' onChange={(e) => setUserMeasurement(e.target.value)} />
                                <Form.Input label="So that I can:" value={userInteraction} maxLength={100} required className="input-labal" placeholder='"measure user interaction with the reorder button on the orders screen"' onChange={(e) => setUserInteraction(e.target.value)} />
                            </Form.Group>
                        </Grid.Row>

                        <CustomDivider icon={'image'} title={`Select Image and info for Scope ${scopeNames.length+1} - Scenario ${scenarioCount}`} />
                        <Grid.Row style={{justifyContent: 'center'}}>
                            <Form.Group style={{margin: '15px'}} grouped>
                                    <ImageUploader setSelectedImage={setSelectedImage} setNewImage={setNewImage}/>
                                    <Form.Input label="ON:" placeholder='the home page' value={onInput} maxLength={45} required className="input-labal" onChange={(e) => setOnInput(e.target.value)} />
                                    <Form.Input label="WHEN:" placeholder='a user clicks the order button' value={whenInput} maxLength={100} required className="input-labal" onChange={(e) => setWhenInput(e.target.value)} />
                                    <label>THEN: Push the folowing data layer code</label>
                                    <Form.Checkbox checked={googleAnalytics} label={<label>Google Analytics 4</label>}onClick={(e, data) => setGoogleAnalytics(data.checked)} error={areChecked ? false:{content: 'Select one',pointing: 'left'}}/>
                                    <Form.Checkbox checked={universalAnalytics} label={<label>Universal Analytics</label>} onClick={(e, data) => setUniversalAnalytics(data.checked)} error={areChecked ? false:{content: 'Select one',pointing: 'left'}}/>
                                    
                                    {draftType === "Web" && <Message>
                                    <p style={{margin: '0px'}}> {`dataLayer.push({`}</p>
                                    <p style={{margin: '0px', paddingLeft:'2rem'}}> {`event_name: "<<EVENT NAME>>",`}</p>
                                    { universalAnalytics && <>
                                    <p style={{margin: '0px', paddingLeft:'2rem'}}> {`CATEGORY: "<<CATEGORY>>",`}</p>
                                    <p style={{margin: '0px', paddingLeft:'2rem'}}> {`ACTION: "<<ACTION>>",`}</p>
                                    <p style={{margin: '0px', paddingLeft:'2rem'}}> {`LABEL: "<<LABEL>>",`}</p>
                                    </>}
                                    <p style={{margin: '0px', paddingLeft:'2rem'}}> {`custom_parameter: "{{DYNAMIC VALUE}}",`}</p>
                                    <p style={{margin: '0px', paddingLeft:'2rem'}}> {`custom_parameter: "<<STATIC VALUE>>"`}</p>
                                    <p style={{margin: '0px'}}> {`})`}</p>
                                </Message>}
                                {draftType === "App" &&<Message>
                                    <p style={{margin: '0px'}}> {`mFirebaseAnalytics.logEvent("<<EVENT NAME>>", {`}</p>
                                    { universalAnalytics && <>
                                    <p style={{margin: '0px', paddingLeft:'2rem'}}> {`CATEGORY: "<<CATEGORY>>",`}</p>
                                    <p style={{margin: '0px', paddingLeft:'2rem'}}> {`ACTION: "<<ACTION>>",`}</p>
                                    <p style={{margin: '0px', paddingLeft:'2rem'}}> {`LABEL: "<<LABEL>>",`}</p>
                                    </>}
                                    <p style={{margin: '0px', paddingLeft:'2rem'}}> {`custom_parameter: "{{DYNAMIC VALUE}}",`}</p>
                                    <p style={{margin: '0px', paddingLeft:'2rem'}}> {`custom_parameter: "<<STATIC VALUE>>",`}</p>
                                    <p style={{margin: '0px'}}> {`})`}</p>
                                </Message>}
                            </Form.Group>
                            <Form.Group style={{margin: '15px'}}>
                                <div style={{backgroundColor:'#ddd', width:'325px', height:'375px', borderRadius: '25px', padding: '13px'}}>
                                    {selectedImage ?
                                        <img width={300} height={350} style={{borderRadius:'15px'}} alt="not found"  src={selectedImage} />
                                     :
                                     <h3>Selected image will preview here</h3>
                                     }
                                </div>
                            </Form.Group>
                        </Grid.Row>
                    </Grid>
                    <br/>   
                    <Button onClick={CreateScenario} color={'green'}  type="button" >{`Add Scenario ${scenarioCount} ${newImage ? '': 'WITHOUT AN IMAGE'}` }</Button>
                    <label></label>
                </Form>
                <br />
                <br />
                <Button disabled={scopeButtonDisabled} color={'blue'} type="button"  onClick={checkForEmptyFields}>{`Add Scope ${scopeNames.length+1} with ${scenarioCount-1} scenarios`}</Button>
                <Message>
                <p> You currrently have <strong>{scopeNames.length}</strong> scopes in this document</p>
                </Message>
                <Button disabled={submitButtonDisabled} style={{float:'right'}} color={'teal'} type="button"  onClick={startPDF} >
                        Generate {draftType.toUpperCase()} Word Document
                    </Button>
                    
            </Grid.Column>
        )
    }

    const checkForEmptyFields = () => {
        let isValid =  docTitle && docTitle.trim() !== '' &&
        clientName && clientName.trim() !== '' &&
        fileName && fileName.trim() !== '' &&
        scopeTitle && scopeTitle.trim() !== '' &&
        asAnOwner && asAnOwner.trim() !== '' &&
        userInteraction && userInteraction.trim() !== '' &&
        userMeasurement && userMeasurement.trim() !== ''

        if(isValid){
            setScenarioCount(1)
            setSubmitButtonDisabled(false)
            CreateScope()
            setScopeTitle('')
        } else {
            alert('Some fields are still empty!')
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

