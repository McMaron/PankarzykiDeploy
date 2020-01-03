import React from 'react';
import { Dropdown} from 'semantic-ui-react';

class DropdownRole extends React.Component {
    state = {
        options: [
            { key: '1', text: 'W których grasz', value:'attending' }, 
            { key: '2', text: 'Które założyłeś/aś', value:'mygames'}, 
            { key: '3', text: 'Wszystkie', value:'all'}
          ]
      }
    render() {
        return (
            <Dropdown selection fluid 
                options={this.state.options} 
                placeholder='Które ligi?'  
                onChange={this.props.triggerChange} 
            />
        )
    }

}

export default DropdownRole;