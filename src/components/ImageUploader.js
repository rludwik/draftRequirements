import React from "react";
import { Button } from "semantic-ui-react";

class ImageUploader extends React.Component {
  state = {
    file: null,
    base64URL: ""
  };

  getBase64 = file => {
    return new Promise(resolve => {
      let baseURL = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        baseURL = reader.result;
        this.props.setSelectedImage(baseURL)
        resolve(baseURL);
      };
    });
  };

  handleFileInputChange = e => {
    this.props.setNewImage(true)
    let { file } = this.state;

    file = e.target.files[0];

    this.getBase64(file)
      .then(result => {
        file["base64"] = result;
        this.setState({
          base64URL: result,
          file
        });
      })
      .catch(err => {
        console.log(err);
      });

    this.setState({
      file: e.target.files[0]
    });
  };

  render() {
    return (
      <div>
        <Button
          content="Upload image for scenario"
          labelPosition="left"
          icon="file"
          htmlFor="file" 
          type="button"
          as="label" 
        />
        <input type="file" id="file" style={{ display: "hidden" }} hidden onChange={this.handleFileInputChange} />
      </div>
    );
  }
}

export default ImageUploader;
