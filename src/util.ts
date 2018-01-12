export const translate3d = (x: number, y: number, z: number, t: number) => {
    t = (typeof t === "undefined")
        ? 0
        : t; //defaults to 0
    const tr = '-webkit-transform: translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px); -webkit-transition: ' + t + 'ms;' +
        '-moz-transform: translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px); -moz-transition: ' + t + 'ms;' +
        '-ms-transform: translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px); -ms-transition: ' + t + 'ms;' +
        '-o-transform: translate(' + x + 'px, ' + y + 'px); -o-transition: ' + t + 'ms;' +
        'transform: translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px); transition: ' + t + 'ms;';
    return tr;
}