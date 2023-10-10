import React, {
    Component
} from 'react';
import Paper from '@material-ui/core/Paper';
import lightBlue from '@material-ui/core/colors/lightBlue';
import {
    apiUrl
} from '../../constants';


class LoginPage extends Component {
    render() {
        return ( <
            div style = {
                {
                    width: '100%'
                }
            } >
            <
            Paper style = {
                {
                    width: 400,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: 200
                }
            } >
            <
            div style = {
                {
                    padding: 5,
                    backgroundColor: lightBlue[500]
                }
            } >
            <
            h2 > News Flash < /h2> <
            /div> <
            div style = {
                {
                    padding: 10,
                    textAlign: 'center'
                }
            } >
            <
            em > Sign in using your bigbluebubble google account. < /em> <
            /div>

            <
            div style = {
                {
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'center'
                }
            } >
            <
            a href = {
                apiUrl + "/auth/google"
            } >
            <
            img alt = "Sign In with Google"
            src = {
                'images/google/btn_google_signin_light_normal_web.png'
            }
            /> <
            /a> <
            /div> <
            /Paper> <
            /div>
        );
    }
}

export default LoginPage;