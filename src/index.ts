import HookEvent from '@hook/event'
import { merge, isPlainObject } from 'lodash'

export { options } from '@hook/event'
export type setterKey = string | {[key: string]: any }

type setterReadonlys = {
  [key: string]: boolean
}
type readonlySetters = {
  [setterName: string]: setterReadonlys
}

type setterData = {
  [key: string]: any
}
type settersData = {
  [key: string] : setterData
}

type config = {
  [setterName: string]: any
}

export default class Hook extends HookEvent {
  private _readonlySetters: readonlySetters = {}
  private _setterdata: settersData= {}

  private _getSetterData(setterName: string): any {
    const caches = this._setterdata
    if (!caches[setterName]) {
      caches[setterName] = {}
    }
    return caches[setterName]
  }

  set(key: setterKey, value?: any): this {
    return this.generateSetter('set')(key, value)
  }

  get(field?: string): any {
    return this.generateGetter('set')(field)
  }

  generateSetter(setterName: string, setterReadonlys?: setterReadonlys): (key: setterKey, value?: any) => this {
    const datas: config = this._getSetterData(setterName)
    if (setterReadonlys) {
      this.setReadOnlyProps(setterName, setterReadonlys)
    }

    return (key: setterKey, value?: any): this => {
      const readOnlys = this.getReadonlyProps(setterName)

      if (isPlainObject(key)) {
        const config = <config>key
        Object.keys(readOnlys).forEach((prop) => {
          if (typeof config[prop] !== 'undefined') {
            delete config[prop]
            this.emit('HOOK_ERROR', {
              code: 300002,
              message: 'can not set readonly props',
              detail: {
                method: setterName,
                prop: prop,
                value: config[prop]
              }
            })
          }
        })
        merge(datas, config)
      } else if (typeof key === 'string' && typeof value !== 'undefined') {
        if (!readOnlys[key]) {
          datas[key] = value
        } else {
          this.emit('HOOK_ERROR', {
            code: 300001,
            message: 'can not set readonly prop',
            detail: {
              method: setterName,
              prop: key,
              value: value
            }
          })
        }
      }
      return this
    }
  }

  generateGetter(setterName: string): (field?: string) => any {
    const datas: config = this._getSetterData(setterName)
    return (field?: string): any => {
      if (field) {
        return datas[field]
      }
      return datas
    }
  }

  getReadonlyProps(setterName: string): setterReadonlys {
    const caches = this._readonlySetters
    if (!caches[setterName]) {
      caches[setterName] = {}
    }
    return caches[setterName]
  }

  setReadOnlyProps(setterName: string, props: setterReadonlys = {}): this {
    const cache = this.getReadonlyProps(setterName)
    Object.keys(props).forEach((key) => {
      if (props[key]) {
        cache[key] = true
      } else {
        delete cache[key]
      }
    })
    return this
  }
}
