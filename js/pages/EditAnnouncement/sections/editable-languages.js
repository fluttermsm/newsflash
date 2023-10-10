import React, {
    Component
} from 'react';
import PropTypes, {
    array
} from 'prop-types';

import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Popover from '@material-ui/core/Popover';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import {
    withStyles
} from '@material-ui/core/styles';
import ListIcon from '@material-ui/icons/List';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowLeftIcon from '@material-ui/icons/ArrowBack';
import ArrowRightIcon from '@material-ui/icons/ArrowForward';

import * as AdData from '../../../data/ads.js';
import {
    S3URLFromKey
} from '../../../constants.js';
import BaseComponent from '../../../common/components/BaseComponent.js';


const styles = theme => ({
    creativeCard: {
        minWidth: 150,
    },
    creativeMedia: {
        height: 100
    },
    creativeCardContainer: {

    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: 500,
        height: 450,
    },
});

const languageSortPriority = {
    en: 1,
    fr: 2,
    de: 3,
    es: 4,
    it: 5,
    tr: 6,
    ru: 7,
    pt: 8
};

const fillMissingCreatives = (ads) => {
    const numCreatives = ads.reduce((maxCreatives, ad) => {
        return Math.max(maxCreatives, ad.ad_creatives.length);
    }, 0);

    return ads.map(ad => {
        for (let i = 0; i < numCreatives; i++) {
            if (!ad.ad_creatives[i]) {
                ad.ad_creatives[i] = {
                    Large: "house_ads/assets/no-image.png",
                    Small: "house_ads/assets/no-image.png",
                    Key: "",
                    ImageChecksum: "",
                    Priority: -1
                };
            }
            // Reset priority to match the position in the array
            ad.ad_creatives[i].Priority = i + 1;
        }
        return ad;
    });
}

const ValidFileTypes = ["image/png", "image/jpeg", "image/jpg"];
const MaxFileSize = 500000; // 500k

