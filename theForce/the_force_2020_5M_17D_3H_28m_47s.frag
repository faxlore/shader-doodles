float PHI =  (pow(5.,0.5)*0.5 + 0.5);
const int steps = 128;
const float smallNumber = 0.001;
const float maxDist = 10.;


float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

vec3 pMod3(inout vec3 p, vec3 size) {
	vec3 c = floor((p + size*0.5)/size);
	p = mod(p + size*0.5, size) - size*0.5;
	return c;
}

vec2 pMod2(inout vec2 p, vec2 size) {
	vec2 c = floor((p + size*0.5)/size);
	p = mod(p + size*0.5,size) - size*0.5;
	return c;
}

float fBlob(vec3 p) { 
	p = abs(p);
	if (p.x < max(p.y, p.z)) p = p.yzx;
	if (p.x < max(p.y, p.z)) p = p.yzx;
	float b = max(max(max(
		dot(p, normalize(vec3(1, 1, 1))),
		dot(p.xz, normalize(vec2(PHI+1., 1)))),
		dot(p.yx, normalize(vec2(1, PHI)))),
		dot(p.xz, normalize(vec2(1, PHI))));
	//float l = length(p/(sin(time + bands.x)));
	float l = length(p);
	return l - 1.5 - 0.2 * (1.5 / 2.)* cos(min(sqrt(1.01 - b / l)*(PI / 0.25), PI));
}


float scene (vec3 position){
    
    pMod3(position,vec3(9.,9.,9.));
    
    float blob = fBlob(vec3(position.x, sin(position.y+time),position.z));
    
    //blob = blob + bands.x;
    
    float ground = position.y 
          + sin(position.x * 10.)/10.
          + cos(position.z)/10.
          + 1.;
    return smin((blob+bands.x),cos(ground),cos(time));
}

 vec3 estimateNormal(vec3 p) {
    vec3 n = vec3(
    scene(vec3(p.x + smallNumber, p.yz)) -
    scene(vec3(p.x - smallNumber, p.yz)),
    scene(vec3(p.x, p.y + smallNumber, p.z)) -
    scene(vec3(p.x, p.y - smallNumber, p.z)),
    scene(vec3(p.xy, p.z + smallNumber)) -
    scene(vec3(p.xy, p.z - smallNumber))
    );
    return normalize(n);
}


vec4 lighting(vec3 pos, vec3 viewDir){
    
    vec3 lightPos = vec3(sin(time),0.,cos(time));
    // light moves left to right
    
    vec3 normal = estimateNormal(pos);
    float diffuse = dot(normal,lightPos);
    
    vec3 reflectDir = reflect(-lightPos, normal); 
    float specularStrength = 3.;
    vec3 specColor = blue;
    float spec = pow( max(dot(viewDir, reflectDir), 0.0), 32.);
    vec3 specular = specularStrength * spec * specColor;
    vec4 ambient = vec4(purple * 0.2,1.0);
    return  vec4(diffuse) + vec4(specular,1.0) + ambient;
}



// diverging from the checkpoint code
vec4 march(vec3 rayOrigin, vec3 dir){
    
    vec3 ray = rayOrigin;
    float dist;
    float totalDist;
    
    for(int i = 0; i < steps; i++){
        dist = scene(ray);
        totalDist += dist;
        
        if(dist < smallNumber){
            return lighting(ray, dir) - vec4(estimateNormal(ray),1.0);
        }
     
        
        ray += dist * dir;
    }
    return vec4(black,1.0);
}

// pos is called uv in the checkpoint
vec3 lookAt(vec2 pos, vec3 camOrigin, vec3 camTarget){
    
    vec3 up = vec3(0,1.0,0);
    vec3 zAxis = normalize(camTarget - camOrigin);
    vec3 xAxis = normalize(cross(up, zAxis));
    vec3 yAxis = normalize(cross(zAxis,xAxis));
    float fov = 2.;
    vec3 dir = normalize((xAxis * pos.x) + (yAxis * pos.y) + (zAxis*fov));
    return dir;
    
}

void main () {
    
    vec2 pos = uv();
    
    vec3 camPos = vec3(tan(time),0.,-6.);
    vec3 rayOrigin = vec3(pos + camPos.xy,camPos.z + 0.5);
    
    vec3 camTarget = vec3(0.,-2.,0.);
    
    vec3 dir = lookAt(pos,camPos,camTarget);
    
    vec4 color = march(camPos, dir);
    
    gl_FragColor = color;
}
