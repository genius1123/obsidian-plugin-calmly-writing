
import * as path from 'path';
import player, { PlayerConfig } from './player';

const _basePath: string = app.vault.adapter.getBasePath() + "\\.obsidian\\plugins\\calmly-writing\\src"


const _cutAudio: string = path.join(_basePath, 'sound', 'cut.wav');
const _pasteAudio: string = path.join(_basePath, 'sound', 'paste.wav');
const _enterAudio: string = path.join(_basePath, 'sound', 'enter.wav');
const _tabAudio: string = path.join(_basePath, 'sound', 'tab.wav');
const _arrowsAudio: string = path.join(_basePath, 'sound', 'arrow.wav');

const mp3_scrollDown: string = path.join(_basePath, 'sound', 'scrollDown.wav');
const mp3_scrollUp: string = path.join(_basePath, 'sound', 'scrollUp.wav');
const _deleteAudio: string = path.join(_basePath, 'sound', 'backspace.wav'); // 删除
const spaceAudio: string = path.join(_basePath, 'sound', 'space.wav');
const returnNew: string = path.join(_basePath, 'sound', 'return-new.wav'); // 回车
const _otherKeysAudio: string = path.join(_basePath, 'sound', 'key-01.wav'); // 
const asdfasdf = "ss"

let config: PlayerConfig = {
    macVol: 1,
    winVol: 100,
    linuxVol: 100
};

// 第一个参数是需要进行防抖处理的函数，第二个参数是延迟时间，默认为1秒钟
// 这里多传一个参数，immediate用来决定是否要第一次立即执行, 默认为false
function debounce(fn, delay = 1000, immediate = false) {
    // 实现防抖函数的核心是使用setTimeout
    // time变量用于保存setTimeout返回的Id
    let time = null
    // isImmediateInvoke变量用来记录是否立即执行, 默认为false
    let isImmediateInvoke = true

    console.log(fn);
       // 将回调接收的参数保存到args数组中
    function _debounce(...args) {
        console.log('args',args)
        // 如果time不为0，也就是说有定时器存在，将该定时器清除
        if (time !== null) {
            clearTimeout(time)
        }

        // 当是第一次触发，并且需要触发第一次事件
        if (!isImmediateInvoke && immediate) {
            fn.apply(args)
            // 将isImmediateInvoke设置为true，这样不会影响到后面频繁触发的函数调用
            isImmediateInvoke = true;
        }

        time = setTimeout(() => {
            // 使用apply改变fn的this，同时将参数传递给fn
            fn.apply(args)
            // 当定时器里的函数执行时，也就是说是频繁触发事件的最后一次事件
            // 将isImmediateInvoke设置为false，这样下一次的第一次触发事件才能被立即执行
            isImmediateInvoke = false
        }, delay)
    }

    // 防抖函数会返回另一个函数，该函数才是真正被调用的函数
    return _debounce
}

const playerPlay = function (type: string, config: PlayerConfig) {
    console.log('type',type)
    console.log('config',config)

    function aaa(type, config) {
        console.log("player");
        
        player.play(type, config);
    }

    return aaa(type, config)
}


export const window_onkeydown = function (e) {
    // 没有按下Ctrl
    if (!e.ctrlKey) {
        if (e.keyCode == 34) { // Page Down
            player.play(mp3_scrollDown, config);
        } else if (e.keyCode == 33) { // Page Up
            player.play(mp3_scrollUp, config);
        } else if (e.keyCode == 8 || e.keyCode == 46) { // BackSpace Delete
            player.play(_deleteAudio, config);
        } else if (e.keyCode == 32) { // Spacebar 空格
            player.play(spaceAudio, config);
        } else if (e.keyCode == 13) { // Enter
            player.play(returnNew, config);
        } else if (
            (e.keyCode >= 48 && e.keyCode <= 90) ||
            (e.keyCode >= 96 && e.keyCode <= 111) ||
            e.keyCode >= 187
        ) {
            player.play(_otherKeysAudio, config);
        }
    }

}
