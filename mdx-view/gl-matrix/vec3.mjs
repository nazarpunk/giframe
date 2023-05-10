import * as glMatrix from './common.mjs';
/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {Float32Array} a new 3D vector
 */

export function create() {
    return new Float32Array(3);
}
/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {Float32Array} a vector to clone
 * @returns {Float32Array} a new 3D vector
 */

export function clone(a) {
    const out = new Float32Array(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
}
/**
 * Calculates the length of a vec3
 *
 * @param {Float32Array} a vector to calculate length of
 * @returns {Number} length of a
 */

export function length(a) {
    const x = a[0];
    const y = a[1];
    const z = a[2];
    return Math.hypot(x, y, z);
}
/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {Float32Array} a new 3D vector
 */

export function fromValues(x, y, z) {
    const out = new Float32Array(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
}
/**
 * Copy the values from one vec3 to another
 *
 * @param {Float32Array} out the receiving vector
 * @param {Float32Array} a the source vector
 * @returns {Float32Array} out
 */

export function copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
}
/**
 * Set the components of a vec3 to the given values
 *
 * @param {Float32Array} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {Float32Array} out
 */

export function set(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
}
/**
 * Adds two vec3's
 *
 * @param {Float32Array} out the receiving vector
 * @param {Float32Array} a the first operand
 * @param {Float32Array} b the second operand
 * @returns {Float32Array} out
 */

export function add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {Float32Array} out the receiving vector
 * @param {Float32Array} a the first operand
 * @param {Float32Array} b the second operand
 * @returns {Float32Array} out
 */

export function subtract(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
}
/**
 * Multiplies two vec3's
 *
 * @param {Float32Array} out the receiving vector
 * @param {Float32Array} a the first operand
 * @param {Float32Array} b the second operand
 * @returns {Float32Array} out
 */

export function multiply(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
}
/**
 * Divides two vec3's
 *
 * @param {Float32Array} out the receiving vector
 * @param {Float32Array} a the first operand
 * @param {Float32Array} b the second operand
 * @returns {Float32Array} out
 */

export function divide(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
}
/**
 * Math.ceil the components of a vec3
 *
 * @param {Float32Array} out the receiving vector
 * @param {Float32Array} a vector to ceil
 * @returns {Float32Array} out
 */

export function ceil(out, a) {
    out[0] = Math.ceil(a[0]);
    out[1] = Math.ceil(a[1]);
    out[2] = Math.ceil(a[2]);
    return out;
}
/**
 * Math.floor the components of a vec3
 *
 * @param {Float32Array} out the receiving vector
 * @param {Float32Array} a vector to floor
 * @returns {Float32Array} out
 */

export function floor(out, a) {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    out[2] = Math.floor(a[2]);
    return out;
}
/**
 * Returns the minimum of two vec3's
 *
 * @param {Float32Array} out the receiving vector
 * @param {Float32Array} a the first operand
 * @param {Float32Array} b the second operand
 * @returns {Float32Array} out
 */

export function min(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
}
/**
 * Returns the maximum of two vec3's
 *
 * @param {Float32Array} out the receiving vector
 * @param {Float32Array} a the first operand
 * @param {Float32Array} b the second operand
 * @returns {Float32Array} out
 */

export function max(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
}
/**
 * Math.round the components of a vec3
 *
 * @param {Float32Array} out the receiving vector
 * @param {Float32Array} a vector to round
 * @returns {Float32Array} out
 */

export function round(out, a) {
    out[0] = Math.round(a[0]);
    out[1] = Math.round(a[1]);
    out[2] = Math.round(a[2]);
    return out;
}
/**
 * Scales a vec3 by a scalar number
 *
 * @param {Float32Array} out the receiving vector
 * @param {Float32Array} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {Float32Array} out
 */

export function scale(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
}
/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {Float32Array} out the receiving vector
 * @param {Float32Array} a the first operand
 * @param {Float32Array} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {Float32Array} out
 */

export function scaleAndAdd(out, a, b, scale) {
    out[0] = a[0] + b[0] * scale;
    out[1] = a[1] + b[1] * scale;
    out[2] = a[2] + b[2] * scale;
    return out;
}
/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {Float32Array} a the first operand
 * @param {Float32Array} b the second operand
 * @returns {Number} distance between a and b
 */

export function distance(a, b) {
    const x = b[0] - a[0];
    const y = b[1] - a[1];
    const z = b[2] - a[2];
    return Math.hypot(x, y, z);
}
/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {Float32Array} a the first operand
 * @param {Float32Array} b the second operand
 * @returns {Number} squared distance between a and b
 */

export function squaredDistance(a, b) {
    const x = b[0] - a[0];
    const y = b[1] - a[1];
    const z = b[2] - a[2];
    return x * x + y * y + z * z;
}
/**
 * Calculates the squared length of a vec3
 *
 * @param {Float32Array} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */

export function squaredLength(a) {
    const x = a[0];
    const y = a[1];
    const z = a[2];
    return x * x + y * y + z * z;
}
/**
 * Negates the components of a vec3
 *
 * @param {Float32Array} out the receiving vector
 * @param {Float32Array} a vector to negate
 * @returns {Float32Array} out
 */

export function negate(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
}
/**
 * Returns the inverse of the components of a vec3
 *
 * @param {Float32Array} out the receiving vector
 * @param {Float32Array} a vector to invert
 * @returns {Float32Array} out
 */

export function inverse(out, a) {
    out[0] = 1.0 / a[0];
    out[1] = 1.0 / a[1];
    out[2] = 1.0 / a[2];
    return out;
}
/**
 * Normalize a vec3
 *
 * @param {Float32Array} out the receiving vector
 * @param {Float32Array} a vector to normalize
 * @returns {Float32Array} out
 */

export function normalize(out, a) {
    const x = a[0];
    const y = a[1];
    const z = a[2];
    let len = x * x + y * y + z * z;

    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
    }

    out[0] = a[0] * len;
    out[1] = a[1] * len;
    out[2] = a[2] * len;
    return out;
}
/**
 * Calculates the dot product of two vec3's
 *
 * @param {Float32Array} a the first operand
 * @param {Float32Array} b the second operand
 * @returns {Number} dot product of a and b
 */

