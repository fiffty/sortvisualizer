import React, {Component, PropTypes} from 'react'
import BarChart from './BarChart'

class Sort extends Component {
    constructor(props) {
        super(props)

        const {initialBars, initialStep} = this.props
        this.state = Object.assign({
            barsHistory: [initialBars], 
            stepHistory: [initialStep],
            sortCompleted: false,
            playing: false
        }, this.props.additionalStates)

        this.goToPrevStep = this.goToPrevStep.bind(this)
        this.goToNextStep = this.props.goToNextStep.bind(this)
        this.togglePlay = this.togglePlay.bind(this)
    }

    componentDidUpdate() {
        if (this.state.sortCompleted && this.state.playing) {
            this.setState({
                playing: false
            })
        } else if (this.state.playing) {
            setTimeout((i) => {
                this.goToNextStep()
            }, 600)
        }
    }

    goToPrevStep() {
        const {barsHistory, stepHistory} = this.state
        if (barsHistory.length > 1 && stepHistory.length > 1) {
          this.setState({
            barsHistory: barsHistory.slice(0,-1),
            stepHistory: stepHistory.slice(0,-1),
            sortCompleted: false
          })      
        }  
    }

    togglePlay() {
        this.setState({
            playing: !this.state.playing
        })
    }

    render() {
        const {barsHistory, playing} = this.state
        const propsToPass = Object.assign({}, this.props, {bars: barsHistory[barsHistory.length - 1]})
        return (
            <div>
                <BarChart 
                    {...propsToPass}  />
                <button onClick={this.goToPrevStep}>Prev Step</button>
                <button onClick={this.goToNextStep}>Next Step</button>
                <button onClick={this.togglePlay}>{(playing) ? 'Pause' : 'Play'}</button>
            </div>
        );
    }
}

Sort.propTypes = {
    initialBars: PropTypes.array.isRequired,
    initialStep: PropTypes.object.isRequired,
    goToNextStep: PropTypes.func.isRequired,
    additionalStates: PropTypes.object,
    width: PropTypes.string,
    height: PropTypes.string
}

export default Sort

// a simple utility function to clone objects
function deepClone(obj) {
    const json = JSON.stringify(obj)
    return JSON.parse(json)
}