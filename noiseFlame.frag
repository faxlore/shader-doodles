#ifdef GL_ES
precision highp float;
#endif

// @misteralvar - twitter 

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform vec3 spectrum;

uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;
uniform sampler2D prevFrame;
uniform sampler2D prevPass;

varying vec3 v_normal;
varying vec2 v_texcoord;

vec3 cosPalette( float t, vec3 a, vec3 b, vec3 c, vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d));
}

float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);
}

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}


void main(void)
{
    vec2 uv = -1. + 2. * v_texcoord;

    float shape = sdBox(sin(time)-uv, vec2(-sin(uv.y),-sin(uv.y)));
    vec2 randomSeedlol = vec2(uv.x-sin(time),uv.y+sin(time));
    float randomlol = random(randomSeedlol);

    //.5,.5,.5
    vec3 a = vec3(.1,.1,.1);
    vec3 b = vec3(.5,.5,.5);
    //2.0,1.0,0.0
    vec3 c = vec3(randomlol, 1.0,0.0);
    vec3 d = vec3(.5,.2,.25);
    //.5,.2,.25
    
    vec3 color = cosPalette((cos((time-uv.y)) + (spectrum.x * 1)),a,b,c,d);
    
    vec3 final = vec3(cos(shape) + color);
           
    
    gl_FragColor = vec4(
        final,
        1.0);
}
