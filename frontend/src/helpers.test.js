import {deepCopy} from './helpers.js'

it('Deep copy nested object', () => {
  const obj = {1: {2: {3: {4:[], 5: () => {console.log('hello')}}}}}
  expect(
    deepCopy(obj)
    ).toEqual(obj)
})
