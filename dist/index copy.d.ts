import HookEvent from '@hook/event';
declare type readonlyConfig = {
    [key: string]: boolean;
};
declare type config = {
    [setterName: string]: any;
};
export default class Hook extends HookEvent {
    private _readonlyCaches;
    private _setterCaches;
    constructor();
    private _getSetterCache;
    generateSetter(setterName: string, readonlyConfig?: readonlyConfig): (key: string | {
        [key: string]: any;
    }, value?: any) => this;
    generateGetter(setterName: string): (field?: string | undefined) => config | undefined;
    protected _set(): void;
    private _getReadonlyCache;
    setReadOnlyProps(setterName: string, props?: {}): this;
}
export {};
