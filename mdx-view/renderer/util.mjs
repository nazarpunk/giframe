export function mat4fromRotationOrigin(out, rotation, origin) {
    const x = rotation[0], y = rotation[1], z = rotation[2], w = rotation[3], x2 = x + x, y2 = y + y, z2 = z + z,
        xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2,
        wz = w * z2, ox = origin[0], oy = origin[1], oz = origin[2];
    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = ox - (out[0] * ox + out[4] * oy + out[8] * oz);
    out[13] = oy - (out[1] * ox + out[5] * oy + out[9] * oz);
    out[14] = oz - (out[2] * ox + out[6] * oy + out[10] * oz);
    out[15] = 1;
    return out;
}

/**
 * Rotate a 3D vector around the z-axis
 * @param {Float32Array} out The receiving vec3
 * @param {Float32Array} a The vec3 point to rotate
 * @param {Number} c The angle of rotation
 * @returns {Float32Array} out
 */
export function vec3RotateZ(out, a, c) {
    out[0] = a[0] * Math.cos(c) - a[1] * Math.sin(c);
    out[1] = a[0] * Math.sin(c) + a[1] * Math.cos(c);
    out[2] = a[2];
    return out;
}

export function rand(from, to) {
    return from + Math.random() * (to - from);
}

export function degToRad(angle) {
    return angle * Math.PI / 180;
}

export function getShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}