import React from 'react';
import { Alert } from 'react-bootstrap';

const Message = ({variant, children}) => { //variant is the type of message (success, danger, warning, info)
  return <Alert variant={variant}>{children}</Alert>; 
}

Message.defaultProps = { //if variant is not passed in, it will default to info
  variant: 'info' 
}

export default Message;