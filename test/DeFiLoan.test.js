const { assert } = require("chai")

const DeFiLoan = artifacts.require('./DeFiLoan.sol')

contract('DeFiLoan', (accounts) => {
    before(async () => {
        this.defiLoan =  await DeFiLoan.deployed()
    })

    it('deployed successfully', async () => {
        const address = await this.defiLoan.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })
})