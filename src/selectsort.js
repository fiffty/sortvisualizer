// edit this later

class SelectSort extends Component {
  render() {
    function goToNextStep() {
        const {barsHistory, stepHistory, sortCompleted} = this.state
        if (sortCompleted) return
        const currentStep = stepHistory[stepHistory.length - 1]
        const aIndex = currentStep.aIndex
        const bIndex = currentStep.bIndex

        const newBars = deepClone(barsHistory[barsHistory.length - 1])
        const barsToSort = newBars
        const numOfSorted = barsToSort.filter((bar) => bar.sorted).length

        let aBar, bBar, aBarIsLastBar, bBarIsLastBar
        for (let i = 0; i < barsToSort.length; i++) {
            if (barsToSort[i].orderIndex === aIndex) {
              aBar = barsToSort[i]
              if (aBar.orderIndex === barsToSort.length - 1) {
                aBarIsLastBar = true
              }
            } else if (barsToSort[i].orderIndex === bIndex) {
              bBar = barsToSort[i]
              if (bBar.orderIndex === barsToSort.length - 1) {
                bBarIsLastBar = true
              }              
            }
        }

        switch (currentStep.type) {
          case 'SWITCH':
            for (let bar of barsToSort) {
              bar.style = null
            }
            aBar.sorted = true
            if (aBar.orderIndex !== numOfSorted - 1) {
              for (let i = 0; i < barsToSort.length; i++) {
                if (barsToSort[i].orderIndex === numOfSorted) {
                  barsToSort[i].orderIndex = aBar.orderIndex
                }
              }
              aBar.orderIndex = numOfSorted
            }

            if (numOfSorted === barsToSort.length - 1) {
              this.setState({
                barsHistory: barsHistory.concat([newBars]),
                stepHistory: stepHistory.concat(Object.assign({}, currentStep, {
                  type: 'FINISH',
                })),
                sortCompleted: true
              })
            } else {
              this.setState({
                barsHistory: barsHistory.concat([newBars]),
                stepHistory: stepHistory.concat(Object.assign({}, currentStep, {
                  type: 'SELECT_AS_MIN',
                  aIndex: numOfSorted + 1
                }))
              })  
            }
            break
          case 'COMPARE':
            for (let bar of barsToSort) {
              bar.style = null
            }
            aBar.style = {backgroundColor: '#3F5765'}
            bBar.style = {backgroundColor: '#BDD4DE'}

            if (aBar.value > bBar.value) {
              this.setState({
                barsHistory: barsHistory.concat([newBars]),
                stepHistory: stepHistory.concat(Object.assign({}, currentStep, {
                  type: 'SELECT_AS_MIN',
                  aIndex: currentStep.bIndex
                }))
              })               
            } else if (bBarIsLastBar) {
              this.setState({
                barsHistory: barsHistory.concat([newBars]),
                stepHistory: stepHistory.concat(Object.assign({}, currentStep, {
                  type: 'SWITCH',
                  aIndex: currentStep.aIndex
                }))
              })
            } else {
              this.setState({
                barsHistory: barsHistory.concat([newBars]),
                stepHistory: stepHistory.concat(Object.assign({}, currentStep, {
                  type: 'COMPARE',
                  bIndex: currentStep.bIndex + 1
                }))
              }) 
            }
            break
          case 'SELECT_AS_MIN':
            for (let bar of barsToSort) {
              bar.style = null
            }
            aBar.style = {backgroundColor: '#3F5765'}

            if (aBarIsLastBar) {
              this.setState({
                barsHistory: barsHistory.concat([newBars]),
                stepHistory: stepHistory.concat(Object.assign({}, currentStep, {
                  type: 'SWITCH',
                  aIndex: currentStep.aIndex
                }))     
              })         
            } else {
              this.setState({
                barsHistory: barsHistory.concat([newBars]),
                stepHistory: stepHistory.concat(Object.assign({}, currentStep, {
                  type: 'COMPARE',
                  bIndex: currentStep.aIndex + 1
                }))
              }) 
            }
            break
          default:
            break
        }
    }

    const nextStep = {
      aIndex: 0,
      type: 'SELECT_AS_MIN'      
    }

    return (
      <Sort 
        initialStep={nextStep}
        width={'600px'}
        height={'400px'}
        goToNextStep={goToNextStep}
        />
    )
  }
}