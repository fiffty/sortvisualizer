import React, {Component, PropTypes} from 'react'
import BarChart from './BarChart'

class Sort extends Component {
    constructor(props) {
        super(props)

        const {initialBars, initialStep} = this.props
        this.state = Object.assign({
            barsHistory: [initialBars], 
            stepHistory: [initialStep]
        }, this.props.additionalStates)

        this.goToPrevStep = this.props.goToPrevStep.bind(this)
        this.goToNextStep = this.props.goToNextStep.bind(this)
    }

    render() {
        console.log(this.state)
        const barsHistory = this.state.barsHistory
        const propsToPass = Object.assign({}, this.props, {bars: barsHistory[barsHistory.length - 1]})
        return (
            <div>
            <button onClick={this.goToPrevStep}>Prev Step</button>
            <button onClick={this.goToNextStep}>Next Step</button>
            <BarChart 
                {...propsToPass}  />
            </div>
        );
    }
}

Sort.propTypes = {
    initialBars: PropTypes.array.isRequired,
    initialStep: PropTypes.object.isRequired,
    goToPrevStep: PropTypes.func.isRequired,
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