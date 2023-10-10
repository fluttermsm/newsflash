import React from 'react';
import Icon from '@material-ui/core/Icon'


const platformIcons = {
    ios: "images/platforms/ios.png",
    android: "images/platforms/android.png",
    amazon: "images/platforms/amazon.png",
    aftb: "images/platforms/aftb.png",
    android4: "images/platforms/android4.png",
    samsung: "images/platforms/samsung.png",
    steam: "images/platforms/steam.png",
    unknown: "images/platforms/no-icon.png"
};

const defaultStyles = {
    sortIcon: {
        fontSize: 16,
        color: "#eee"
    },
    errorIcon: {
        color: "#E53935"
    }
};

export const SaveIcon = (props) => {
        return ( < Icon className = "far fa-save" { ...props
            }
            />);
        }

        export const DeleteIcon = (props) => {
                return ( < Icon className = "fas fa-minus-circle" { ...props
                    }
                    />);
                }

                export const EditIcon = (props) => {
                        return ( < Icon className = "far fa-edit" { ...props
                            }
                            />);
                        }

                        export const CloneIcon = (props) => {
                                return ( < Icon className = "far fa-clone" { ...props
                                    }
                                    />);
                                }

                                export const CogsIcon = (props) => {
                                        return ( < Icon className = "far fa-cogs" { ...props
                                            }
                                            />);
                                        }

                                        export const AddIcon = (props) => {
                                                return ( < Icon className = "fas fa-plus-circle" { ...props
                                                    }
                                                    />);
                                                }

                                                export const CheckIcon = (props) => {
                                                        return ( < Icon className = "far fa-check" { ...props
                                                            }
                                                            />);
                                                        }

                                                        export const UpArrowIcon = (props) => {
                                                                return ( < Icon className = "far fa-arrow-circle-up" { ...props
                                                                    }
                                                                    />);
                                                                }

                                                                export const DownArrowIcon = (props) => {
                                                                        return ( < Icon className = "far fa-arrow-circle-down" { ...props
                                                                            }
                                                                            />);
                                                                        }

                                                                        export const SortIcon = (props) => {

                                                                                return ( < Icon className = "far fa-sort" { ...props
                                                                                    }
                                                                                    />);
                                                                                }

                                                                                export const SortDesc = (props) => {
                                                                                        return ( < Icon className = "far fa-sort-down" { ...props
                                                                                            }
                                                                                            />);
                                                                                        }

                                                                                        export const SortAsc = (props) => {
                                                                                                return ( < Icon className = "far fa-sort-up" { ...props
                                                                                                    }
                                                                                                    />);
                                                                                                }

                                                                                                export const ErrorIcon = (props) => {
                                                                                                        return ( < Icon className = "far fa-exclamation-circle" { ...Object.assign({
                                                                                                                    style: defaultStyles.errorIcon
                                                                                                                }, props)
                                                                                                            }
                                                                                                            />); 
                                                                                                        }

                                                                                                        export const MailIcon = (props) => {
                                                                                                                return ( < Icon className = "far fa-envelope" { ...props
                                                                                                                    }
                                                                                                                    />);
                                                                                                                }

                                                                                                                export const NewsIcon = (props) => {
                                                                                                                        return ( < Icon className = "fa fa-newspaper-o" { ...props
                                                                                                                            }
                                                                                                                            />);
                                                                                                                        }


                                                                                                                        export const mapPlatformNamesToIcons = (platforms, size = 24) => {
                                                                                                                            return platforms.map((platform, index) => {
                                                                                                                                const src = (platformIcons[platform]) ? platformIcons[platform] : platformIcons["unknown"];
                                                                                                                                return <img key = {
                                                                                                                                    index
                                                                                                                                }
                                                                                                                                alt = {
                                                                                                                                    platform
                                                                                                                                }
                                                                                                                                className = "PlatformIcon"
                                                                                                                                src = {
                                                                                                                                    process.env.PUBLIC_URL + "/" + src
                                                                                                                                }
                                                                                                                                width = {
                                                                                                                                    size
                                                                                                                                }
                                                                                                                                height = {
                                                                                                                                    size
                                                                                                                                }
                                                                                                                                title = {
                                                                                                                                    platform
                                                                                                                                }
                                                                                                                                />
                                                                                                                            })
                                                                                                                        }