import React, {Component, PropTypes} from 'react'
import Bar from './Bar'

export default class BarChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            test: 0
        }
    }

    render() {
        // Required props
        const {bars, order} = this.props
        // Optional props
        const {width, height} = this.props
        const minValue = (this.props.minValue) ? this.props.minValue : 0
        const maxValue = (this.props.maxValue) ? this.props.maxValue : 
            bars
            .reduce((curr, next) => {
                if (curr.value < next.value) {
                    return next
                } else {
                    return curr
                }
            }).value

        const widthOfBars = (1/bars.length*100).toFixed(2) + '%'

        const styles = {
            root: {
                width: '100%',
                height: '100%'
            },
            barsContainer: {
                width: '100%',
                height: '100%',
                position: 'relative'
            }
        }

        return (
            <div style={Object.assign({}, styles.root, {width, height})}>
                <div id="bars-container" style={styles.barsContainer}>
                    {bars.map((bar, i) => {
                        return (
                            <Bar 
                                key={'bar-' + i}
                                value={bar.value}
                                orderIndex={bar.orderIndex}
                                label={bar.label}
                                width={widthOfBars}
                                height={(bars[i].value/(maxValue - minValue)*100).toFixed(2) + '%'}
                                style={bar.style}
                                sorted={bar.sorted} />
                        )
                    })}
                </div>
            </div>
        )
    }
}

BarChart.propTypes = {
    bars: PropTypes.array.isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
    minValue: PropTypes.number,
    maxValue: PropTypes.number
}