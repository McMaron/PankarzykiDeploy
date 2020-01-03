import React from 'react';
import { Dropdown} from 'semantic-ui-react';

class DropdownStatus extends React.Component {
    state = {
        options: [
            { key: '1', text: 'Trwające', value:'pending' },
            { key: '2', text: 'Zakończone', value:'closed'}
          ]
      }
    render() {
        return (
            <Dropdown selection fluid
                options={this.state.options} 
                placeholder='Aktualne/zakończone?'  
                onChange={this.props.triggerChange} 
            />
        )
    }

}

export default DropdownStatus;