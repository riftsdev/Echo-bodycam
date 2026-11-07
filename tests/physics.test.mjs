import {test} from 'node:test';
import assert from 'node:assert/strict';
import {segmentBox,nearestHit,stepBody,gridPath} from '../physics.mjs';
const box=(x0,y0,z0,x1,y1,z1)=>({min:{x:x0,y:y0,z:z0},max:{x:x1,y:y1,z:z1}});
const wall=box(-2,0,-.2,2,4,.2),floor=box(-30,-1,-30,30,0,30);
const actor=(x=0,y=0,z=0)=>({position:{x,y,z},velocity:{x:0,y:0,z:0},radius:.32,height:1.72,grounded:true});
test('enemy bullet hits wall before player, even across a long frame',()=>{
 const player=box(-.3,0,4,.3,1.72,4.6),a={x:0,y:1.5,z:-5},b={x:0,y:1.5,z:8};
 assert.equal(nearestHit(a,b,[player,wall]).box,wall);
 assert.equal(nearestHit(b,a,[player,wall]).box,player);
});
test('wall blocks bullets from both faces and from inside collider',()=>{
 assert.notEqual(segmentBox({x:0,y:1,z:-3},{x:0,y:1,z:3},wall),null);
 assert.notEqual(segmentBox({x:0,y:1,z:3},{x:0,y:1,z:-3},wall),null);
 assert.equal(segmentBox({x:0,y:1,z:0},{x:0,y:1,z:3},wall),0);
});
test('parallel rays, finite range and open door gaps',()=>{
 assert.equal(segmentBox({x:3,y:1,z:-3},{x:3,y:1,z:3},wall),null);
 assert.equal(segmentBox({x:0,y:1,z:-3},{x:0,y:1,z:-1},wall),null);
 const left=box(-4,0,-.2,-1,4,.2),right=box(1,0,-.2,4,4,.2);
 assert.equal(nearestHit({x:0,y:1,z:-3},{x:0,y:1,z:3},[left,right]),null);
});
test('gravity lands and jump returns to the floor',()=>{
 const b=actor(0,3,0);b.grounded=false;
 for(let i=0;i<120;i++)stepBody(b,1/60,[floor]);assert.ok(Math.abs(b.position.y)<1e-6);assert.equal(b.grounded,true);
 b.velocity.y=6;stepBody(b,1/60,[floor]);assert.ok(b.position.y>0);
 for(let i=0;i<120;i++)stepBody(b,1/60,[floor]);assert.ok(Math.abs(b.position.y)<1e-6);
});
test('fast player cannot tunnel through a thin wall',()=>{
 const b=actor(0,0,-3);b.velocity.z=100;stepBody(b,.1,[floor,wall]);assert.ok(b.position.z<=-.52+1e-6);
});
test('jump lands on a crate and ceiling blocks upward motion',()=>{
 const crate=box(-1,0,-1,1,1,1),b=actor(0,3,0);for(let i=0;i<80;i++)stepBody(b,1/60,[floor,crate]);assert.ok(Math.abs(b.position.y-1)<1e-6);
 const ceiling=box(-3,2,-3,3,3,3),c=actor();c.velocity.y=6;for(let i=0;i<10;i++)stepBody(c,1/60,[floor,ceiling]);assert.ok(c.position.y+c.height<=2+1e-6);
});
test('navigation routes around cover, never through it',()=>{
 const obstacle=box(-1.4,0,-1.4,1.4,3,1.4),path=gridPath({x:0,z:-4},{x:0,z:4},[obstacle]);assert.ok(path.length>8);
 for(const p of path)assert.ok(!(Math.abs(p.x)<1.8&&Math.abs(p.z)<1.8));assert.deepEqual(path.at(-1),{x:0,z:4});
});
test('push callback applies only to dynamic crates; crates do not collide with themselves',()=>{
 const b=actor(0,0,-2),crate=box(-.5,0,-.5,.5,1,.5);crate.dynamic=true;let push=0;b.velocity.z=6;for(let i=0;i<30;i++)stepBody(b,1/60,[floor,crate],()=>push++);assert.ok(push>0);assert.ok(b.position.z<=-.82+1e-6);
 const c=actor();const self=box(-.5,0,-.5,.5,1,.5);self.owner=c;c.velocity.x=1;stepBody(c,1/60,[floor,self]);assert.ok(c.position.x>0);
});
