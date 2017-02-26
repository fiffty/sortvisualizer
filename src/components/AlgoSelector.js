import React, {Component} from 'react'

class AlgoSelector extends Component {
	constructor() {
		super()

		this.state = {
			dropdownActive: false
		}
		this.toggleDropdown = this.toggleDropdown.bind(this)
		this.selectBubbleSort = this.selectBubbleSort.bind(this)
		this.selectSelectSort = this.selectSelectSort.bind(this)
	}

	toggleDropdown() {
		this.setState({
			dropdownActive: !this.state.dropdownActive
		})
	}

	selectBubbleSort() {
		this.props.selectAlgo('BUBBLE')
		this.setState({
			dropdownActive: false
		})
	}

	selectSelectSort() {
		this.props.selectAlgo('SELECT')
		this.setState({
			dropdownActive: false
		})
	}


	render() {
		return (
        <div className="title">
          <h1><span className="sort-type" onClick={this.toggleDropdown}>{this.props.algorithm}</span> SORT VISUALIZER</h1>
          {this.state.dropdownActive? 
          <div className="sort-type__select">
            <div className="sort-type__option" onClick={this.selectBubbleSort}>bubble sort</div>
            <div className="sort-type__option" onClick={this.selectSelectSort}>select sort</div>
          </div>
          : null}        
        </div>
		)
	}
}

export default AlgoSelector