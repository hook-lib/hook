import Hook from '../src/index'
import type { setterKey } from '../src/index'

test('set and get', async () => {
  const hook = new Hook()
  hook.set('a.1', 1)

  expect(hook.get('a.1')).toEqual(1)
})

test('add setter and getter', async () => {
  interface LooseObject extends Hook {
    [key: string]: any
  }
  const hook: LooseObject = new Hook()
  hook.setConfig = function (key: setterKey, value?: any) {
    return this.generateSetter('setConfig', { readonly1: true, readonly2: true })(key, value)
  }
  hook.getConfig = function(field?: string) {
    return this.generateGetter('setConfig')(field)
  }

  hook.setConfig({
    prop1: 'prop1',
    readonly1: 'readonly1'
  })
  const config = hook.getConfig()

  expect(config).toEqual({ prop1: 'prop1' })
})

test('getReadonlyProps and setReadonlyProps', () => {
  const hook = new Hook()
  expect(hook.getReadonlyProps('set')).toEqual({})
  hook.setReadOnlyProps('set', { prop1: true, prop2: true })
  expect(hook.getReadonlyProps('set')).toEqual({ prop1: true, prop2: true })
  hook.setReadOnlyProps('set', { prop2: false, prop3: true })
  expect(hook.getReadonlyProps('set')).toEqual({ prop1: true, prop3: true })
})