export function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
/**
 * Computes the cross product of two vec3's
 *
 * @param {Float32Array} out the receiving vector
 * @param {Float32Array} a the first operand
 * @param {Float32Array} b the second operand
 * @returns {Float32Array} out
 */

export function cross(out, a, b) {
    const ax = a[0],
        ay = a[1],
        az = a[2];
    const bx = b[0],
        by = b[1],
        bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
}
/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {Float32Array} out the receiving vector
 * @param {Float32Array} a the first operand
 * @param {Float32Array} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {Float32Array} out
 */

export function lerp(out, a, b, t) {
    const ax = a[0];
    const ay = a[1];
    const az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
}
/**
 * Performs a hermite interpolation with two control points
 *
 * @param {Float32Array} out the receiving vector
 * @param {Float32Array} a the first operand
 * @param {Float32Array} b the second operand
 * @param {Float32Array} c the third operand
 * @param {Float32Array} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {Float32Array} out
 */

export function hermite(out, a, b, c, d, t) {
    const factorTimes2 = t * t;
    const factor1 = factorTimes2 * (2 * t - 3) + 1;
    const factor2 = factorTimes2 * (t - 2) + t;
    const factor3 = factorTimes2 * (t - 1);
    const factor4 = factorTimes2 * (3 - 2 * t);
    out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
    out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
    out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
    return out;
}
/**
 * Performs a bezier interpolation with two control points
 *
 * @param {Float32Array} out the receiving vector
 * @param {Float32Array} a the first operand
 * @param {Float32Array} b the second operand
 * @param {Float32Array} c the third operand
 * @param {Float32Array} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {Float32Array} out
 */

export function bezier(out, a, b, c, d, t) {
    const inverseFactor = 1 - t;
    const inverseFactorTimesTwo = inverseFactor * inverseFactor;
    const factorTimes2 = t * t;
    const factor1 = inverseFactorTimesTwo * inverseFactor;
    const factor2 = 3 * t * inverseFactorTimesTwo;
    const factor3 = 3 * factorTimes2 * inverseFactor;
    const factor4 = factorTimes2 * t;
    out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
    out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
    out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
    return out;
}
/**
 * Generates a random vector with the given scale
 *
 * @param {Float32Array} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {Float32Array} out
 */

export function random(out, scale) {
    scale = scale || 1.0;
    const r = glMatrix.RANDOM() * 2.0 * Math.PI;
    const z = glMatrix.RANDOM() * 2.0 - 1.0;
    const zScale = Math.sqrt(1.0 - z * z) * scale;
    out[0] = Math.cos(r) * zScale;
    out[1] = Math.sin(r) * zScale;
    out[2] = z * scale;
    return out;
}
/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {Float32Array} out the receiving vector
 * @param {Float32Array} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {Float32Array} out
 */

export function transformMat4(out, a, m) {
    const x = a[0],
        y = a[1],
        z = a[2];
    let w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1.0;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
}
/**
 * Transforms the vec3 with a mat3.
 *
 * @param {Float32Array} out the receiving vector
 * @param {Float32Array} a the vector to transform
 * @param {ReadonlyMat3} m the 3x3 matrix to transform with
 * @returns {Float32Array} out
 */

export function transformMat3(out, a, m) {
    const x = a[0],
        y = a[1],
        z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
}
/**
 * Transforms the vec3 with a quat
 * Can also be used for dual quaternions. (Multiply it with the real part)
 *
 * @param {Float32Array} out the receiving vector
 * @param {Float32Array} a the vector to transform
 * @param {ReadonlyQuat} q quaternion to transform with
 * @returns {Float32Array} out
 */

