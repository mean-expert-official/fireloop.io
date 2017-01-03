export interface Injectable extends Function {
    new(...args: Array<any>): any;
    _instance?: any;
    _dependencies?: Array<any>;
    _providing?: Array<any>;
}