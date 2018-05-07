// computeCylinder()   : initial estimate of cylinder
// labelCylinder()     : region growing that provides centroids for fitting
// labelFitCylinder()  : region growing that provides final answer
// regionGrowCylinder(): region growing cylinder
function computeCylinder()
{
	var front = 0;
	var rear = faceArray.size();
	for(var j = 0;j < rear;j++){
		visited[faceArray.get(0).index] = 1;
	}
	var u1 = faceArray.get(front);
	var u2 = faceArray.get(front+1);
	p0 = u1.centroid;
	n0 = u1.normal;
	p1 = u2.centroid;
	n1 = u2.normal;

	var direction = new THREE.Vector3();
	var position = new THREE.Vector3();
	var radius;
	var EPSILON = 0.000001;
	var p1_p0 = new THREE.Vector3();
	var w = new THREE.Vector3();
	// the direction of cylinder [d = n0·n1]
	direction.crossVectors(n0, n1);
	direction.normalize();
	// compute cylinder position
	p1_p0.subVectors(p1, p0);
	var temp = p1_p0.dot(direction);
	p1.addScaledVector(direction, -temp);
	w.subVectors(p0, p1);
	var b = n0.dot(n1);
	var d = n0.dot(w);
	var e = n1.dot(w);
	var determinant = 1-b*b;
	var t0, t1;
	if(determinant < EPSILON){
		t0 = 0;
		if(b > 1){
			t1 = d/b;
		}else{
			t1 = e;
		}
	}else{
		t0 = (b*e - d)/determinant;
		t1 = (e - b*d)/determinant;
	}
	position.addScaledVector(n0, 0.5*t0);
	position.addScaledVector(n1, 0.5*t1);
	position.addScaledVector(p0, 0.5);
	position.addScaledVector(p1, 0.5);

	radius = (p0.distanceTo(position) + p1.distanceTo(position))/2;

	result = {para1:position, para2:direction, para3:radius, geoType:1};
	return result;
}

function labelClinder(d, p, r){
	var front = 0;
	var rear = faceArray.size();
	regionGrowCylinder(d, p, r, front, rear);
	var rgFacesInx = [];
	for(var j = 0;j<faceArray.size();j++){
		var faceIndex = faceArray.get(j).index*2;
		var faceCentroid = faceAll.get(faceIndex).centroid;
		rgFacesInx.push([faceCentroid.x, faceCentroid.y, faceCentroid.z]);
	}
	return rgFacesInx;
}

function labelFitClinder(d, p, r){
	var tmpFaceArray = new ArrayList();
	for(var j = 0;j < 2; j++)
	{
		tmpFaceArray.add(faceArray.get(j));
	}
	faceArray.clear();
	visited = [];
	faceArray = tmpFaceArray;
	var front = 0;
	var rear = faceArray.size();
	regionGrowCylinder(d, p, r, front, rear);
	var rgFacesIdx = new ArrayList();
	for(var j = 0;j<faceArray.size();j++){
		var faceIndex = faceArray.get(j).index;
		rgFacesIdx.add(faceIndex);
	}
	return rgFacesIdx;
}

function regionGrowCylinder(d, p, r, front, rear) {
	while(front < rear)
	{
		var tempKey;
		var tempVal;
		var u = faceArray.get(front);
		front = front+1;
		tempKey = u.index;
		tempVal = scene.children[3].NeighborMap[tempKey];

		for(var i = 0;i < tempVal.length;i++)
		{
			var v = faceAll.get(tempVal[i]*2);
			var vp = v.centroid;
			var vn = v.normal;

			var q = new THREE.Vector3();
			var tempVP = new THREE.Vector3(p.x, p.y, p.z);
			q.subVectors(vp, p);
			var temp = q.dot(d);
			tempVP.addScaledVector(d,temp);
			var distTemp = new THREE.Vector3(vp.x-tempVP.x, vp.y-tempVP.y, vp.z-tempVP.z);
			var distanceR = Math.sqrt(distTemp.x*distTemp.x + distTemp.y*distTemp.y + distTemp.z*distTemp.z);
			var normalN = new THREE.Vector3();
			normalN.subVectors(tempVP, vp);
			normalN.normalize();
			var dif_p = Math.abs(distanceR-r);
			var dif_n = Math.abs(normalN.dot(vn));
			if( visited[tempVal[i]]!=1 && dif_p<distThreshold && dif_n>normThreshold )
			{
				rear = rear + 1;
				faceArray.add(faceAll.get(tempVal[i]*2));
				visited[tempVal[i]] = 1;
			}
		}
	}
}