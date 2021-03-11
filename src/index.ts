import HookEvent from '@hook/event'

import { merge, isPlainObject } from 'lodash'
type readonlyConfig = {
  [key: string]: boolean
}
type readonlyCaches = {
  [setterName: string]: readonlyConfig
}

type dataCache = {
  [key: string]: any
}
type dataCaches = {
  [key: string] : dataCache
}

type config = {
  [setterName: string]: any
}

export type setterKey = string | {[key: string]: any }

export default class Hook extends HookEvent {
  private _readonlyCaches: readonlyCaches = {}
  private _setterCaches: dataCaches= {}

  private _getSetterCache(setterName: string) {
    const caches = this._setterCaches
    if (!caches[setterName]) {
      caches[setterName] = {}
    }
    return caches[setterName]
  }

  set(key: setterKey, value?: any) {
    return this.generateSetter('set')(key, value)
  }

  get(field?: string) {
    return this.generateGetter('set')(field)
  }

  generateSetter(setterName: string, readonlyConfig?: readonlyConfig) {
    const datas: config = this._getSetterCache(setterName)
    if (readonlyConfig) {
      this.setReadOnlyProps(setterName, readonlyConfig)
    }

    return (key: setterKey, value?: any) => {
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

  generateGetter(setterName: string) {
    const datas: config = this._getSetterCache(setterName)
    return (field?: string) => {
      if (field) {
        return datas[field]
      }
      return datas
    }
  }

  getReadonlyProps(setterName: string): readonlyConfig {
    const caches = this._readonlyCaches
    if (!caches[setterName]) {
      caches[setterName] = {}
    }
    return caches[setterName]
  }

  setReadOnlyProps(setterName: string, props: readonlyConfig = {}) {
    const cache = this.getReadonlyProps(setterName)
    Object.keys(props).forEach((key) => {
      if (props[key]) {
        cache[key] = true
      } else {
        delete cache[key]
      }
    })
    this.emit('HOOK_ERROR', {
      code: 200001,
      message: 'add readonly props',
      detail: {
        method: setterName,
        value: props
      }
    })
    return this
  }
}