class EditableLanguages extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            anchorEl: undefined,
            imageDialogOpen: false,
            languageDialogOpen: false,
            pending: [],
            preview: {
                open: false,
                src: "",
                anchor: false
            }
        };
    }

    removeAd = (ad) => {
        // this.props.removeLanguage(ad);
        const {
            Language
        } = ad;
        console.log(this.props.ads);
        const newAds = this.props.ads.filter(ad => ad.Language !== Language);
        console.log(newAds);
        this.onAdsChange(newAds);
    }


    addLanguage = (languageCode) => {
        const idx = this.props.ads.findIndex(ad => ad.Language === languageCode);
        if (idx === -1) {
            const newAds = [...this.props.ads];
            newAds.push({
                GroupID: this.props.announcement_id,
                Language: languageCode,
                Title: "",
                Description: "",
                URL: "",
                ad_creatives: []
            });
            this.onAdsChange(newAds);
        }
    }

    onAdsChange = (ads) => {
        const newAds = fillMissingCreatives(ads);
        this.props.onAdsChange(newAds);
    }

    showImagePopover = (event) => {
        const state = Object.assign({}, this.state);
        state.preview = {
            open: true,
            src: event.target.src,
            anchor: event.currentTarget
        };
        this.setState(state);
    }

    closeImagePopover = (event) => {
        const state = Object.assign({}, this.state);
        state.preview = {
            open: false,
            src: "",
            anchor: false
        };
        this.setState(state);
    }

    addLanguageClick = (event) => {
        // This prevents ghost click.
        // event.preventDefault();

        this.setState({
            open: true,
            anchorEl: event.currentTarget,
        });
    }

    addLanguageClose = () => {
        this.setState({
            open: false,
        });
    }

    // Helpers
    isValidFileSize = (file) => {
        console.log(file.name + " is " + file.size);
        return file.size <= MaxFileSize;
    }

    isValidFileType = (file) => {
        return (ValidFileTypes.indexOf(file.type) > -1);
    }

    isFileNameValid = (file) => {
        const parts = file.name.split(".");
        const lang = parts[0].substring(parts[0].lastIndexOf("_") + 1).toLowerCase();
        return (languageSortPriority.hasOwnProperty(lang) || lang === "xx");
    }

    languageAlreadyExist = (language) => {
        return this.props.ads.findIndex(x => {
            return x.Language === language
        }) > -1
    }

    getFullLanguage = (language) => {
        switch (language) {
            case "en":
                return "English";
            case "fr":
                return "French";
            case "it":
                return "Italian";
            case "de":
                return "German";
            case "es":
                return "Spanish";
            case "ru":
                return "Russian";
            case "pt":
                return "Portuguese";
            case "tr":
                return "Turkish";
            default:
                return "Unknown";
        }
    }

    getAvailableLanguageData = () => {
        let languages = [];
        for (var lang in languageSortPriority) {
            if (languageSortPriority.hasOwnProperty(lang)) {
                languages.push({
                    code: lang,
                    name: this.getFullLanguage(lang)
                });
            }
        }
        return languages;
    }

    fileListToArray = (filesObj) => {
        const filesArr = [];
        for (var i = 0; i < filesObj.length; i++) {
            filesArr.push(filesObj[i]);
        }
        return filesArr;
    }

    handleFileSelect = (event, index) => {
        console.log(event.target.files);
        console.log(index);

        const fileListObj = event.target.files;

        const files = this.fileListToArray(fileListObj);
        const languages = files.map(x => {
            return {
                language: x.name.substring(x.name.lastIndexOf("_") + 1, x.name.lastIndexOf(".")).toLowerCase(),
                file: x
            }
        });
        const invalidSizes = files.filter(file => {
            return !this.isValidFileSize(file)
        });
        const invalidTypes = files.filter(file => {
            return !this.isValidFileType(file)
        });
        const invalidFileNames = files.filter(file => {
            return !this.isFileNameValid(file)
        });

        if (invalidSizes.length > 0) {
            alert(invalidSizes.length + ' of your files are larger than the max size of ' + MaxFileSize);
        }
        if (invalidTypes.length > 0) {
            alert(invalidTypes.length + ' of your files are of invalid types. Valid types are ' + ValidFileTypes.join(", "));
        }
        if (invalidFileNames.length > 0) {
            alert(invalidFileNames.length + " of your files have invalid names. Valid formats end with _EN.jpg, _EN.png, etc");
        }

        if (languages.length > 0 && invalidSizes.length === 0 && invalidTypes.length === 0 && invalidFileNames.length === 0) {
            if (languages.length === 1 && languages[0].language === "xx") {
                Promise.all(this.getAvailableLanguageData().map(o => {
                    return AdData.uploadImage(o.code, languages[0].file).then(res => {
                        res.Language = o.code;
                        return res;
                    });
                })).then(result => {
                    this.handleCreativesChange(result, index);
                    this.addUserMessage("Images Uploaded to S3.");
                });
            } else {
                Promise.all(languages.map(o => {
                    return AdData.uploadImage(o.language, o.file).then(res => {
                        res.Language = o.language;
                        return res;
                    });
                })).then(result => {
                    console.log(result);
                    this.handleCreativesChange(result, index);
                    this.addUserMessage("All Images Uploaded to S3");
                });
            }

        }
    }

    handleTitleChange = (ad, Title) => {
        this.props.onAdChange(ad.Language, {
            Title
        });
    }

    handleDescriptionChange = (ad, Description) => {
        this.props.onAdChange(ad.Language, {
            Description
        });
    }

    handleCallToActionChange = (ad, CallToAction) => {
        this.props.onAdChange(ad.Language, {
            CallToAction
        });
    }

    handleCreativesChange = (newCreatives, creativeIndex) => {
        if (creativeIndex === -1) {
            creativeIndex = this.props.ads.reduce((id, ad) => {
                return Math.max(id, ad.ad_creatives.length);
            }, 0);
        }

        const newAds = this.props.ads.map(ad => {
            let creative = newCreatives.find(c => c.Language === ad.Language);
            if (creative !== undefined) {
                if (!ad.ad_creatives[creativeIndex])
                    ad.ad_creatives[creativeIndex] = {};

                ad.ad_creatives[creativeIndex].Large = creative.Key;
                ad.ad_creatives[creativeIndex].Small = creative.Key;
                ad.ad_creatives[creativeIndex].ImageChecksum = creative.ETag.replace(/"/g, ""); // strip double quotes string
                ad.ad_creatives[creativeIndex].Priority = creativeIndex + 1;
            }
            return ad;
        });

        this.onAdsChange(newAds);
    }

    handleRemoveCreatives = (index) => {
        const newAds = this.props.ads.map(ad => {
            ad.ad_creatives.splice(index, 1);
            return ad;
        });

        this.onAdsChange(newAds);
    }

    handleNewCreativeClick = () => {
        const newAds = this.props.ads.map(ad => {
            let emptyCreative = {
                Large: "house_ads/assets/no-image.png",
                Small: "house_ads/assets/no-image.png",
                Key: "",
                ImageChecksum: "",
                Priority: -1
            };
            ad.ad_creatives.push(Object.assign(emptyCreative));
            return ad;
        });

        this.onAdsChange(newAds);
    }

    moveCreativePriority = (index, direction) => {
        const currentIndex = index;
        const newIndex = index + direction;

        const newAds = this.props.ads.map(ad => {
            let creative = ad.ad_creatives[index];
            ad.ad_creatives.splice(currentIndex, 1);
            ad.ad_creatives.splice(newIndex, 0, creative);

            return ad;
        });

        this.onAdsChange(newAds);
    }

    // Helper function/easter egg for helping Matt S copy data more effeciently from Google Sheets where translations take place.
    handleLanguagePaste = (event) => {
        let paste = (event.clipboardData || window.clipboardData).getData("text");
        if (paste.split("\t").length > 1) {
            let lines = paste.split("\r\n");
            lines.forEach(line => {
                let cols = line.split("\t");

                if (cols[0].endsWith("_TITLE")) {
                    this.parseLanguagePaste("Title", cols.slice(1));
                } else if (cols[0].endsWith("_DESC")) {
                    this.parseLanguagePaste("Description", cols.slice(1));
                } else if (cols[0].endsWith("_CTA")) {
                    this.parseLanguagePaste("CallToAction", cols.slice(1));
                } else {
                    this.parseLanguagePaste(event.target.name, cols);
                }
            });
            event.preventDefault();
        }
    }

    parseLanguagePaste = (prop, languages) => {
        Object.keys(languageSortPriority).sort((a, b) => {
                return languageSortPriority[a] < languageSortPriority[b] ? -1 : 1;
            })
            .filter(lang => {
                return (this.props.ads.find(ad => ad.Language === lang) !== undefined);
            })
            .map((lang, index) => {
                let ad = this.props.ads.find(ad => ad.Language === lang);
                let text = languages[index];
                return {
                    ad,
                    text
                }
            })
            .forEach(o => {
                if (prop === "Title") {
                    this.handleTitleChange(o.ad, o.text);
                } else if (prop === "Description") {
                    this.handleDescriptionChange(o.ad, o.text);
                } else if (prop === "CallToAction") {
                    this.handleCallToActionChange(o.ad, o.text);
                } else {
                    throw Error("Unhandled Property: " + prop);
                }
            });
    }

    render() {
            return ( < div >
                <
                Card style = {
                    this.props.rootStyle
                } >
                <
                CardHeader avatar = { < Avatar > < ListIcon / > < /Avatar>}
                    title = {
                        "Languages"
                    }
                    subheader = {
                        "Languages and localization"
                    }
                    action = { <
                        Button onClick = {
                            this.addLanguageClick
                        } >
                        Add Language <
                        /Button>
                    }
                    /> <
                    CardContent >
                    <
                    div style = {
                        {
                            textAlign: 'center',
                            display: 'inline-block'
                        }
                    } > {
                        this.renderLanguageSelectMenu()
                    } {
                        this.renderTable()
                    } <
                    /div> {
                        (this.state.preview.open && this.state.preview.src !== "") ? < Popover
                        open = {
                            this.state.preview.open
                        }
                        anchorEl = {
                            this.state.preview.anchor
                        }
                        // anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                        // targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        onClose = {
                                this.closeImagePopover
                            } >
                            <
                            Paper >
                            <
                            img alt = {
                                "Preview"
                            }
                        src = {
                            this.state.preview.src
                        }
                        /> <
                        /Paper> <
                        /Popover> : ""
                    } <
                    /CardContent>             <
                    /Card> {
                        /* <Typography variant="title">
                                        Creatives
                                    </Typography>
                                    {this.renderCreatives()} */
                    } <
                    /div>
                );
            }

            renderTable() {
                    let numCreatives = this.props.ads.reduce((prev, ad) => {
                        return Math.max(prev, ad.ad_creatives.length);
                    }, 0);

                    let creativeInputs = [];
                    for (let i = 0; i < numCreatives; i++) {
                        creativeInputs.push( <
                            div >
                            <
                            Button size = "small"
                            variant = "outlined"
                            color = "primary"
                            component = "label" >
                            Upload <
                            input hidden key = {
                                i
                            }
                            accept = "image/*"
                            type = "file"
                            name = "image"
                            multiple onChange = {
                                (event) => {
                                    this.handleFileSelect(event, i)
                                }
                            }
                            /> <
                            /Button> <
                            IconButton aria - label = "Delete"
                            color = "default"
                            onClick = {
                                (event) => {
                                    this.handleRemoveCreatives(i)
                                }
                            } >
                            <
                            DeleteIcon / >
                            <
                            /IconButton> <
                            /div>
                        );
                    }

                    return ( < Table >
                            <
                            TableHead >
                            <
                            TableRow >
                            <
                            TableCell style = {
                                {
                                    width: 50
                                }
                            } > Language < /TableCell> <
                            TableCell style = {
                                {
                                    width: 360
                                }
                            } > Title < /TableCell> <
                            TableCell style = {
                                {
                                    width: 760
                                }
                            } > Description < /TableCell> <
                            TableCell style = {
                                {
                                    width: 150
                                }
                            } > Call To Action < /TableCell> {
                                creativeInputs.map((input, idx) => {
                                        return <TableCell style = {
                                            {
                                                width: 142,
                                                padding: 2
                                            }
                                        }
                                        key = {
                                                idx
                                            } >
                                            Creative# {
                                                idx + 1
                                            } <
                                            br / > {
                                                (idx > 0) ? < IconButton size = "small"
                                                onClick = {
                                                    (event) => {
                                                        this.moveCreativePriority(idx, -1)
                                                    }
                                                } > < ArrowLeftIcon / > < /IconButton> : ""} {
                                                    (idx < creativeInputs.length - 1) ? < IconButton size = "small"
                                                    onClick = {
                                                            (event) => {
                                                                this.moveCreativePriority(idx, 1)
                                                            }
                                                        } > < ArrowRightIcon / > < /IconButton> : ""} <
                                                        br / > {
                                                            input
                                                        } <
                                                        /TableCell>
                                                })
                                    } <
                                    TableCell >
                                    <
                                    Button size = "small"
                                    color = "primary"
                                    onClick = {
                                        (event) => {
                                            this.handleNewCreativeClick(event)
                                        }
                                    } > New Creative < /Button>                         <
                                    /TableCell> <
                                    /TableRow> <
                                    /TableHead> <
                                    TableBody > {
                                        this.props.ads.sort((a, b) => {
                                            return languageSortPriority[a.Language] - languageSortPriority[b.Language]
                                        }).map((ad, index) => {
                                            return ( <
                                                TableRow key = {
                                                    index
                                                } >
                                                <
                                                TableCell > {
                                                    ad.Language
                                                } < /TableCell> <
                                                TableCell >
                                                <
                                                TextField name = "Title"
                                                value = {
                                                    ad.Title || ""
                                                }
                                                onChange = {
                                                    (event) => {
                                                        this.handleTitleChange(ad, event.target.value)
                                                    }
                                                }
                                                error = {
                                                    (ad.Title === "")
                                                }
                                                fullWidth = {
                                                    true
                                                }
                                                helperText = "Add Title"
                                                inputProps = {
                                                    {
                                                        onPaste: this.handleLanguagePaste
                                                    }
                                                }
                                                /> <
                                                /TableCell> <
                                                TableCell >
                                                <
                                                TextField name = "Description"
                                                value = {
                                                    ad.Description || ""
                                                }
                                                onChange = {
                                                    (event) => {
                                                        this.handleDescriptionChange(ad, event.target.value)
                                                    }
                                                }
                                                error = {
                                                    (ad.Description === "")
                                                }
                                                fullWidth = {
                                                    true
                                                }
                                                multiline = {
                                                    true
                                                }
                                                helperText = "Add Description"
                                                inputProps = {
                                                    {
                                                        onPaste: this.handleLanguagePaste
                                                    }
                                                }
                                                /> <
                                                /TableCell> <
                                                TableCell >
                                                <
                                                TextField name = "CallToAction"
                                                value = {
                                                    ad.CallToAction || ""
                                                }
                                                onChange = {
                                                    (event) => {
                                                        this.handleCallToActionChange(ad, event.target.value)
                                                    }
                                                }
                                                fullWidth = {
                                                    true
                                                }
                                                helperText = "Add Call to Action"
                                                inputProps = {
                                                    {
                                                        onPaste: this.handleLanguagePaste
                                                    }
                                                }
                                                /> <
                                                /TableCell>   {
                                                    ad.ad_creatives.map((c, idx) => {
                                                        return ( < TableCell style = {
                                                                {
                                                                    width: 142,
                                                                    padding: 2
                                                                }
                                                            }
                                                            key = {
                                                                idx
                                                            } > < img src = {
                                                                S3URLFromKey(c.Large)
                                                            }
                                                            alt = {
                                                                c.Large
                                                            }
                                                            height = {
                                                                80
                                                            }
                                                            /></TableCell > )
                                                    })
                                                } <
                                                TableCell style = {
                                                    {
                                                        textAlign: 'right'
                                                    }
                                                } >
                                                <
                                                IconButton onClick = {
                                                    () => {
                                                        this.removeAd(ad);
                                                    }
                                                } > < DeleteIcon / > < /IconButton> <
                                                /TableCell> <
                                                /TableRow>
                                            );
                                        })
                                    } <
                                    /TableBody> <
                                    /Table>
                                );
                            }

                            renderLanguageSelectMenu() {
                                let menuItems = this.getAvailableLanguageData().filter(o => {
                                    return !this.languageAlreadyExist(o.code);
                                }).map((o, index) => {
                                        return ( < MenuItem key = {
                                                index
                                            }
                                            value = {
                                                o.code
                                            }
                                            onClick = {
                                                (event) => {
                                                    this.addLanguage(o.code)
                                                }
                                            } > {
                                                o.name
                                            } < /MenuItem>);
                                        });
                                    return ( <
                                        Menu open = {
                                            this.state.open
                                        }
                                        anchorEl = {
                                            this.state.anchorEl
                                        }
                                        // anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                                        // targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                                        onClose = {
                                            this.addLanguageClose
                                        } >
                                        {
                                            menuItems
                                        } <
                                        /Menu>
                                    );
                                }
                            }

                            EditableLanguages.propTypes = {
                                announcement_id: PropTypes.number.isRequired,
                                onAdChange: PropTypes.func.isRequired,
                                onAdsChange: PropTypes.func.isRequired
                            };


                            export default withStyles(styles)(EditableLanguages);