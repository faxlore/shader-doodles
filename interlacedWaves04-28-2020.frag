#ifdef GL_ES
precision highp float;
#endif

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

float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);
}

vec3 cosPalette( float t, vec3 a, vec3 b, vec3 c, vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

vec2 pMod2(inout vec2 p, vec2 size) {
    vec2 c = floor((p + size*0.5)/size);
    p = mod(p + size*0.5,size) - size*0.5;
    return c;
}

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main(void)
{

    vec2 uv = -1. + 2. * v_texcoord;
    vec2 position = uv;
    
    //everybody likes to wiggle
    //position = position + vec2(atan(cos(time)));
    
    if(abs(position.x) < random(position))
    {
        pMod2(position,vec2(sin((uv.y + time) * .3) * .5));
    }else{   
        pMod2(position,vec2(cos((uv.x+time) * .3) * .5));
    }
    
    float shape = sdBox(position,vec2(.1));
    
    vec3 a = vec3(0.5,0.5,0.5);
    vec3 b = vec3(0.5,0.5,0.5);
    vec3 c = vec3(1.0,1.0,1.0);
    vec3 d = vec3(0.0,0.10,0.2);
    
    //(position.x + time) * .1
    vec3 col = cosPalette((position.x + time) * .2,a,b,c,d);
    
    vec3 final = vec3(shape + col); //+ col);

    gl_FragColor = vec4(final,1.0);
}
