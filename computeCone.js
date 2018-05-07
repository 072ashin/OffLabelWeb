// function computeCone(){
// 	var front = 0;
// 	var rear = faceArray.size();
// 	for(var j = 0;j < rear;j++){
// 		visited[faceArray.get(j).index] = 1;
// 	}
// 	var u1 = faceArray.get(0);
// 	var u2 = faceArray.get(1);
// 	var u3 = faceArray.get(2);
// 	var result = estimateCone(u1, u2, u3);
// 	return result;
// }

function computeCone(){
	var front = 0;
	var rear = faceArray.size();
	var ogVisit = new Array(totalFaceNum);
	var ogFaceArray = new ArrayList();
	tmpArr = [];
	for(var j = 0;j < rear;j++){
		visited[faceArray.get(0).index] = 1;
		ogVisit[faceArray.get(0).index] = 1;
		ogFaceArray.add(faceArray.get(j));
		tmpArr.push(j);
	}
	// for each set of triangles
	groups = groupSplit( tmpArr , 3 );

	var result = {};
	var maxRgFaces = 0;
	for(var i = 0; i < groups.length ; i++) {
		u1 = faceArray.get(groups[i][0]);
		u2 = faceArray.get(groups[i][1]);
		u3 = faceArray.get(groups[i][2]);
		var tmpResult = estimateCone(u1, u2, u3);
		reagionGrowConeRANSAC(ogFaceArray, ogVisit, tmpResult["para1"], tmpResult["para2"], tmpResult["para3"]);

		if(maxRgFaces < ogFaceArray.size() ) {
			result = tmpResult;
			maxRgFaces = ogFaceArray.size();
		}

		ogFaceArray = faceArray;
		ogVisit = visited;
	}
	console.log(faceArray);
	return result;
}

function estimateCone(u1, u2, u3) {
	p0 = u1.centroid; n0 = u1.normal;
	p1 = u2.centroid; n1 = u2.normal;
	p2 = u3.centroid; n2 = u3.normal;
	var cone_apex = new THREE.Vector3();
	var cone_axis = new THREE.Vector3();
	var cone_angle = 0;
	// compute apex
	var tempM0 = new THREE.Matrix3();
	var tempV0 = new THREE.Vector3();
	var invTempM0 = new Array();
	tempM0.set(n0.x, n0.y, n0.z, n1.x, n1.y, n1.z, n2.x, n2.y, n2.z);
	tempM0.getInverse (tempM0);
	tempM0.transposeIntoArray (invTempM0);
	var vt0 = new THREE.Vector3(invTempM0[0], invTempM0[1], invTempM0[2]);
	var vt1 = new THREE.Vector3(invTempM0[3], invTempM0[4], invTempM0[5]);
	var vt2 = new THREE.Vector3(invTempM0[6], invTempM0[7], invTempM0[8]);

	tempV0.x = n0.dot(p0); 
	tempV0.y = n1.dot(p1); 
	tempV0.z = n2.dot(p2);

	cone_apex.x = vt0.dot(tempV0); 
	cone_apex.y = vt1.dot(tempV0); 
	cone_apex.z = vt2.dot(tempV0);

	p0.subVectors(p0, cone_apex); p1.subVectors(p1, cone_apex); p2.subVectors(p2, cone_apex);
	p0.normalize(); p1.normalize(); p2.normalize();
	n0.addVectors(cone_apex, p0); n1.addVectors(cone_apex, p1); n2.addVectors(cone_apex, p2);

	var temp0 =  new THREE.Vector3();
	var temp1 =  new THREE.Vector3();
	temp0.subVectors(n0, n1);
	temp1.subVectors(n0, n2);
	cone_axis.crossVectors(temp0, temp1);
	cone_axis.normalize();
				// compute angle
	var t1 = Math.acos(Math.abs(cone_axis.dot(p0)));
	var t2 = Math.acos(Math.abs(cone_axis.dot(p1)));
	var t3 = Math.acos(Math.abs(cone_axis.dot(p2)));
	cone_angle = (t1 + t2 + t3)/3;

	result = {para1:cone_axis, para2:cone_apex, para3:cone_angle, geoType:2};
	return result;
}

function labelCone(axis, apex, angle){
	var front = 0;
	var rear = faceArray.size();
	reagionGrowCone(front, rear, axis, apex, angle);

	var rgFacesInx = [];
	for(var j = 0;j<faceArray.size();j++){
		var faceIndex = faceArray.get(j).index*2;
		var faceCentroid = faceAll.get(faceIndex).centroid;
		rgFacesInx.push([faceCentroid.x, faceCentroid.y, faceCentroid.z]);
	}
	return rgFacesInx;
}

