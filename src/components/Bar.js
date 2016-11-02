import React, {Component, PropTypes} from 'react'
const Rx = require('rxjs/Rx')
const Observable = Rx.Observable

export default class Bar extends Component {
    componentDidMount() {
        const barsContainerElem = document.getElementById('bars-container')
        const barElem = this.refs.bar
        const boundaries = {
            left: barsContainerElem.getBoundingClientRect().left,
            right: barsContainerElem.getBoundingClientRect().left + barsContainerElem.getBoundingClientRect().width
        }

        /* --------------------------------------------------
        HACKS FOR HTML5 DRAG & DROP API 
        -------------------------------------------------- */
        // hack to remove drag image
        barElem.addEventListener('dragstart', (e) => {
            const img = document.createElement("img");
            img.src = "https://static.beadsjar.co.uk/image/cache/data/journal2/transparent-250x250.png";
            e.dataTransfer.setDragImage(img, 0, 0);            
        }, false)
        // hack to remove last drag event 
        // which has x & y values set to 0
        document.addEventListener("dragover", (e) => {
            e.preventDefault();
        }, false);
        /* --------------------------------------------------
        END OF HACKS FOR HTML5 DRAG & DROP API 
        -------------------------------------------------- */

        const barMouseDragStart = Observable.fromEvent(barElem, 'dragstart')
        .do((e) => {
            document.dispatchEvent(new CustomEvent('action',{detail:{request:'PAUSE'}}))
            e.target.style.zIndex = 999
            e.target.style.cursor = 'ew-resize'
        })

        const barsContainerDragEnds = Observable.fromEvent(barsContainerElem, 'dragend')
        .do((e) => {
            e.target.style.transition = '0.3s all ease'
            e.target.style.transform = 'translate3d(0px,0px,0px)'
            e.target.style.zIndex = 1
            e.target.style.cursor = 'pointer'
            setTimeout(() => {
                e.target.style.transition = '0.4s left ease'
            }, 300)
        })
        
        const barsMouseDrags = Observable.fromEvent(barElem, 'drag')

        const subscription = barMouseDragStart
        .concatMap(contactPoint => {
            return barsMouseDrags
            .do(movePoint => {
                movePoint.target.style.transform = `translate3d(${movePoint.pageX - contactPoint.pageX}px,0px,0px)`
            })
            .takeUntil(barsContainerDragEnds)
        })
        .subscribe(x => {})
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
            <div ref="bar" draggable="true" className="bar" style={Object.assign({}, styles.root, style, (sorted)?{backgroundColor: '#FF974F'}:null)}>
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