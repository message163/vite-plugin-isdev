export interface Options{
    prefix?:string,
    debugger?:boolean,
}

export interface ScriptCode {
    content:string,
    setup?:boolean | string,
    lang?:string
}

export interface StyleBlocks {
    content:string,
    scoped?:boolean,
    lang?:string,
    attr:Record<string,string | true>
}