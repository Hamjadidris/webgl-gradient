precision mediump float;

#define PI 3.1415926535897932384626433832795

uniform float uContainerWidth;
uniform float uContainerHeight;
uniform float uTime;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uLength;
uniform float uBlur;
uniform float uFlow;
uniform vec4 uColorA;
uniform vec4 uColorB;
uniform vec4 uColorC;

const float Y_SCALE = 3.0;

#include "lygia/generative/snoise.glsl"

float smoothstep(float t) {
    return t * t * t * (t * (6.0 * t - 15.0) + 10.0);
}

vec4 calc_color(float t) {
    // vec4 background_color = vec4(0.102, 0.208, 0.761, 1.0);
    // vec4 wave1_color = vec4(0.094, 0.502, 0.910, 1.0);
    // vec4 wave2_color = vec4(0.0, 0.0, 0.0, 1.0);
    vec4 background_color = uColorA;
    vec4 wave1_color = uColorB;
    vec4 wave2_color = uColorC;

    vec4 color = background_color;
    color = mix(color, wave1_color, min(1.0, t * 2.0));
    color = mix(color, wave2_color, max(0.0, (t - 0.5) * 2.0));
    return color;
}

float calc_blur(float offset) {
    float x = gl_FragCoord.x;

    const float L = 0.0018;
    const float S = 0.1;
    const float F = 0.034;

    float time = uTime + offset;

    float noise = snoise(vec2(x * L + F * time, time * S));
    float t = (noise + 1.0) / 2.0;
    t = pow(t, 2.5);

    float blur = mix(1.0, uBlur, t);
    return blur;
}

float wave_noise(float offset) {
    float x = gl_FragCoord.x;

    float time = uTime + offset;
    float noise = 0.0;
    noise += snoise(vec2(x * (uLength / 1.00) + (uFlow * time), time * uSpeed * 1.00)) * uAmplitude * 0.30;
    noise += snoise(vec2(x * (uLength / 0.60) + (uFlow * time), time * uSpeed * 0.85)) * uAmplitude * 0.26;
    noise += snoise(vec2(x * (uLength / 0.4) + (uFlow * time), time * uSpeed * 0.70)) * uAmplitude * 0.22;

    float lightness = clamp(noise, 0.0, 1.0);

    return noise;
}

float wave_alpha(float Y, float wave_height) {
    float y = gl_FragCoord.y;
    float offset = Y * wave_height;

    float blur = calc_blur(offset);

    float wave_y = Y + wave_noise(offset) * wave_height;
    float dist = wave_y - y;

    float alpha = clamp(0.5 + dist / blur, 0.0, 1.0);
    alpha = smoothstep(alpha);

    return alpha;
}

float background_noise(float offset) {
    const float L = 0.0015;
    const float S = 0.13;
    const float Y_SCALE = 3.0;

    float time = uTime + offset;

    float x = gl_FragCoord.x;
    float y = gl_FragCoord.y * Y_SCALE;

    float noise = 0.5;
    noise += snoise(vec3((x * L * 1.0) + uFlow, y * L * 1.00, time * S)) * 0.30;
    noise += snoise(vec3((x * L * 0.6) + -uFlow, y * L * 0.85, time * S)) * 0.26;
    noise += snoise(vec3((x * L * 0.4) + uFlow, y * L * 0.70, time * S)) * 0.22;

    return clamp(noise, 0.0, 1.0);
}

void main() {
    float MID_Y = uContainerHeight * 0.5;

    float WAVE1_HEIGHT = 6.0;
    float WAVE2_HEIGHT = 8.0;
    float WAVE1_Y = 0.80 * uContainerHeight;
    float WAVE2_Y = 0.35 * uContainerHeight;

    float wave1_alpha = wave_alpha(WAVE1_Y, WAVE1_HEIGHT);
    float wave2_alpha = wave_alpha(WAVE2_Y, WAVE2_HEIGHT);

    float bg_lightness = background_noise(0.0);
    float w1_lightness = background_noise(200.0);
    float w2_lightness = background_noise(400.0);

    float lightness = bg_lightness;
    lightness = mix(lightness, w1_lightness, wave1_alpha);
    lightness = mix(lightness, w2_lightness, wave2_alpha);

    gl_FragColor = calc_color(lightness);
}
