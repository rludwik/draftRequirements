import React from 'react'
import {Header as SemanticHeader, Icon, Divider} from 'semantic-ui-react'

const CustomDivider = (props) => {
    console.log(props)
  return (
    <Divider horizontal>
        <SemanticHeader as='h4'>
            {props.icon ? <Icon name={props.icon} /> : <></>}
            {props.title}
        </SemanticHeader>
    </Divider>
  )
}

export default CustomDivider;
