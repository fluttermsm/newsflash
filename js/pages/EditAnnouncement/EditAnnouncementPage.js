import React from 'react';
import {
    withRouter
} from 'react-router-dom';

import Button from '@material-ui/core/Button'; // v1.x
import Typography from '@material-ui/core/Typography';

import BasePage from '../BasePage.js';

import EditablePlacements from './sections/editable-placements.js';
import EditableAnnouncement from './sections/editable-announcement.js';
import EditableIcon from './sections/editable-icon.js';
import EditableVideo from './sections/editable-video.js';
import EditableLanguages from './sections/editable-languages.js';
import EditableSegments from './sections/editable-segments.js';
import EditableExtraData from './sections/editable-extra-data.js';

import * as AnnouncementData from '../../data/announcements.js';
import * as GameData from '../../data/games.js';
import * as AdData from '../../data/ads.js';
import * as PlacementData from '../../data/placements.js';
import Notifications from '../../common/components/notifications.js';
import ErrorDialog from '../../common/components/dialogs/error-dialog.js';
import {
    Row,
    Col
} from '../../common/components/grid.js';


class EditAnnouncementPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, this.props);
    }

    handleAnnouncementChange = (props) => {
        let announcement = Object.assign({}, this.state.announcement);
        this.setState({
            announcement: Object.assign({}, announcement, props)
        });
    }

    handleSaveClick = (event) => {
        this.props.save(this.state.announcement, this.state.ads);
    }

    reloadAds = () => {
        AdData.getAllForAnnouncement(this.state.announcement.GroupID).then(ads => {
            this.setState({
                ads
            });
            this.handleAnnouncementChange({
                Languages: ads.map(ad => {
                    return ad.Language
                })
            });
        });
    }

    removeLanguage = (ad) => {
        // AdData.remove(ad).then(results => {
        //     this.reloadAds();
        // });
    }

    updateLanguageImage = (ad_id, file) => {
        // AdData.updateImage(ad_id, file).then(results => {
        //     this.reloadAds();
        // });
    }

    handleAdsChange = (ads) => {
        this.setState({
            ads: ads
        });
    }

    handleAdChange = (lang, props) => {
        let index = this.state.ads.findIndex(ad => lang === ad.Language);
        if (index > -1) {
            let adsCopy = [].concat(this.state.ads);
            for (var prop in props) {
                if (props.hasOwnProperty(prop)) {
                    adsCopy[index][prop] = props[prop];
                }
            }
            this.setState({
                ads: adsCopy
            });
        }
    }

    render() {
            const {
                Placements
            } = this.state.announcement;
            const {
                game,
                saving
            } = this.props;

            const toolbarActions = [ <
                Button disabled = {
                    saving
                }
                key = {
                    1
                }
                label = {
                    "Save"
                }
                onClick = {
                    this.handleSaveClick
                } > Save < /Button>, <
                Button disabled = {
                    saving
                }
                key = {
                    2
                }
                label = "Cancel"
                onClick = {
                    this.props.onCancel
                } > Cancel < /Button>
            ]
            return ( <
                div > {
                    this.renderToolbar( < Typography variant = "title" > {
                            'Editing "' + this.state.announcement.Title + '" for ' + game.Title
                        } < /Typography>, toolbarActions)} <
                        Row >
                        <
                        Col sm = {
                            6
                        } >
                        <
                        EditableAnnouncement rootStyle = {
                            {
                                minHeight: 367
                            }
                        } { ...this.state.announcement
                        }
                        onChange = {
                            this.handleAnnouncementChange
                        }
                        /> <
                        /Col> <
                        Col sm = {
                            6
                        } >
                        <
                        EditableIcon rootStyle = {
                            {
                                minHeight: 375
                            }
                        }
                        Icon = {
                            this.state.announcement.Icon
                        }
                        GameID = {
                            this.state.announcement.GameID
                        }
                        onChange = {
                            this.handleAnnouncementChange
                        }
                        /> <
                        /Col> <
                        /Row> <
                        Row >
                        <
                        Col sm = {
                            6
                        } >
                        <
                        EditableVideo { ...this.state.announcement.NativeVideo
                        }
                        onChange = {
                            this.handleAnnouncementChange
                        }
                        /> <
                        /Col> <
                        Col sm = {
                            6
                        } >
                        <
                        EditableSegments game_id = {
                            game.GameID
                        }
                        Segments = {
                            this.state.announcement.Segments
                        }
                        onChange = {
                            this.handleAnnouncementChange
                        }
                        /> <
                        /Col> <
                        /Row> <
                        Row >
                        <
                        Col sm = {
                            12
                        } >
                        <
                        EditablePlacements game = {
                            game
                        }
                        Placements = {
                            Placements
                        }
                        placementOptions = {
                            this.props.placements
                        }
                        platformOptions = {
                            game.Platforms
                        }
                        onChange = {
                            this.handleAnnouncementChange
                        }
                        /> <
                        br / >
                        <
                        EditableLanguages ads = {
                            this.state.ads
                        }
                        announcement_id = {
                            this.state.announcement.ID
                        }
                        // addLanguage={this.addLanguage}
                        // removeLanguage={this.removeLanguage}
                        // updateLanguageImage={this.updateLanguageImage}
                        onAdChange = {
                            this.handleAdChange
                        }
                        onAdsChange = {
                            this.handleAdsChange
                        }
                        />                         <
                        /Col> <
                        /Row> <
                        Row >
                        <
                        Col sm = {
                            12
                        } >
                        <
                        EditableExtraData ExtraData = {
                            this.state.announcement.ExtraData
                        }
                        onChange = {
                            this.handleAnnouncementChange
                        }
                        /> <
                        /Col> <
                        /Row>                <
                        /div>
                    );
                }
            }

            withRouter(EditAnnouncementPage);

            class EditAnnouncementPageContainer extends BasePage {
                constructor(props) {
                    super(props);
                    this.state = {
                        params: {},
                        errors: [],
                        saving: false
                    };
                }

                componentDidMount() {
                    const {
                        announcement_id,
                        game_id
                    } = this.props.match.params;
                    this.setState({
                        params: this.props.match.params
                    });

                    if (announcement_id) {
                        Promise.all([
                                AnnouncementData.getByID(announcement_id),
                                AdData.getAllForAnnouncement(announcement_id),
                                GameData.getByID(game_id),
                                PlacementData.getAllForGame(game_id)
                            ])
                            .then((values) => {
                                this.setState({
                                    announcement: values[0],
                                    ads: values[1],
                                    game: values[2],
                                    placements: values[3]
                                });
                            });
                    }

                }

                async reload() {
                    const {
                        announcement_id,
                        game_id
                    } = this.props.match.params;
                    if (announcement_id) {
                        return Promise.all([
                                AnnouncementData.getByID(announcement_id),
                                AdData.getAllForAnnouncement(announcement_id)
                            ])
                            .then((values) => {
                                this.setState({
                                    announcement: values[0],
                                    ads: values[1]
                                });
                            });
                    }
                }

                componentWillReceiveProps(nextProps) {
                    if (nextProps.params) {
                        this.setState({
                            params: nextProps.params
                        });
                    }
                }

                save = async (newAnnouncement, newAds) => {
                    this.setState({
                        saving: true
                    }); // set saving bool, to prevent double-saves
                    const errors = [];

                    if (newAds.length === 0) {
                        errors.push("Languages: At least one language must be enabled.");
                    }
                    // Validate that title, description
                    newAds.forEach(ad => {
                        if (ad.Title === "" || ad.Description === "") {
                            errors.push("Languages: Title and Description required for " + ad.Language + " ad.");
                        }
                    });
                    // Validate Ad Creatives
                    let maxCreatives = newAds.reduce((max, ad) => {
                        return Math.max(max, ad.ad_creatives.length);
                    }, 0);
                    // look for any ads that don't match the max number of creatives.
                    newAds.forEach(ad => {
                        if (ad.ad_creatives.length < maxCreatives) {
                            errors.push("Missing Creatives: Expected " + maxCreatives + ", got " + ad.ad_creatives.length);
                        }
                        ad.ad_creatives.forEach(c => {
                            if (!c.Large || !c.ImageChecksum || c.Large === "house_ads/assets/no-image.png" || c.ImageChecksum === "") {
                                errors.push("Missing Image for Language: " + c.Language + " in creative #" + c.Priority);
                            }
                        });
                    });

                    // Make sure an icon is selected
                    if (newAnnouncement.Icon === null) {
                        errors.push("Icon: Please select an icon.");
                    }
                    // Validate format of Announcement Extra Data
                    if (newAnnouncement.ExtraData !== null) {
                        try {
                            JSON.parse(newAnnouncement.ExtraData);
                        } catch (e) {
                            errors.push("ExtraData: Invalid JSON [" + e.message + "]");
                        }
                    }
                    // Validate Placements
                    if (newAnnouncement.Placements.length === 0) {
                        errors.push("Placements: At least one placement must be selected.");
                    } else {
                        newAnnouncement.Placements.forEach(placement => {
                            if (placement.platforms.length === 0) {
                                errors.push("Placements: At least one platform must be enabled for active placement_id [" + placement.placement_id + "]");
                            }
                        });
                    }

                    // find all of the ads that need to be removed.         
                    const removedAds = this.state.ads.filter(ad => {
                        let index = newAds.findIndex(newAd => {
                            return ad.ID === newAd.ID;
                        });
                        return index === -1;
                    });

                    if (errors.length > 0) {
                        this.setState({
                            errors: errors
                        });
                    } else {
                        await Promise.all(removedAds.map(ad => {
                            AdData.remove(ad);
                        }));

                        // Save Here
                        await this.saveAds(newAds);
                        this.addUserMessage("Languages Saved.");
                        await this.saveAnnouncement(newAnnouncement);
                    }
                    await this.reload();
                    this.setState({
                        saving: false
                    });
                }

                saveAnnouncement = async (newProps, newAds) => {
                    let isDirty = false;
                    for (var prop in newProps) {
                        if (newProps[prop] !== this.state.announcement[prop]) {
                            isDirty = true;
                        }
                    }
                    if (isDirty) {
                        await AnnouncementData.update(newProps);
                        this.addUserMessage("Changes Saved");
                    }
                }

                saveAds = async (newAds) => {

                    // validate ads here
                    return Promise.all(newAds.map(AdData.update)).then(results => {
                        return results;
                    });
                }

                clearErrors = () => {
                    this.setState({
                        errors: []
                    });
                }

                onCancel = () => {
                    this.gotToAnnouncementsPage();
                }

                gotToAnnouncementsPage = () => {
                    const path = ["/games", this.state.game.GameID, "announcements"].join("/");
                    this.props.history.push(path);
                }

                render() {
                        const {
                            announcement,
                            game,
                            ads,
                            placements,
                            saving
                        } = this.state;

                        if (!announcement || !game || !ads || !placements) {
                            return ( < div > Loading < /div>);
                            }
                            else {
                                console.log(ads);
                                // pass all route params to nested components
                                return ( < div > {
                                        this.renderAppBar()
                                    } <
                                    EditAnnouncementPage game = {
                                        game
                                    }
                                    placements = {
                                        placements
                                    }
                                    ads = {
                                        ads
                                    }
                                    announcement = {
                                        announcement
                                    }
                                    onCancel = {
                                        this.onCancel
                                    }
                                    save = {
                                        this.save
                                    }
                                    saving = {
                                        saving
                                    }
                                    /> <
                                    Notifications / >
                                    <
                                    ErrorDialog title = {
                                        "Save Failed"
                                    }
                                    errors = {
                                        this.state.errors
                                    }
                                    clear = {
                                        this.clearErrors
                                    }
                                    /> <
                                    /div>);
                                }
                            }
                        }

                        export default withRouter(EditAnnouncementPageContainer);