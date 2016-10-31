import React, {Component, PropTypes} from 'react'
import BarChart from './BarChart'

class Sort extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sortCompleted: false,
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
    }

    componentDidUpdate() {
        if (this.state.sortCompleted && this.state.playing) {
            this.setState({
                playing: false
            })
        } else if (this.state.playing) {
            this.autoPlay = setTimeout((i) => {
                this.goToNextStep()
            }, 600)
        }
    }

    // goToPrevStep() {
    //     const {barsHistory, stepHistory} = this.state
    //     if (barsHistory.length > 1 && stepHistory.length > 1) {
    //       this.setState({
    //         barsHistory: barsHistory.slice(0,-1),
    //         stepHistory: stepHistory.slice(0,-1),
    //         sortCompleted: false
    //       })      
    //     }  
    // }

    togglePlay() {
        clearTimeout(this.autoPlay)
        this.setState({
            playing: !this.state.playing
        })
    }

    render() {
        const {playing} = this.state
        const {width, height, sortState} = this.props
        return (
            <div>
                <BarChart 
                    bars={sortState.currentBars}
                    width={width}
                    height={height}  />
                <button onClick={this.goToPrevStep}>Prev Step</button>
                <button onClick={this.goToNextStep}>Next Step</button>
                <button onClick={this.togglePlay}>{(playing) ? 'Pause' : 'Play'}</button>
            </div>
        );
    }
}

Sort.propTypes = {
    additionalStates: PropTypes.object,
    width: PropTypes.string,
    height: PropTypes.string
}

export default Sort