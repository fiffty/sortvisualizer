import React, {Component, PropTypes} from 'react'
import BarChart from './BarChart'
import AlgoSelector from './AlgoSelector'
import ControlBar from './ControlBar'

class SortVisualizer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            algorithm: 'BUBBLE',
        }

        this.togglePlay = this.togglePlay.bind(this)
        this.addRandom = this.addRandom.bind(this)
        this.goToPrevStep = this.goToPrevStep.bind(this)
        this.goToNextStep = this.goToNextStep.bind(this)
    }

    goToNextStep() {
        const action = {
            origin: 'USER',
            request: 'GO_TO_NEXT_STEP'
        }
        document.dispatchEvent(new CustomEvent('action', {detail: action}))        
    }

    goToPrevStep() {
        const action = {
            origin: 'USER',
            request: 'GO_TO_PREV_STEP'
        }
        document.dispatchEvent(new CustomEvent('action', {detail: action}))           
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
    }

    getRandomData() {
        document.dispatchEvent(new CustomEvent('action', {detail: {request: 'FETCH_RANDOM'}}))
    }

    getWeatherData() {
        document.dispatchEvent(new CustomEvent('action', {detail: {request: 'FETCH_WEATHER'}}))
    }
    
    render() {
        const {sortState} = this.props
        return (
            <div className="sort-visualizer">
                <AlgoSelector 
                    algorithm={this.props.algorithm}
                    selectAlgo={this.props.selectAlgo} />
                
                <BarChart 
                    bars={sortState.currentBars}
                    width={'600px'}
                    height={'300px'}  />

                <ControlBar 
                    playing={this.props.playing}
                    goToNextStep={this.goToNextStep}
                    goToPrevStep={this.goToPrevStep}
                    togglePlay={this.togglePlay}
                    getRandomData={this.getRandomData}
                    getWeatherData={this.getWeatherData}
                    addRandom={this.addRandom} />
            </div>
        )
    }
}

SortVisualizer.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string
}

export default SortVisualizer