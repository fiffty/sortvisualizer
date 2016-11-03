import React, {Component, PropTypes} from 'react'
import BarChart from './BarChart'

class SortVisualizer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            playing: false
        }

        this.goToNextStep = () => {
            const action = {
                origin: 'USER',
                request: 'GO_TO_NEXT_STEP'
            }
            document.dispatchEvent(new CustomEvent('action', {detail: action}))
        }
        this.goToPrevStep = () => {
            const action = {
                origin: 'USER',
                request: 'GO_TO_PREV_STEP'
            }
            document.dispatchEvent(new CustomEvent('action', {detail: action}))           
        }

        this.togglePlay = this.togglePlay.bind(this)
        this.addRandom = this.addRandom.bind(this)
    }

    togglePlay() {
        const action = {
            origin: 'USER',
            request: 'TOGGLE_PLAY'
        }
        document.dispatchEvent(new CustomEvent('action', {detail: action})) 
    }

    addRandom() {
        const action = {
            origin: 'USER',
            request: 'ADD_RANDOM'
        }
        document.dispatchEvent(new CustomEvent('action', {detail: action}))
        clearTimeout(this.autoPlay)
        this.setState({
            playing: !this.state.playing
        })

    }

    render() {
        const {playing} = this.props
        const {width, height, sortState} = this.props
        return (
            <div className="sort-visualizer">
                <div className="barchart-container">
                    <BarChart 
                        bars={sortState.currentBars}
                        width={width}
                        height={height}  />
                    <i className="fa fa-plus-square-o add-bar__btn" onClick={this.addRandom}></i>
                </div>
                <div className="control-bar">
                    <i className="fa fa-backward control-bar__btn" onClick={this.goToPrevStep}></i>
                    <i className={playing? 'fa fa-pause control-bar__btn' : 'fa fa-play control-bar__btn'} onClick={this.togglePlay}></i>
                    <i className="fa fa-forward control-bar__btn" onClick={this.goToNextStep}></i>
                </div>
            </div>
        );
    }
}

SortVisualizer.propTypes = {
    additionalStates: PropTypes.object,
    width: PropTypes.string,
    height: PropTypes.string
}

export default SortVisualizer