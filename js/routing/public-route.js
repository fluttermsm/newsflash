import React from 'react';

import {
    Route
} from 'react-router-dom';

function PublicRoute({
    children,
    isAuthenticated,
    ...rest
}) {
    return ( <
        Route { ...rest
        }
        render = {
            (children)
        }
        />
    );
}

export default PublicRoute;