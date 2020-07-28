!function(e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).EventEmitter3=e()}(function(){return function i(s,f,c){function u(t,e){if(!f[t]){if(!s[t]){var n="function"==typeof require&&require;if(!e&&n)return n(t,!0);if(a)return a(t,!0);var r=new Error("Cannot find module '"+t+"'");throw r.code="MODULE_NOT_FOUND",r}var o=f[t]={exports:{}};s[t][0].call(o.exports,function(e){return u(s[t][1][e]||e)},o,o.exports,i,s,f,c)}return f[t].exports}for(var a="function"==typeof require&&require,e=0;e<c.length;e++)u(c[e]);return u}({1:[function(e,t,n){"use strict";var r=Object.prototype.hasOwnProperty,v="~";function o(){}function f(e,t,n){this.fn=e,this.context=t,this.once=n||!1}function i(e,t,n,r,o){if("function"!=typeof n)throw new TypeError("The listener must be a function");var i=new f(n,r||e,o),s=v?v+t:t;return e._events[s]?e._events[s].fn?e._events[s]=[e._events[s],i]:e._events[s].push(i):(e._events[s]=i,e._eventsCount++),e}function u(e,t){0==--e._eventsCount?e._events=new o:delete e._events[t]}function s(){this._events=new o,this._eventsCount=0}Object.create&&(o.prototype=Object.create(null),(new o).__proto__||(v=!1)),s.prototype.eventNames=function(){var e,t,n=[];if(0===this._eventsCount)return n;for(t in e=this._events)r.call(e,t)&&n.push(v?t.slice(1):t);return Object.getOwnPropertySymbols?n.concat(Object.getOwnPropertySymbols(e)):n},s.prototype.listeners=function(e){var t=v?v+e:e,n=this._events[t];if(!n)return[];if(n.fn)return[n.fn];for(var r=0,o=n.length,i=new Array(o);r<o;r++)i[r]=n[r].fn;return i},s.prototype.listenerCount=function(e){var t=v?v+e:e,n=this._events[t];return n?n.fn?1:n.length:0},s.prototype.emit=function(e,t,n,r,o,i){var s=v?v+e:e;if(!this._events[s])return!1;var f,c=this._events[s],u=arguments.length;if(c.fn){switch(c.once&&this.removeListener(e,c.fn,void 0,!0),u){case 1:return c.fn.call(c.context),!0;case 2:return c.fn.call(c.context,t),!0;case 3:return c.fn.call(c.context,t,n),!0;case 4:return c.fn.call(c.context,t,n,r),!0;case 5:return c.fn.call(c.context,t,n,r,o),!0;case 6:return c.fn.call(c.context,t,n,r,o,i),!0}for(p=1,f=new Array(u-1);p<u;p++)f[p-1]=arguments[p];c.fn.apply(c.context,f)}else for(var a,l=c.length,p=0;p<l;p++)switch(c[p].once&&this.removeListener(e,c[p].fn,void 0,!0),u){case 1:c[p].fn.call(c[p].context);break;case 2:c[p].fn.call(c[p].context,t);break;case 3:c[p].fn.call(c[p].context,t,n);break;case 4:c[p].fn.call(c[p].context,t,n,r);break;default:if(!f)for(a=1,f=new Array(u-1);a<u;a++)f[a-1]=arguments[a];c[p].fn.apply(c[p].context,f)}return!0},s.prototype.on=function(e,t,n){return i(this,e,t,n,!1)},s.prototype.once=function(e,t,n){return i(this,e,t,n,!0)},s.prototype.removeListener=function(e,t,n,r){var o=v?v+e:e;if(!this._events[o])return this;if(!t)return u(this,o),this;var i=this._events[o];if(i.fn)i.fn!==t||r&&!i.once||n&&i.context!==n||u(this,o);else{for(var s=0,f=[],c=i.length;s<c;s++)(i[s].fn!==t||r&&!i[s].once||n&&i[s].context!==n)&&f.push(i[s]);f.length?this._events[o]=1===f.length?f[0]:f:u(this,o)}return this},s.prototype.removeAllListeners=function(e){var t;return e?(t=v?v+e:e,this._events[t]&&u(this,t)):(this._events=new o,this._eventsCount=0),this},s.prototype.off=s.prototype.removeListener,s.prototype.addListener=s.prototype.on,s.prefixed=v,s.EventEmitter=s,void 0!==t&&(t.exports=s)},{}]},{},[1])(1)});

const buttonCache = []
const buttonNames = [
  "A","B","X","Y",
  "LB","RB","LT","RT",
  "BACK","START",
  "L-STICK","R-STICK",
  "UP","DOWN","LEFT","RIGHT",
  "MAIN"
]

const xPad = new EventEmitter3()

xPad.buttons = {}
xPad.updateInterval = 10

xPad.on("update", () => {
  xPad.gamepad.buttons.forEach((b, i) => {
    const val = xPadButtonValue(b)
    if(buttonCache[i] !== val){
      buttonCache[i] = val
      xPad.emit("buttonUpdate", buttonNames[i], val)
    }
  })
})

window.addEventListener("gamepadconnected", (event) => {
  if(event.gamepad.id === "xinput") {
    buttonNames.forEach((name,i) => {
      buttonCache[i] = xPadButtonValue(event.gamepad.buttons[i])
      xPad.buttons[name] = buttonCache[i]
    })
    xPad.update = setInterval(() => xPad.emit("update"), xPad.updateInterval)
    xPad.gamepad = event.gamepad
    xPad.connected = true
    xPad.emit("connected")
  }
});

window.addEventListener("gamepaddisconnected", (event) => {
  if(event.gamepad === xPad.gamepad) {
    xPad.lastGamepad = event.gamepad
    clearInterval(xPad.update)
    xPad.gamepad = false
    xPad.connected = false
    xPad.emit("disconnected")
  }
});

function xPadButtonValue( b ) {
  return (typeof b == 'number') ? b : b.value
}