import React, {
    Component
} from 'react';
import TextField from '@material-ui/core/TextField';

class NumberInput extends Component {
    render() {
        return ( <
            div >
            <
            TextField type = "number" { ...this.props
            }
            /> <
            /div>
        );
    }
}

export default NumberInput;