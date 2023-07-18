
import type { Plugin } from 'vite'
import { parse } from '@vue/compiler-sfc'
import type { SFCStyleBlock, SFCScriptBlock } from '@vue/compiler-sfc'
import { Options, ScriptCode, StyleBlocks } from './type'
let nodeEnv;
export default function comments(options: Options = { prefix: "dev", debugger: false}): Plugin {

    //处理template
    const tempReg = new RegExp(`<!--#if-${options.prefix}-->(.*?)<!--#end-${options.prefix}-->`, 'igs');
    const replaceTemplate = (code: string): string => {
        return code.replace(tempReg, options.debugger ? '<!--条件注释template-->' : '');
    }


    const scriptOrStyleOrTsReg = new RegExp(`//#if-${options.prefix}(.*?)//#end-${options.prefix}`, 'igs');
    //处理script
    const replaceScript = (code: SFCScriptBlock): ScriptCode => {
        return {
            content: code.content.replace(scriptOrStyleOrTsReg, options.debugger ? '//条件注释js' : ''),
            setup: code.setup,
            lang: code.lang
        }
    }

    //style 可以有多个
    const replaceStyle = (codes: SFCStyleBlock[]): StyleBlocks[] => {
        return codes.map(style => ({
            content: style.content.replace(scriptOrStyleOrTsReg, options.debugger ? '//条件注释css' : ''),
            scoped: style.scoped,
            lang: style.lang,
            attr: style.attrs
        }))
    }
    //复仇者集合
    const AssemblyCode = (temp, script: ScriptCode, style: StyleBlocks[]) => {
        let str = ``;
        str += `<template>${temp}</template>\n`;
        str += `<script ${script?.setup ? 'setup' : ''} ${script?.lang ? 'lang=' + `'${script.lang}'` : ''} >${script.content}</script>\n`;
        style.forEach(style => {
            str += `<style ${style?.scoped ? 'scoped' : ''} ${style?.lang ? 'lang=' + `'${style.lang}'` : ''}>${style.content}</style>\n`
        })
        console.log(str)
        return str;
    }

    //处理ts
    const replaceTsOrTsx = (code: string) => {
        return code.replace(scriptOrStyleOrTsReg, options.debugger ? '//条件注释ts' : '')
    }

    return {
        name: "vite-plugin-vue-comments",
        enforce: "pre",
        config(this, config, env) {
            nodeEnv = env 
        },
        transform(code, id) {
            if (/.vue$/.test(id)) {
                const { descriptor } = parse(code)
                const temp = descriptor?.template?.content
                const script = descriptor?.scriptSetup;
                const styles = descriptor?.styles
               
                if(temp && script && styles){
                    const tempCode = replaceTemplate(temp)
                    const scriptCode = replaceScript(script)
                    const styleCode = replaceStyle(styles)
                    const template = AssemblyCode(tempCode, scriptCode, styleCode)
                    return nodeEnv.mode == 'development' ? code :  template
                }else{
                    return code
                }
               
            }

            if (/.ts$/.test(id)) {
                return nodeEnv.mode == 'development' ? code : replaceTsOrTsx(code)
            }  
            if (/.js$/.test(id)) {
                return nodeEnv.mode == 'development' ? code : replaceTsOrTsx(code)
            }
            if (/.jsx$/.test(id)) {
                return nodeEnv.mode == 'development' ? code : replaceTsOrTsx(code)
            }


            if(/.tsx$/.test(id)){
               return nodeEnv.mode == 'development' ? code : replaceTsOrTsx(code)
            }

            return code
        }
    }
}

