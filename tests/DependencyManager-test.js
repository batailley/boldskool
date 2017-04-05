import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

chai.should()
chai.use(sinonChai)
const expect = chai.expect

import DependencyManager from '../src/js/utils/DependencyManager'

describe('DependencyManager Tests', () => {
  it('DependencyManager should callback when dep is ready', () => {
    let depReady = ''
    let depsReferences = ['salade', 'tomates', 'oignons']
    let dpMan = new DependencyManager(depsReferences)
    let callback = sinon.spy()

    dpMan.dependenciesListener(['tomates'], callback)

    dpMan.dispatch('tomates-ready')

    expect(callback).to.have.been.called
  })
})
