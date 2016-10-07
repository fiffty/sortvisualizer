import React from 'react'
import {shallow} from 'enzyme'
import BarChart from './BarChart'


const bars = [
    {
        label: 'Bar 1',
        value: 12
    },
    {
        label: 'Bar 2',
        value: 10
    },
    {
        label: 'Bar 3',
        value: 16
    },
]
const order = [0,1,2]
const barchart = shallow(<BarChart bars={bars} order={order}/>)
const barscontainer = barchart.find('#bars-container')

it('renders without crashing', () => {
    const barchart = shallow(<BarChart bars={bars} order={order}/>)
})

test('renders the correct number of <Bar />', () => {
    expect(barscontainer.children().length).toEqual(bars.length)
})

test('Sends correct width value as prop to <Bar />', () => {
    const widthOfBar = (1/bars.length*100).toFixed(2) + '%'
    expect(barscontainer.children().first().props().width).toEqual(widthOfBar)    
})

test('Sends correct height value as prop to <Bar />', () => {
    let minValue = 0
    let maxValue = bars
        .reduce((curr, next) => {
            if (curr.value < next.value) {
                return next
            } else {
                return curr
            }
        }).value
    let heightOfBar = (bars[0].value/(maxValue - minValue)*100).toFixed(2) + '%'
    expect(barscontainer.children().first().props().height).toEqual(heightOfBar)
})

test('props width and height overwrites style', () => {
    const width = '1300px'
    const height = '800px'
    const barchart = shallow(<BarChart width={width} height={height} bars={bars} order={order}/>)

    expect(barchart.props().style.width).toEqual(width)
    expect(barchart.props().style.height).toEqual(height)
})

test('clicking', () => {
    const button = barchart.find('button')
    button.simulate('click')
    expect(barchart.state().test).toEqual(1)
})