import React, {Component, PropTypes} from 'react'
const Rx = require('rxjs/Rx')
const Observable = Rx.Observable

export default class Bar extends Component {
    componentDidMount() {
        // const barMouseDowns = Observable.fromEvent(this.refs.bar, 'mousedown')
        // const barsContainerMouseMoves = Observable.fromEvent(document.getElementById('bars-container'), 'mousemove')
        // .do(() => {
        //     this.refs.bar.style.zIndex = 999
        // })
        // const barsContainerMouseUps = Observable.fromEvent(document.getElementById('bars-container'), 'mouseup')
        // .do(() => {
        //     this.refs.bar.style.transition = '0.3s all ease'
        //     this.refs.bar.style.transform = 'translate3d(0px,0px,0px)'
        //     this.refs.bar.style.zIndex = 1
        //     setTimeout(() => {
        //         this.refs.bar.style.transition = '0.4s left ease'
        //     }, 300)
        // })
        
        // const barsMouseDrags = barMouseDowns
        // .concatMap(contactPoint => {
        //     return barsContainerMouseMoves
        //     .takeUntil(barsContainerMouseUps)
        //     .map(movePoint => {
        //         return {
        //             pageX: movePoint.pageX - contactPoint.offsetX
        //         }
        //     })
        // })
        // .forEach(dragPoint => {
        //     this.refs.bar.style.transform = `translate3d(${dragPoint.pageX - this.props.width*this.props.orderIndex}px,0px,0px)`
        // })
    }

    render() {
        const {value, orderIndex, label, width, height, style, sorted} = this.props

        const styles = {
            root: {
                width: width - 10,
                margin: '0px 5px',
                height,
                position: 'absolute',
                bottom: 0,
                left: width * orderIndex,
                backgroundColor: '#CCC',
                border: '1px solid #AAA',
                color: '#FFF',
                transition: '0.4s left ease'
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
            <div className="bar" style={Object.assign({}, styles.root, style, (sorted)?{backgroundColor: '#FF974F'}:null)}>
            </div>
        )
    }
}

Bar.propTypes = {
    value: PropTypes.number.isRequired,
    orderIndex: PropTypes.number.isRequired,
    label: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.string,
    style: PropTypes.object,
    sorted: PropTypes.bool
}