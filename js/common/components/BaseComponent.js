import React, {
    Component
} from 'react';
import {
    loadCSS
} from 'fg-loadcss/src/loadCSS';

class componentName extends Component {
    componentDidMount() {
        loadCSS(
            'https://use.fontawesome.com/releases/v5.1.0/css/all.css',
            document.querySelector('#insertion-point-jss'),
        );
    }

    addUserMessage = (message) => {
        let msgsRaw = window.localStorage.getItem("user_notifications");
        let msgs = [];
        if (msgsRaw !== null) {
            try {
                msgs = JSON.parse(msgsRaw);
            } catch (e) {
                console.log(e);
            }
        }

        msgs.push(message);
        window.localStorage.setItem("user_notifications", JSON.stringify(msgs));
    }

    render() {
        return ( <
            div >
            Base Component <
            /div>
        );
    }
}

export default componentName;