import React, {Component, PropTypes} from 'react'

export default class Bar extends Component {
    render() {
        const {value, orderIndex, label, width, height, style} = this.props

        const styles = {
            root: {
                width: 'calc(' + width + ' - 10px)',
                margin: '0px 5px',
                height,
                position: 'absolute',
                bottom: 0,
                left: parseFloat(width) * orderIndex + '%',
                backgroundColor: '#CCCCCC',
                transition: '0.5s all ease'
            },
            label: {
                display: 'block',
                width: '100%',
                textAlign: 'center'
            },
            value: {
                display: 'block',
                width: '100%',
                textAlign: 'center',
                position: 'absolute',
                left: 0,
                bottom: 0,
                padding: 5
            }
        }
        return (
            <div style={Object.assign({}, styles.root, style)}>
                {(false) ? <span style={styles.label}>{label}</span> : null}
                {(true) ? <span style={styles.value}>{value}</span> : null}
            </div>
        )
    }
}

Bar.propTypes = {
    value: PropTypes.number.isRequired,
    orderIndex: PropTypes.number.isRequired,
    label: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    style: PropTypes.object
}