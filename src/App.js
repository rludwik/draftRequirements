import React, {useState} from "react";
import * as docx from "docx";
import { saveAs } from "file-saver";
import { HeadingLevel, Paragraph, Document, TextRun, AlignmentType, SectionType, UnderlineType} from "docx";

function App() {
  const [fileName, setFileName] = useState('WordDoc')

  const Title =  new Paragraph({
    children: [
      new TextRun({
        text: "AC: App :: Arby's : Recent Orders on the Main Page for Authenticated",
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
    text: "Scope: App - Order History Reorder same order",
    heading: HeadingLevel.HEADING_2,
  });

  const body =  new Paragraph({
    children: [
      new TextRun("Hello World"),
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

  return (
    <div className="App">
      <button onClick={() => startPDF()}>Generate Word Document</button>
    </div>
  );
}

export default App;
