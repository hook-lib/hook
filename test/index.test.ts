import Hook from '../src/index'
import type { setterKey } from '../src/index'

test('set and get', async () => {
  const hook = new Hook()
  hook.set('a.1', 1)

  expect(hook.get('a.1')).toEqual(1)
})

test('add setter and getter', async () => {
  class MyHook extends Hook {
    setConfig(key: setterKey, value?: any) {
      return this.generateSetter('setConfig', { readonly1: true, readonly2: true })(key, value)
    }

    getConfig(field?: string) {
      return this.generateGetter('setConfig')(field)
    }
  }
  const hook = new MyHook()

  hook.setConfig({
    prop1: 'prop1',
    readonly1: 'readonly1'
  })
  const config = hook.getConfig()
  console.log(config)

  expect(config).toEqual({ prop1: 'prop1' })
})
