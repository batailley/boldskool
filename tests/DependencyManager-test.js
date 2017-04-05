import { expect } from 'chai'

import DependencyManager from '../src/js/utils/DependencyManager'

describe('DependencyManager Tests', () => {
  it('DependencyManager should callback when dep is ready', () => {
    let dpMan = new DependencyManager(['chaussette'])

    expect(1 + 1).to.equal(expectedResult)
  })
})
