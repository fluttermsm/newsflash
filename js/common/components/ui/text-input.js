import React, {
    Component
} from 'react';
import TextField from '@material-ui/core/TextField';

class TextInput extends Component {
    render() {
        return ( <
            TextField { ...this.props
            }
            />
        );
    }
}

export default TextInput;