// computeSphere()   : initial estimate of cylinder
// computeEachPair() : RANSAC
// labelSphere()     : region growing that provides centroids for fitting
// labelFitSphere()  : region growing that provides final answer
// regionGrowSphere(): region growing cylinder
function computeSphere(){
	var front = 0;
	var rear = faceArray.size();
	for(var j = 0;j < rear;j++){
		visited[faceArray.get(0).index] = 1;
	}
	var count = 0;
	var p0, n0, p1, n1;
	var r = 0;
	var p = new THREE.Vector3(0, 0, 0);

	var tempResult, tempR = 0;
	var tempP = new THREE.Vector3(0, 0, 0);

	var minDistance = 100.0;
	for(var m=0; m < faceArray.size()-1; m++)
	{
		for(var n=0; n < faceArray.size()-1; n++)
		{
			if(n > m)
			{
				var u1 = faceArray.get(m);
				var u2 = faceArray.get(n);
				p0 = u1.centroid;
				n0 = u1.normal;
				p1 = u2.centroid;
				n1 = u2.normal;
				tempResult = computeEachPair(p0, n0, p1, n1);
				tempR = tempResult["r"];
				tempP = tempResult["p"];

				var distanceR = 0.0;
				for(var k = 0; k < faceArray.size()-1; k++)
				{
					distanceR = distanceR + Math.abs(tempP.distanceTo(faceArray.get(k).centroid) - tempR);
				}

				if(distanceR < minDistance){
					p.x = tempResult["p"].x;
					p.y = tempResult["p"].y;
					p.z = tempResult["p"].z;
					r = tempResult["r"];
					minDistance = distanceR;
				}
			}
		}					
	}
	var nullVector = new THREE.Vector3();
	result = {para1:p, para2:nullVector, para3:r, geoType:3};
	return result;
}

function computeEachPair(p0, n0, p1, n1)
{
	var position = new THREE.Vector3();
	var radius;
	var EPSILON = 0.000001;
	var t0, t1;

	var b = n0.dot(n1);
	var w = new THREE.Vector3();
	var d = n0.dot(w);
	var e = n1.dot(w);
	var determinant = 1 - b * b;
	w.subVectors(p0, p1);
	if(Math.abs(determinant) < EPSILON){
		t0 = 0;
		if(b > 1){
			t1 = d / b;	
		}
		else{
			t1 = e;
		}
	}else{
		t0 = (b * e - d) / determinant;
		t1 = (e - b * d) / determinant;
	}
	position.addScaledVector(n0, 0.5*t0);
	position.addScaledVector(n1, 0.5*t1);
	position.addScaledVector(p0, 0.5);
	position.addScaledVector(p1, 0.5);
	radius = (p0.distanceTo(position) + p1.distanceTo(position))/2;
	var tempResult = {p:position, r:radius};
	return tempResult;
}

function labelSphere(p, r){
	var front = 0;
	var rear = faceArray.size();
	regionGrowSphere(p, r, front, rear);
	var rgFacesIdx = [];
	for(var j = 0;j<faceArray.size();j++){
		var faceIndex = faceArray.get(j).index*2;
		var faceCentroid = faceAll.get(faceIndex).centroid;
		rgFacesIdx.push([faceCentroid.x, faceCentroid.y, faceCentroid.z]);
	}
	return rgFacesIdx;
}

function labelFitSphere(p, r){
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
	regionGrowSphere(p, r, front, rear);
	var rgFacesIdx = new ArrayList();
	for(var j = 0;j<faceArray.size();j++){
		var faceIndex = faceArray.get(j).index;
		rgFacesIdx.add(faceIndex);
	}
	return rgFacesIdx;
}

function regionGrowSphere(p, r, front, rear) {
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
			var distanceR = vp.distanceTo(p);
			var normalN = new THREE.Vector3();
			normalN.subVectors(vp, p);
			normalN.normalize();
			var temp = vn.dot(normalN);
			var dif_p = Math.abs(distanceR-r);
			var dif_n = Math.abs(temp);
			if( visited[tempVal[i]]!=1 && dif_p<(distThreshold/r) && dif_n>normThreshold )
			{
				rear = rear + 1;
				var tampFace = {};
				faceArray.add(faceAll.get(tempVal[i]*2));
				visited[tempVal[i]] = 1;
			}
		}
	}	
}