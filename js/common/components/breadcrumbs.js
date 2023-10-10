import React, {
    Component
} from 'react';

class Breadcrumbs extends Component {
    render() {
        console.log(this.props.routes);
        console.log(this.props.params);
        return ( <
            div >
            Breadcrumbs <
            /div>
        );
    }
}

Breadcrumbs.propTypes = {

};

export default Breadcrumbs;