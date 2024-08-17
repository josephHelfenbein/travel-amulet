// import _ from 'lodash';


export function roundAt2DecimalPlaces(num: number) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function roundHalf(num: number) {
    return Math.round(num * 2) / 2;
}

export function isInDesiredForm(str: string) {
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
}

export function upperCaseEachWord(str: string) {
    return str.replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
}

export function checkIsValidInteger(str: string) {
    return /^[0-9]+$/.test(str);
}
