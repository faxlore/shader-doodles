const float PHI =  (pow(5.,0.5)*0.5 + 0.5);
const int steps = 128;
const float smallNumber = 0.001;
const float maxDist = 10.;

float sdCone( vec3 p, vec2 c )
{
    // c is the sin/cos of the angle
    vec2 q = vec2( length(p.xz), -p.y );
    float d = length(q-c*max(dot(q,c), 0.0));
    return d * ((q.x*c.y-q.y*c.x<0.0)?-1.0:1.0);
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
	float l = length(p/(sin(time + bands.x)));
	return l - 1.5 - 0.2 * (1.5 / 2.)* cos(min(sqrt(1.01 - b / l)*(PI / 0.25), PI));
}


float scene (vec3 position){
    float blob = fBlob(position);
    
    
    float ground = position.y 
          - sin(time + position.x*10.)/10.
          - cos(time + position.z*10.) /10.
          + .1;
    return min(blob,cos(ground));
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


vec4 lighting(vec3 pos){
    
    vec3 lightPos = vec3(bands.x, 1., bands.y);
    vec3 normal = estimateNormal(pos);
    vec4 mag = vec4(dot(lightPos,normal));
    return mag;
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
            return (lighting(ray) - vec4(estimateNormal(ray),1.0));
        }
        ray += dist * dir;
    }
    //return vec4(black,1.0);
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
    
    vec3 camPos = vec3(0.,0.,-8.);
    vec3 rayOrigin = vec3(pos + camPos.xy,camPos.z + 0.5);
    
    vec3 camTarget = vec3(0.,-2.,0.);
    
    vec3 dir = lookAt(pos,camPos,camTarget);
    
    vec4 color = march(camPos, dir);
    
    gl_FragColor = color;
}
