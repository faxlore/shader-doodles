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

float sdEquilateralTriangle( in vec2 p )
{
    const float k = sqrt(3.0);
    
    p.x = abs(p.x) - 1.0;
    p.y = p.y + 1.0/k;
    if( p.x + k*p.y > 0.0 ) p = vec2( p.x - k*p.y, -k*p.x - p.y )/2.0;
    p.x -= clamp( p.x, -2.0, 0.0 );
    return -length(p)*sign(p.y);
}

vec3 cosPalette( float t, vec3 a, vec3 b, vec3 c, vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

// Repeat in two dimensions
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
    vec2 position2 = uv;
    
    position = position + vec2(tan(uv.x+spectrum.y),cos(uv-(time*.3)));
    pMod2(position, vec2(((uv.y) * 0.5)-(spectrum.y * 0.1)));
    float seed = random(vec2(uv.x,uv.y));
 
    vec3 a = vec3(0.5,0.5,0.5);
    vec3 b = vec3(0.5,0.5,0.5);
    vec3 c = vec3(2.0,1.0,0.0);
    vec3 d = vec3(0.50,0.2,0.25);
    
    //(uv.x + cos(time*.05))
    vec3 col = cosPalette((cos(time - uv.y) + sin(time + uv.x)) * .4,a,b,c,d);
    // we stract .5 from a to normalize brightness when combining the two colors
    //(cos(time + uv.y) - sin(time - uv.x)) * .4
    vec3 col2 = cosPalette((cos(time + uv.y) - sin(time - uv.x)) * .4,a-.5,b,c,d);

    float shape = sdEquilateralTriangle(position / .3);
    
    
    vec3 colFinal = (col+col2);
    vec3 final = vec3(shape + colFinal);
     
    gl_FragColor = vec4(vec3(final),
        1.0);
}
