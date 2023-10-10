import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const style = {
    root: {
        position: 'relative',
        height: '100%'
    },
    loading: {
        width: 400,
        textAlign: 'center'
    }
};

export const PageProgressLoader = () => {
        return ( < CircularProgress size = {
                40
            }
            left = {
                160
            }
            top = {
                20
            }
            status = "loading"
            style = {
                style.refresh
            }
            />);
        }