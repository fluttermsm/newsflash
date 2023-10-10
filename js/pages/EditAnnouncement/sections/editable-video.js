import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';;
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/icons/';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import YouTubeIcon from '@material-ui/icons/YouTube';
import MovieIcon from '@material-ui/icons/Movie';

import YouTube from 'react-youtube';

import TextField from '@material-ui/core/TextField';

class EditableVideo extends Component {
    handleToggle = (event, enabled) => {
        if (enabled) {
            this.props.onChange({
                NativeVideo: {
                    url: '',
                    autoplay: true,
                    ui: false
                }
            });
        } else {
            this.props.onChange({
                NativeVideo: null
            });
        }
    }

    handleUrlChange = (event) => {
        this.props.onChange({
            NativeVideo: Object.assign({}, this.props, {
                url: event.target.value
            })
        });
    }

    handleAutoplayChange = (event, enabled) => {
        this.props.onChange({
            NativeVideo: Object.assign({}, this.props, {
                autoplay: enabled
            })
        });
    }

    isValidUrl = () => {
        return true;
    }

    handleVideoReady = (event) => {
        event.target.pauseVideo();
    }

    isEnabled = () => {
        return this.props.hasOwnProperty('url');
    }

    getVideoIDFromURL = (url) => {
        var params = this.parseURL(url);
        return params.v;
    }

    parseURL = (url) => {
        const qstr = url.indexOf("?") > -1 ? url.split("?")[1] : url;
        var query = {};
        var a = (qstr[0] === '?' ? qstr.substr(1) : qstr).split('&');
        for (var i = 0; i < a.length; i++) {
            var b = a[i].split('=');
            query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
        }
        return query;
    }

    render() {
            const enabled = this.props.hasOwnProperty("url");
            return ( <
                Card >
                <
                CardHeader title = {
                    "Announcement Video"
                }
                subheader = {
                    "Embedded Youtube Video"
                }
                avatar = { < Avatar > < MovieIcon / > < /Avatar>} /
                    >
                    <
                    FormControlLabel
                    control = { <
                        Switch
                        checked = {
                            enabled
                        }
                        onChange = {
                            this.handleToggle
                        }
                        />
                    }
                    label = "Enable Video" /
                    >
                    <
                    CardContent > {
                        (enabled) ? ( <
                            div style = {
                                {
                                    position: 'relative'
                                }
                            } >
                            <
                            div style = {
                                {
                                    position: 'relative',
                                    float: 'left',
                                    width: 260,
                                    marginLeft: "20px"
                                }
                            } > {
                                this.renderVideoSettings()
                            } <
                            /div> <
                            div style = {
                                {
                                    position: 'relative',
                                    marginLeft: 280
                                }
                            } > {
                                this.renderVideo(this.props.url)
                            } <
                            /div> <
                            /div>
                        ) : "No Video"
                    } <
                    /CardContent> <
                    /Card>

                );
            }

            renderVideoSettings = () => {
                if (this.isEnabled()) {
                    return ( <
                        div >
                        <
                        TextField label = "Youtube URL"
                        value = {
                            this.props.url
                        }
                        onChange = {
                            this.handleUrlChange
                        }
                        onBlur = {
                            this.handleUrlBlur
                        }
                        />                     <
                        FormControlLabel control = { <
                            Checkbox
                            checked = {
                                this.props.autoplay
                            }
                            onChange = {
                                this.handleAutoplayChange
                            }
                            color = "primary" /
                            >
                        }
                        label = "Autoplay" /
                        >
                        <
                        /div>
                    )
                }

            }

            renderVideo = () => {
                if (this.isEnabled()) {
                    const opts = {
                        height: '280',
                        width: '460',
                        playerVars: { // https://developers.google.com/youtube/player_parameters 
                            autoplay: 1
                        }
                    };
                    return ( < YouTube videoId = {
                            this.getVideoIDFromURL(this.props.url)
                        }
                        opts = {
                            opts
                        }
                        onReady = {
                            this.handleVideoReady
                        }
                        />)
                    }
                }
            }

            EditableVideo.propTypes = {
                onChange: PropTypes.func.isRequired
            };

            export default EditableVideo;