function labelFitCone(axis, apex, angle){
	var front = 0;
	var rear = 3;

	var tmpFaceArray = new ArrayList();
	for(var j = 0;j < faceArray.size(); j++)
	{
		tmpFaceArray.add(faceArray.get(j));
	}
	faceArray.clear();
	visited = [];
	faceArray = tmpFaceArray;

	reagionGrowFit(front, rear, axis, apex, angle);

	var rgFacesIdx = new ArrayList();
	for(var j = 0;j<faceArray.size();j++){
		var faceIndex = faceArray.get(j).index;
		rgFacesIdx.add(faceIndex);
	}
	return rgFacesIdx;
}


function reagionGrowCone(front, rear, axis, apex, angle) {
	var err1 = 0;
	var err2 = 0;
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
			error = coneError(v, axis, apex, angle);
			err1 += error["dist_err"];
			err2 += error["norm_err"];
			if( visited[tempVal[i]]!=1 && error["dist_err"]<distThreshold && error["norm_err"]>normThreshold )
			{
				rear = rear + 1;
				faceArray.add(faceAll.get(tempVal[i]*2));
				visited[tempVal[i]] = 1;
			}
		}
	}
	console.log(err1);
	console.log(err2);
}

function reagionGrowFit(front, rear, axis, apex, angle) {
	var err1 = 0;
	var err2 = 0;
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
			error = coneError(v, axis, apex, angle);
			err1 += error["dist_err"];
			err2 += error["norm_err"];
			if( visited[tempVal[i]]!=1 && error["dist_err"]<distThreshold && error["norm_err"]>normThreshold )
			{
				visited[tempVal[i]] = 1;
			}
		}
	}
	console.log(err1);
	console.log(err2);
}

function reagionGrowConeRANSAC(ogFaceArray, ogVisit, axis, apex, angle) {
	var front = 0;
	var rear = ogFaceArray.size();
	while(front < rear)
	{
		var tempKey;
		var tempVal;
		var u = ogFaceArray.get(front);
		front = front+1;
		tempKey = u.index;
		tempVal = scene.children[3].NeighborMap[tempKey];

		for(var i = 0;i < tempVal.length;i++)
		{
			var v = faceAll.get(tempVal[i]*2);
			error = coneError(v, axis, apex, angle);
			if( ogVisit[tempVal[i]]!=1 && error["dist_err"]<distThreshold && error["norm_err"]>normThreshold )
			{
				rear = rear + 1;
				ogFaceArray.add(faceAll.get(tempVal[i]*2));
				ogVisit[tempVal[i]] = 1;
			}
		}
	}
}

function coneError(v, axis, apex, angle) {
	var vp = v.centroid;
	var vn = v.normal;
	var tp0 = new THREE.Vector3();
	var tmpV = new THREE.Vector3();
	var tmpV1 = new THREE.Vector3();

	tmpV.subVectors(vp, apex);
	tp0.addScaledVector(axis, axis.dot(tmpV));
	tp0.addVectors(apex, tp0);

	tmpV.subVectors(vp, tp0);
	var p0p1 = Math.sqrt(tmpV.x*tmpV.x + tmpV.y*tmpV.y + tmpV.z*tmpV.z) * Math.tan(angle);

	var tp1 = new THREE.Vector3();
	tp1.addScaledVector(axis, p0p1);
	tp1.addVectors(tp0, tp1);

	var temp = new THREE.Vector3();
	tmpV.subVectors(tp1, tp0);
	tmpV1.subVectors(apex, tp0);
	var idx = tmpV.dot(tmpV1);
	if(idx > 0) {
		tp1 = tp0.subVectors(tp0, temp.addScaledVector(axis, p0p1));
	}

	var cone_normal = new THREE.Vector3();
	cone_normal.subVectors(vp, tp1);
	cone_normal.normalize();
				
	tmpV.subVectors(vp, apex);
	tmpV1.copy (tmpV)
	tmpV1.cross(axis);
	var tmp = Math.sqrt(tmpV1.x*tmpV1.x + tmpV1.y*tmpV1.y + tmpV1.z*tmpV1.z)* Math.cos(angle);
	var tmp1 = Math.abs(tmpV.dot(axis)) * Math.sin(angle);

	var dif_n = Math.abs(cone_normal.dot(vn.normalize()));
	var dif_p = Math.abs(tmp - tmp1);
	var error = {"norm_err":dif_n, "dist_err":dif_p};
	return error;
}

 function groupSplit ( arr , size ) {
   var r = []; // result

   function _ ( t , a , n ) { // tempArr, arr, num
     if (n === 0 ) {
       r[ r . length ] = t;
       return ;
     }
     for ( var i = 0 , l = a . length - n; i <= l; i ++ ) {
       var b = t . slice ();
       b . push (a[i]);
       _ (b, a . slice (i + 1 ), n - 1 );
     }
   }
   _ ([], arr, size);
   return r;
 } 