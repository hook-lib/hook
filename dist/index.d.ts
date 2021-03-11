import HookEvent from '@hook/event';
export { options } from '@hook/event';
export declare type setterKey = string | {
    [key: string]: any;
};
declare type setterReadonlys = {
    [key: string]: boolean;
};
export default class Hook extends HookEvent {
    private _readonlySetters;
    private _setterdata;
    private _getSetterData;
    set(key: setterKey, value?: any): this;
    get(field?: string): any;
    generateSetter(setterName: string, setterReadonlys?: setterReadonlys): (key: setterKey, value?: any) => this;
    generateGetter(setterName: string): (field?: string) => any;
    getReadonlyProps(setterName: string): setterReadonlys;
    setReadOnlyProps(setterName: string, props?: setterReadonlys): this;
}
