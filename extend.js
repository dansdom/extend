
Extend = function() {
//jQuery.extend = jQuery.fn.extend = function() {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    // Handle a deep copy situation
    if ( typeof target === "boolean" ) {
        deep = target;
        target = arguments[1] || {};
        // skip the boolean and the target
        i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if ( typeof target !== "object" && !objectHelper.isFunction(target) ) {
        target = {};
    }

    // extend jQuery itself if only one argument is passed
    if ( length === i ) {
        target = this;
        --i;
    }

    for ( ; i < length; i++ ) {
        // Only deal with non-null/undefined values
        if ( (options = arguments[ i ]) != null ) {
            // Extend the base object
            for ( name in options ) {
                src = target[ name ];
                copy = options[ name ];

                // Prevent never-ending loop
                if ( target === copy ) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if ( deep && copy && ( objectHelper.isPlainObject(copy) || (copyIsArray = objectHelper.isArray(copy)) ) ) {
                    if ( copyIsArray ) {
                        copyIsArray = false;
                        clone = src && objectHelper.isArray(src) ? src : [];

                    } else {
                        clone = src && objectHelper.isPlainObject(src) ? src : {};
                    }

                    // Never move original objects, clone them
                    target[ name ] = Extend( deep, clone, copy );

                // Don't bring in undefined values
                } else if ( copy !== undefined ) {
                    target[ name ] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};

// helper which replicates the jquery internal functions
var objectHelper = {

    core_push : Array.prototype.push,
    core_slice : Array.prototype.slice,
    core_indexOf : Array.prototype.indexOf,
    core_toString : Object.prototype.toString,
    core_hasOwn : Object.prototype.hasOwnProperty,
    core_trim : String.prototype.trim,
    class2type : {},

    type: function( obj ) {
        return obj == null ?
            String( obj ) :
            objectHelper.class2type[ objectHelper.core_toString.call(obj) ] || "object";
    },
    isPlainObject: function( obj ) {
        // Must be an Object.
        // Because of IE, we also have to check the presence of the constructor property.
        // Make sure that DOM nodes and window objects don't pass through, as well
        if ( !obj || objectHelper.type(obj) !== "object" || obj.nodeType || objectHelper.isWindow( obj ) ) {
            return false;
        }

        try {
            // Not own constructor property must be Object
            if ( obj.constructor &&
                !objectHelper.core_hasOwn.call(obj, "constructor") &&
                !objectHelper.core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
                return false;
            }
        } catch ( e ) {
            // IE8,9 Will throw exceptions on certain host objects #9897
            return false;
        }

        // Own properties are enumerated firstly, so to speed up,
        // if last one is own, then all properties are own.

        var key;
        for ( key in obj ) {}

        return key === undefined || objectHelper.core_hasOwn.call( obj, key );
    },
    isArray: Array.isArray || function( obj ) {
        return objectHelper.type(obj) === "array";
    },
    isFunction: function( obj ) {
        return objectHelper.type(obj) === "function";
    },
    isWindow: function( obj ) {
        return obj != null && obj == obj.window;
    }
};  // end of objectHelper