export const getFloaterPositionStyle = (x: number, y: number) => {
    return 'left:' + x + 'px;' + 'top:' + y + 'px;'
}

export const isElementScrollable = (element: HTMLElement): {
    x: boolean,
    y: boolean
} => {
    element = element[0] ? element[0] : element;
    const oArr = ['visible', 'hidden'];
    return {
        y: element.scrollHeight > element.offsetHeight &&
            (oArr.indexOf(getComputedStyle(element, null).getPropertyValue('overflow')) < 0 ||
                oArr.indexOf(getComputedStyle(element, null).getPropertyValue('overflow-y')) < 0),
        x: element.scrollWidth > element.offsetWidth &&
            (oArr.indexOf(getComputedStyle(element, null).getPropertyValue('overflow')) < 0 ||
                oArr.indexOf(getComputedStyle(element, null).getPropertyValue('overflow-x')) < 0)
    };
}

