import React from 'react';
import { Dropdown} from 'semantic-ui-react';

    
class DropdownLeague extends React.Component {
   
    render() {
        return( 
            <Dropdown selection fluid
            options={this.props.options} 
            placeholder='Liga'  
            onChange={this.props.triggerChange} 
            />
        )
    }
}

export default DropdownLeague;