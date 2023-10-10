import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import IconMenu from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';

import Breadcrumbs from '../common/components/breadcrumbs.js';
import * as AdminUserData from '../data/admin_users.js';

import BaseComponent from '../common/components/BaseComponent.js';
import {
    Col,
    Row
} from '../common/components/grid.js';


const UserMenu = (props) => {
        return ( <
            IconMenu iconButtonElement = { < Avatar style = {
                    {
                        marginTop: 10,
                        cursor: 'pointer'
                    }
                }
                size = {
                    28
                }
                src = {
                    props.image
                }
                />}
                anchorOrigin = {
                    {
                        horizontal: 'left',
                        vertical: 'top'
                    }
                }
                targetOrigin = {
                    {
                        horizontal: 'right',
                        vertical: 'top'
                    }
                } >
                <
                MenuItem key = {
                    1
                }
                onClick = {
                    () => {
                        AdminUserData.logout().then(loggedOut => {
                            window.location = window.location.origin + "/login";
                        });
                    }
                } >
                Logout <
                /MenuItem> <
                /IconMenu>
            );
        }

        const styles = {
            appBar: {
                root: {
                    backgroundColor: "#fff",
                    marginBottom: "0px",
                    zIndex: "99"
                },
                title: {
                    color: '#000',
                    textDecoration: 'none'
                },
                icon: {
                    height: "28px"
                }
            }
        }

        class BasePage extends BaseComponent {
            renderBreadcrumbs = () => {
                    return ( < Breadcrumbs routes = {
                            this.props.routes
                        }
                        params = {
                            this.props.params
                        }
                        />);
                    }

                    renderAppBar = () => {
                        const cachedUser = AdminUserData.getCachedUserInfo();
                        // const iconElementRight = (cachedUser !== false) ? (<UserMenu props={cachedUser} />) : (<div>Not logged in</div>);

                        let iconSrc = (this.state.game) ? this.state.game.IconLocation : "https://s3.amazonaws.com/bbb-ad-mediation/tool/icons/bbb_logo_sm.png";
                        let icon2Src = "https://s3.amazonaws.com/bbb-ad-mediation/tool/icons/newsflash_logo_sm.png";
                        let icon = < img alt = {
                            (this.state.game) ? this.state.game.Title : "Newsflash Home"
                        }
                        style = {
                            styles.appBar.icon
                        }
                        src = {
                            iconSrc
                        }
                        />;
                        return ( <
                            AppBar style = {
                                styles.appBar.root
                            }
                            position = "static" >
                            <
                            Toolbar variant = "dense" > {
                                icon
                            } <
                            a href = "/" > < img alt = {
                                "Newsflash Home"
                            }
                            src = {
                                icon2Src
                            }
                            /></a >
                            <
                            /Toolbar> <
                            /AppBar>
                        )
                        // return (<AppBar
                        //     style={{backgroundColor: "#fff"}}
                        //     iconElementLeft={icon}
                        //     iconElementRight={iconElementRight}
                        //     showMenuIconButton={true}
                        //     title={<a style={{ color: darkBlack, textDecoration: 'none' }}
                        //         href="/">{<img alt={"Newsflash Home"} style={{ height:28, marginTop: 5 }} src={icon2Src} />}</a>} />
                        // );
                    }

                    renderToolbar = (title, actions) => {
                        return ( < Toolbar > { /* <Typography>{title}</Typography> */ } <
                            Row >
                            <
                            Col sm = {
                                9
                            } > {
                                title
                            } <
                            /Col> <
                            Col sm = {
                                3
                            }
                            style = {
                                {
                                    textAlign: "right",
                                    marginTop: "5px"
                                }
                            } > {
                                actions
                            } <
                            /Col> <
                            /Row> <
                            /Toolbar>)
                        }

                        render() {
                            return ( <
                                div >
                                Base Page <
                                /div>
                            );
                        }
                    }

                    BasePage.propTypes = {};

                    export default BasePage;