function serviceLocator() {
    const dependencies = {};
    const factories = {};
    const serviceLocator = {};
    serviceLocator.factory = (name, factory) => {
        factories[name] = factory;
    }
    serviceLocator.register = (name, instance) => {
        dependencies[name] = instance;
    }
    serviceLocator.get = (name) => {
        if(dependencies[name]) {
            return dependencies[name];
        }
        const factory = factories[name];
        dependencies[name] = factories && factory();
        if(!dependencies[name]) {
            throw Error(`Cannot find module: ${name}`);
        }
    }

    return serviceLocator;
}

(function(root, factory){
    if (typeof define === 'function' && define.amd) {
        define(['mustanche'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        const mustanche = require('mustanche');
        module.exports = factory(mustanche);
    } else {
        root.UmdModule = factory(root.Mustanche);
    }
})(this, function(mustanche) {
    // 模块相关使用代码
    const template = 'hello'
})

let demoNode = ({
    tagName: 'ul',
    props: {'class': 'list'},
    children: [
        ({tagName: 'li', children: ['douyin']}),
        ({tagName: 'li', children: ['toutiao']})
    ]
});
function Element({target, props, children}) {
    if (this instanceof Element ) {
        return new Element({target, props, children});
    }
    this.target = target;
    this.props = props || {};
    this.children = children || [];
}
function createTree(demoNode) {
    const children = [];
    if(typeof demoNode === 'string') {
        return demoNode;
    }
    demoNode.children && demoNode.children.map(item => {
        children.push(createTree(item));
    });
    const newElement = new Element(demoNode);
    newElement.children = children;
    return newElement;
}

console.log(createTree(demoNode))
