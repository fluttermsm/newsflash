import React from "react";
import {
    Route,
    Redirect
} from 'react-router-dom';
import * as AdminUserData from '../data/admin_users';

export default class PrivateRoute extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            isAuthenticated: false,
            static_data: {

            }
        }
    }

    componentDidMount() {

        AdminUserData.getUser().then(user => {
            console.log("User: ");
            console.log(user);
            if (user !== null) {
                this.setState({
                    loading: false,
                    isAuthenticated: true,
                });
            } else {
                this.setState({
                    loading: false,
                    isAuthenticated: false,
                });
            }
        });
    }

    render() {
        const {
            component: Component,
            ...rest
        } = this.props
        console.log(this.state.isAuthenticated);
        return ( <
            Route { ...rest
            }
            render = {
                props =>
                this.state.isAuthenticated ? ( <
                    Component { ...props
                    }
                    />
                ) : (
                    this.state.loading ? ( <
                        div > < /div>
                    ) : ( <
                        Redirect to = {
                            {
                                pathname: '/login',
                                state: {
                                    from: this.props.location
                                }
                            }
                        }
                        />
                    )
                )
            }
            />
        )
    }
}