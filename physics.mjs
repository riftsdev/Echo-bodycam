// Small deterministic AABB physics layer; all coordinates are in metres.
export function segmentBox(a,b,box){
 let enter=0,exit=1;
 for(const k of ['x','y','z']){const d=b[k]-a[k];if(Math.abs(d)<1e-10){if(a[k]<box.min[k]||a[k]>box.max[k])return null;continue;}
  let t0=(box.min[k]-a[k])/d,t1=(box.max[k]-a[k])/d;if(t0>t1)[t0,t1]=[t1,t0];enter=Math.max(enter,t0);exit=Math.min(exit,t1);if(enter>exit)return null;
 }return enter;
}
export function nearestHit(a,b,boxes){let best=null;for(const box of boxes){const t=segmentBox(a,b,box);if(t!==null&&(!best||t<best.t))best={t,box};}return best;}
export function bounds(position,radius,height){return {min:{x:position.x-radius,y:position.y,z:position.z-radius},max:{x:position.x+radius,y:position.y+height,z:position.z+radius}};}
function overlap(a,b){return a.min.x<b.max.x-1e-7&&a.max.x>b.min.x+1e-7&&a.min.y<b.max.y-1e-7&&a.max.y>b.min.y+1e-7&&a.min.z<b.max.z-1e-7&&a.max.z>b.min.z+1e-7;}
export function stepBody(body,dt,boxes,onPush){
 const steps=Math.max(1,Math.ceil(Math.max(Math.abs(body.velocity.x),Math.abs(body.velocity.y),Math.abs(body.velocity.z))*dt/.12)),h=dt/steps;
 body.grounded=false;
 for(let s=0;s<steps;s++){body.velocity.y-=18*h;
  for(const axis of ['x','z','y']){const delta=body.velocity[axis]*h;if(!delta)continue;body.position[axis]+=delta;
   for(const box of boxes){if(box.owner===body)continue;let bb=bounds(body.position,body.radius,body.height);if(!overlap(bb,box))continue;
    if(axis!=='y'&&box.dynamic&&onPush)onPush(box,axis,body.velocity[axis]);
    if(delta>0)body.position[axis]=box.min[axis]-(axis==='y'?body.height:body.radius);else body.position[axis]=box.max[axis]+(axis==='y'?0:body.radius);
    if(axis==='y'&&delta<0)body.grounded=true;body.velocity[axis]=0;
   }
  }
 }
}
export function gridPath(start,goal,boxes,radius=.4){
 const key=(x,z)=>x+','+z,ok=(x,z)=>x>=-18&&x<=18&&z>=-20&&z<=20&&!boxes.some(b=>b.max.y>.15&&b.min.y<1.75&&x+radius>b.min.x&&x-radius<b.max.x&&z+radius>b.min.z&&z-radius<b.max.z);
 const sx=Math.round(start.x),sz=Math.round(start.z),gx=Math.round(goal.x),gz=Math.round(goal.z),q=[[sx,sz]],parents=new Map([[key(sx,sz),null]]);let best=q[0],score=Infinity;
 for(let i=0;i<q.length;i++){const [x,z]=q[i],d=(gx-x)**2+(gz-z)**2;if(d<score){best=[x,z];score=d;}if(x===gx&&z===gz)break;for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,nz=z+dz,k=key(nx,nz);if(!parents.has(k)&&ok(nx,nz)){parents.set(k,[x,z]);q.push([nx,nz]);}}}
 const path=[];let at=best;while(at&&!(at[0]===sx&&at[1]===sz)){path.push({x:at[0],z:at[1]});at=parents.get(key(...at));}return path.reverse();
}
