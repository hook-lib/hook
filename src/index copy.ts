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

export default class Hook extends HookEvent {
  private _readonlyCaches: readonlyCaches = {}
  private _setterCaches: dataCaches= {}
  constructor() {
    super()
    this.addSetAndGetMethods('set', 'get')
  }

  private _getSetterCache(setterName: string) {
    const caches = this._setterCaches
    if (!caches[setterName]) {
      caches[setterName] = {}
    }
    return caches[setterName]
  }

  generateSetter(setterName: string, readonlyConfig?: readonlyConfig) {
    const datas: config = this._getSetterCache(setterName)
    if (readonlyConfig) {
      this.setReadOnlyProps(setterName, readonlyConfig)
    }
    return (key: string | {[key: string]: any }, value?: any) => {
      const readOnlys = this._getReadonlyCache(setterName)
      if (isPlainObject(key)) {
        const config = <config>key
        Object.keys(readOnlys).forEach((prop) => {
          if (typeof config[prop] !== 'undefined') {
            delete config[prop]
            // this.emit('HOOK_ERROR', {
            //   code: 300002,
            //   message: 'can not set readonly props',
            //   detail: {
            //     method: setterName,
            //     prop: prop,
            //     value: config[prop]
            //   }
            // })
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
    let datas: config = this._getSetterCache(setterName)
    return (field?: string) => {
      if (field) {
        const arr = field.split('.')
        // let data = datas;
        while (arr.length) {
          const key = <string>(arr.shift())
          datas = datas[key]
          if (arr.length && !isPlainObject(datas)) {
            return
          }
        }
        return datas
      }
      return datas
    }
  }

  // set (key, value) {
  //   // this._setKernel('set')
  // }

  protected _set () {

  }

  // addSetAndGetMethods(setterName: string, getterName: string, readonlyConfig?: readonlyConfig) {
  //   let datas: config = {}
  //   if (readonlyConfig) {
  //     this.setReadOnlyProps(setterName, readonlyConfig)
  //   }
  //   // const propsSymbol = this.getSameSymbol(setterName);
  //   (Hook.prototype as any)[setterName] = (key: string | {[key: string]: any }, value?: any) => {
  //     const readOnlys = this._getReadonlyCache(setterName)
  //     if (isPlainObject(key)) {
  //       const config = <config>key
  //       Object.keys(readOnlys).forEach((prop) => {
  //         if (typeof config[prop] !== 'undefined') {
  //           delete config[prop]
  //           this.emit('HOOK_ERROR', {
  //             code: 300002,
  //             message: 'can not set readonly props',
  //             detail: {
  //               method: setterName,
  //               prop: prop,
  //               value: config[prop]
  //             }
  //           })
  //         }
  //       })
  //       merge(datas, config)
  //     } else if (typeof key === 'string' && typeof value !== 'undefined') {
  //       if (!readOnlys[key]) {
  //         datas[key] = value
  //       } else {
  //         this.emit('HOOK_ERROR', {
  //           code: 300001,
  //           message: 'can not set readonly prop',
  //           detail: {
  //             method: setterName,
  //             prop: key,
  //             value: value
  //           }
  //         })
  //       }
  //     }
  //     return this
  //   };

  //   (this as any)[getterName] = (field?: string) => {
  //     if (field) {
  //       const arr = field.split('.')
  //       // let data = datas;

  //       while (arr.length) {
  //         const key = <string>(arr.shift())
  //         datas = datas[key]
  //         if (arr.length && !isPlainObject(datas)) {
  //           return
  //         }
  //       }
  //       return datas
  //     }
  //     return datas
  //   }
  //   return this
  // }

  private _getReadonlyCache(setterName: string) {
    const caches = this._readonlyCaches
    if (!caches[setterName]) {
      caches[setterName] = {}
    }
    return caches[setterName]
  }

  setReadOnlyProps(setterName: string, props = {}) {
    const cache = this._getReadonlyCache(setterName)
    Object.keys(props).forEach((key) => {
      if (cache[key]) {
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
  // rewrite(name, method) {
  //   this[name] = method;
  //   return this;
  // }
}
