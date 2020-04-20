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

float sdCircle( vec2 p, float r )
{
  return length(p) - r;
}

vec3 cosPalette( float t, vec3 a, vec3 b, vec3 c, vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
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
    //position.x = resolution.x/resolution.y;

    
    position = position * 2;
    position = position - vec2(cos(time + (spectrum.x *10)),sin(time + (spectrum.z)));

    float shape = sdCircle(position, sin(time));
        
    vec3 a = vec3(.5,.5,.5);
    vec3 b = vec3(random(sin(uv)),random(sin(uv)),random(sin(uv)));
    b.g = 0.5;
    b.b= 0.5;
    vec3 c = vec3(.5,.5,.5);
    vec3 d = vec3(.0,.33,.67);
    
    vec3 color = cosPalette(time, a, b, c, d);
    
    vec3 final = vec3(tan(shape),tan(shape),sin(shape)) + color; 
    
    gl_FragColor = vec4(tan(cos(final)), 1.0);
        
        
        
        //abs(sin(cos(time+3.*uv.y)*2.*uv.x+time)),
        //abs(cos(sin(time+2.*uv.x)*3.*uv.y+time)),
        //spectrum.x * 100.,
        //1.0);
}
