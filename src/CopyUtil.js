/**
 * Created by mac on 2017/8/18.
 */
import {toJS, isObservableMap, isObservableArray, isObservableObject, isObservable} from 'mobx';
import _ from 'lodash'

/**
 * 用于对象保存前做一次转换，仅用于对象中存在数组属性的对象，其他无使用必要。
 * @param object
 * @param toStr
 * @returns {*}
 */
const cascadingCopy = (object,toStr)=> {

    if (_.isEmpty(object)) {
        if (isObservableArray(object) || object instanceof Array) {
            return []
        }
        if (isObservableObject(object) || object instanceof Object) {
            return {}
        }
        if (isObservableMap(object) || object instanceof Map) {
            return {}
        }
        if (object instanceof Date) {
            return new Date();
        }
        return '';
    }
    if (isObservableMap(object) || (object instanceof Map)) {

        let res = {}
        let keys = object.keys();
        keys.forEach((key) => {
            //非普通对象，且是观测对象，需递归复制，并toJS转化
            if (isObservableMap(object[key]) ||
        isObservableArray(object[key]) ||
        isObservableObject(object[key])) {
            res[key] = cascadingCopy(toJS(object[key],toStr));
            //非普通对象，非观测对象，需递归复制，无需toJS转化
        } else if ((object[key] instanceof Map) || (object[key] instanceof Array) || (object[key] instanceof Object)) {
            res[key] = cascadingCopy(object[key],toStr);
        } else {
            //普通对象，直接复制
            res[key] = _dealObj(object[key],toStr);
        }
    })
        return res;
    } else if (isObservableArray(object) || (object instanceof Array)) {
        let arrayValues = [];
        object.map((item) => {
            //非普通对象，且是观测对象，需递归复制，并toJS转化
            if (isObservableMap(item) ||
        isObservableArray(item) ||
        isObservableObject(item)) {
            arrayValues.push(cascadingCopy(toJS(item),toStr));
            //非普通对象，非观测对象，需递归复制，无需toJS转化
        } else if ((item instanceof Map) || (item instanceof Array) || (item instanceof Object)) {
            arrayValues.push(cascadingCopy(item,toStr));
        } else {
            //普通对象，直接复制
            arrayValues.push(_dealObj(item,toStr))
        }
    })
        return arrayValues
    } else if (isObservableObject(object) || (object instanceof Object)) {
        let res = {}
        for (let key in object) {
            //非普通对象，且是观测对象，需递归复制，并toJS转化
            if (isObservableMap(object[key]) ||
                isObservableArray(object[key]) ||
                isObservableObject(object[key])) {
                res[key] = cascadingCopy(toJS(object[key],toStr));
                //非普通对象，非观测对象，需递归复制，无需toJS转化
            } else if ((object[key] instanceof Map) || (object[key] instanceof Array) || (object[key] instanceof Object)) {
                res[key] = cascadingCopy(object[key],toStr);
            } else {
                //普通对象，直接复制
                res[key] = _dealObj(object[key],toStr);
            }
        }
        return res;
    }

    return object;
}

function _dealObj(obj,toStr){
    if(typeof(obj) == 'number'&&toStr){
        return obj.toString();
    }
    return obj;
}

export {cascadingCopy};