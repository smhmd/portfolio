import type { WebGLProgramParametersWithUniforms } from 'three'

import { HALF_PI } from 'src/lib/math'

/**
 * The panorama is projected onto the walls from a point inside the room, not
 * sampled as a skybox, so the horizon stays put as the camera moves.
 * ROTATION is shared with `scene.environmentRotation`.
 */
export const ORIGIN = [-0.25, 2, 0]
export const ROTATION = HALF_PI

/** Projection only — must not be applied to the lighting probe. */
export const SCALE = 0.9

/**
 * The texture is stored as (linear / EXPOSURE) ^ (1 / GAMMA) and undone here;
 * plain 8-bit would flatten the highlights. EXPOSURE 24 is AgX's ceiling.
 * Tagged NoColorSpace, so it looks washed out in a viewer.
 */
export const EXPOSURE = 24
export const GAMMA = 3

const vertexVarying = /* glsl */ `
#include <common>
varying vec3 vWorldPos;
`

const vertexWorldPos = /* glsl */ `
#include <worldpos_vertex>
vWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
`

const fragmentVarying = /* glsl */ `
#include <common>
varying vec3 vWorldPos;
uniform vec3 uOrigin;
uniform float uRotation;
uniform float uScale;
uniform float uExposure;
`

const fragProjection = /* glsl */ `
vec3 d = vWorldPos - uOrigin;
d.y /= uScale;
d = normalize(d);
float c = cos(uRotation), s = sin(uRotation);
d.xz = mat2(c, -s, s, c) * d.xz;
vec2 uv = vec2(
  atan(d.z, d.x) * RECIPROCAL_PI2 + 0.5,
  asin(clamp(d.y, -1., 1.)) * RECIPROCAL_PI + 0.5
);
// atan() tears down the back of the room, so the GPU's derivatives pick the
// smallest mip there. A copy offset half a turn is continuous exactly where
// the first tears; the smaller reading is the honest rate.
vec2 shifted = vec2(fract(uv.x + 0.5), uv.y);
vec2 dxA = dFdx(uv), dyA = dFdy(uv);
vec2 dxB = dFdx(shifted), dyB = dFdy(shifted);
vec2 dx = dot(dxA, dxA) < dot(dxB, dxB) ? dxA : dxB;
vec2 dy = dot(dyA, dyA) < dot(dyB, dyB) ? dyA : dyB;

vec3 stored = textureGrad(map, uv, dx, dy).rgb;

// 8 bits contours on the near-flat gradients once pow() and AgX pull the
// codes apart. Screen space, so the grain sits still under the parallax.
float n1 = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
float n2 = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + 17.0) * 43758.5453);
stored += (n1 - n2) * (0.5 / 255.0);

diffuseColor.rgb *= pow(max(stored, 0.0), vec3(${GAMMA.toFixed(1)})) * uExposure;
`

export function project(shader: WebGLProgramParametersWithUniforms) {
  shader.uniforms.uOrigin = { value: ORIGIN }
  shader.uniforms.uRotation = { value: -ROTATION }
  shader.uniforms.uScale = { value: SCALE }
  shader.uniforms.uExposure = { value: EXPOSURE }

  shader.vertexShader = shader.vertexShader
    .replace('#include <common>', vertexVarying)
    .replace('#include <worldpos_vertex>', vertexWorldPos)

  shader.fragmentShader = shader.fragmentShader
    .replace('#include <common>', fragmentVarying)
    .replace('#include <map_fragment>', fragProjection)
}
