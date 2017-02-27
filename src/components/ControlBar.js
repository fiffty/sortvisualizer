import React, {Component} from 'react'

class ControlBar extends Component {
	render() {
		return (
			<div className="control-bar">
					<i className="fa fa-backward control-bar__btn" onClick={this.props.goToPrevStep}></i>
					<i className={this.props.playing? 'fa fa-pause control-bar__btn' : 'fa fa-play control-bar__btn'} onClick={this.props.togglePlay}></i>
					<i className="fa fa-forward control-bar__btn" onClick={this.props.goToNextStep}></i>
					<span onClick={this.props.addRandom} className="control-bar__btn">ADD BAR</span>
					<span onClick={this.props.getRandomData} className="control-bar__btn">USE NEW SET OF RANDOM DATA</span>				
			</div>
		)
	}
}

export default ControlBar