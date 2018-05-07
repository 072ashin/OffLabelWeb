// computePlane()   : initial estimate of plane
// labelPlane()     : region growing that provides centroids for fitting
// labelFitPlane()  : region growing that provides final answer
// regionGrowPlane(): region growing plane
function computePlane(){
	var front = 0;
	var rear = faceArray.size();
	var p0 = new THREE.Vector3();
	var n0 = new THREE.Vector3();
	for(var j = 0;j < rear;j++){
		visited[faceArray.get(j).index] = 1;
		p0.add(faceArray.get(j).centroid);
		n0.add(faceArray.get(j).normal);
	}
	p0.divideScalar(rear);
	n0.divideScalar(rear);
	n0.normalize();
	result = {para1:p0, para2:n0, para3:100.0, geoType:0};
	return result;
}

function computeExceptPlane(){
	var front = 0;
	var rear = faceArray.size();
	var p0 = new THREE.Vector3();
	var n0 = new THREE.Vector3();

	for(var j = 0; j < rear; j++){
		p0.add(faceArray.get(j).centroid);
		n0.add(faceArray.get(j).normal);
	}
	p0.divideScalar(rear);
	n0.divideScalar(rear);
	n0.normalize();
	result = {para1:p0, para2:n0, para3:100.0, geoType:0};
	return result;
}

function labelPlane(p0, n0){
	var front = 0;
	var rear = faceArray.size();
	regionGrowPlane(p0, n0, front, rear);
	var rgFacesCentroid = [];
	for(var j = 0;j<faceArray.size();j++){
		var faceIndex = faceArray.get(j).index*2;
		var faceCentroid = faceAll.get(faceIndex).centroid;
		rgFacesCentroid.push([faceCentroid.x, faceCentroid.y, faceCentroid.z]);
	}
	return rgFacesCentroid;
}

function labelFitPlane(p0, n0)
{
	// keep 
	var tmpFaceArray = new ArrayList();
	for(var j = 0;j < 1; j++)
	{
		tmpFaceArray.add(faceArray.get(j));
	}
	faceArray.clear();
	visited = [];
	faceArray = tmpFaceArray;
	var front = 0;
	var rear = faceArray.size();
	regionGrowPlane(p0, n0, front, rear);
	var rgFacesIdx = new ArrayList();
	for(var j = 0;j<faceArray.size();j++){
		var faceIndex = faceArray.get(j).index;
		rgFacesIdx.add(faceIndex);
	}
	return rgFacesIdx;
}

function regionGrowPlane(p0, n0, front, rear) {
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
			var p = v.centroid;
			var n = v.normal;
			var tempP = new THREE.Vector3();
			tempP.subVectors(p, p0);
			var difP = tempP.dot(n0);
			var difN = n.dot(n0);
			if( visited[tempVal[i]]!=1 && difP<distThreshold && difN>normThreshold )
			{
				rear = rear + 1;
				faceArray.add(faceAll.get(tempVal[i]*2));
				visited[tempVal[i]] = 1;
			}
		}
	}
}