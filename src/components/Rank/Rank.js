import React from 'react';

const Rank = ({ name, entries }) => {
	return(
			<div>
				<div className='white f1' style={{fontFamily: 'Abril Fatface'}}>
					{`${name} your entry count is ...`}
				</div>
				<div className='white f1' style={{fontFamily: 'Abril Fatface'}}>
					{entries}
				</div>
			
			</div>
		);
}

export default Rank;