export function transformQuat(out, a, q) {
    // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
    const qx = q[0],
        qy = q[1],
        qz = q[2],
        qw = q[3];
    const x = a[0],
        y = a[1],
        z = a[2]; // var qvec = [qx, qy, qz];
    // var uv = vec3.cross([], qvec, a);

    let uvx = qy * z - qz * y,
        uvy = qz * x - qx * z,
        uvz = qx * y - qy * x; // var uuv = vec3.cross([], qvec, uv);

    let uuvx = qy * uvz - qz * uvy,
        uuvy = qz * uvx - qx * uvz,
        uuvz = qx * uvy - qy * uvx; // vec3.scale(uv, uv, 2 * w);

    const w2 = qw * 2;
    uvx *= w2;
    uvy *= w2;
    uvz *= w2; // vec3.scale(uuv, uuv, 2);

    uuvx *= 2;
    uuvy *= 2;
    uuvz *= 2; // return vec3.add(out, a, vec3.add(out, uv, uuv));

    out[0] = x + uvx + uuvx;
    out[1] = y + uvy + uuvy;
    out[2] = z + uvz + uuvz;
    return out;
}
/**
 * Rotate a 3D vector around the x-axis
 * @param {Float32Array} out The receiving vec3
 * @param {Float32Array} a The vec3 point to rotate
 * @param {Float32Array} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {Float32Array} out
 */

export function rotateX(out, a, b, rad) {
    const p = [],
        r = []; //Translate point to the origin

    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2]; //perform rotation

    r[0] = p[0];
    r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
    r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad); //translate to correct position

    out[0] = r[0] + b[0];
    out[1] = r[1] + b[1];
    out[2] = r[2] + b[2];
    return out;
}
/**
 * Rotate a 3D vector around the y-axis
 * @param {Float32Array} out The receiving vec3
 * @param {Float32Array} a The vec3 point to rotate
 * @param {Float32Array} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {Float32Array} out
 */

export function rotateY(out, a, b, rad) {
    const p = [],
        r = []; //Translate point to the origin

    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2]; //perform rotation

    r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
    r[1] = p[1];
    r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad); //translate to correct position

    out[0] = r[0] + b[0];
    out[1] = r[1] + b[1];
    out[2] = r[2] + b[2];
    return out;
}
/**
 * Rotate a 3D vector around the z-axis
 * @param {Float32Array} out The receiving vec3
 * @param {Float32Array} a The vec3 point to rotate
 * @param {Float32Array} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {Float32Array} out
 */

export function rotateZ(out, a, b, rad) {
    const p = [],
        r = []; //Translate point to the origin

    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2]; //perform rotation

    r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
    r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
    r[2] = p[2]; //translate to correct position

    out[0] = r[0] + b[0];
    out[1] = r[1] + b[1];
    out[2] = r[2] + b[2];
    return out;
}
/**
 * Get the angle between two 3D vectors
 * @param {Float32Array} a The first operand
 * @param {Float32Array} b The second operand
 * @returns {Number} The angle in radians
 */

export function angle(a, b) {
    const ax = a[0],
        ay = a[1],
        az = a[2],
        bx = b[0],
        by = b[1],
        bz = b[2],
        mag1 = Math.sqrt(ax * ax + ay * ay + az * az),
        mag2 = Math.sqrt(bx * bx + by * by + bz * bz),
        mag = mag1 * mag2,
        cosine = mag && dot(a, b) / mag;
    return Math.acos(Math.min(Math.max(cosine, -1), 1));
}
/**
 * Set the components of a vec3 to zero
 *
 * @param {Float32Array} out the receiving vector
 * @returns {Float32Array} out
 */

export function zero(out) {
    out[0] = 0.0;
    out[1] = 0.0;
    out[2] = 0.0;
    return out;
}
/**
 * Returns a string representation of a vector
 *
 * @param {Float32Array} a vector to represent as a string
 * @returns {String} string representation of the vector
 */

export function str(a) {
    return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
}
/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {Float32Array} a The first vector.
 * @param {Float32Array} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

export function exactEquals(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {Float32Array} a The first vector.
 * @param {Float32Array} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

export function equals(a, b) {
    const a0 = a[0],
        a1 = a[1],
        a2 = a[2];
    const b0 = b[0],
        b1 = b[1],
        b2 = b[2];
    return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
    Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
    Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2));
}
/**
 * Alias for {@link vec3.subtract}
 * @function
 */

export var sub = subtract;
/**
 * Alias for {@link vec3.multiply}
 * @function
 */

export var mul = multiply;
/**
 * Alias for {@link vec3.divide}
 * @function
 */

export var div = divide;
/**
 * Alias for {@link vec3.distance}
 * @function
 */

export var dist = distance;
/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */

export var sqrDist = squaredDistance;
/**
 * Alias for {@link vec3.length}
 * @function
 */

export var len = length;
/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */

export var sqrLen = squaredLength;
/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

export var forEach = (function () {
    const vec = create();
    return function (a, stride, offset, count, fn, arg) {
        let i, l;

        if (!stride) {
            stride = 3;
        }

        if (!offset) {
            offset = 0;
        }

        if (count) {
            l = Math.min(count * stride + offset, a.length);
        } else {
            l = a.length;
        }

        for (i = offset; i < l; i += stride) {
            vec[0] = a[i];
            vec[1] = a[i + 1];
            vec[2] = a[i + 2];
            fn(vec, vec, arg);
            a[i] = vec[0];
            a[i + 1] = vec[1];
            a[i + 2] = vec[2];
        }

        return a;
    };
})();
