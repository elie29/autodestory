Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var autoDestroySymbol = Symbol('autoDestroy');
exports.autoDestroy = function (instance, destroyMethod) {
    if (destroyMethod === void 0) { destroyMethod = 'ngOnDestroy'; }
    createSubject(instance, destroyMethod);
    return function (source) {
        return source.pipe(operators_1.takeUntil(instance[autoDestroySymbol]));
    };
};
var createSubject = function (instance, destroyMethod) {
    assertDestroyExists(instance, destroyMethod);
    if (!instance[autoDestroySymbol]) {
        createSubjectOnce(instance, destroyMethod);
    }
};
var assertDestroyExists = function (instance, destroyMethod) {
    if (typeof instance[destroyMethod] !== 'function') {
        throw new Error(instance.constructor.name + " doesn't implement " + destroyMethod);
    }
};
var createSubjectOnce = function (instance, destroyMethod) {
    var current = instance[destroyMethod];
    instance[autoDestroySymbol] = new rxjs_1.Subject();
    instance[destroyMethod] = function () {
        current.apply(instance, arguments);
        instance[autoDestroySymbol].next();
        instance[autoDestroySymbol].complete();
    };
};
//# sourceMappingURL=auto-destroy.js.map