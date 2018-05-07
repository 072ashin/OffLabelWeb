/**
 * @author ctyeung
 */

THREE.OFFLoader = function () {};

THREE.OFFLoader.prototype = new THREE.Loader();
THREE.OFFLoader.prototype.constructor = THREE.OFFLoader;

THREE.OFFLoader.prototype.load = function ( url, callback ) {

	var that = this;
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function () {

		if ( xhr.readyState == 4 ) {

			if ( xhr.status == 200 || xhr.status == 0 ) {

				callback( that.parse( xhr.responseText ) );

			} else {

				console.error( 'THREE.OFFLoader: Couldn\'t load ' + url + ' (' + xhr.status + ')' );

			}

		}

	};

	xhr.open( "GET", url, true );
	xhr.send( null );

};

THREE.OFFLoader.prototype.parse = function ( data ) {

	function vector( x, y, z ) {

		return new THREE.Vector3( x, y, z );

	}

	function uv( u, v ) {

		return new THREE.UV( u, 1.0 - v );

	}

	function face3( a, b, c, normals ) {

		return new THREE.Face3( a, b, c, normals );

	}
	
	// function face4( a, b, c, d, normals ) {

	// 	return new THREE.Face4( a, b, c, d, normals );

	// }
	
	// // really need tessellation for N vertexies
	// // will have to learn to use one build-in or write my own
	// function face5( a, b, c, d, e, n ) {

	// 	return new THREE.Face4( a, b, c, d, [n, n, n, n] );
	// 	return new THREE.Face3( d, e, a, [n,n,n] );
	// }
	
	function computeCentroid(v1, v2, v3, scalar, v4) {
		// cross product - calculate 2 vectors, then cross
		var vec = new THREE.Vector3((v1.x + v2.x + v3.x)/(3), (v1.y + v2.y + v3.y)/(3), (v1.z + v2.z + v3.z)/(3));
		
		return vec;

	}

	function sortNumber(a,b){
			return a - b;
	}

	var group = new THREE.Object3D();
	var vertices = [];
	var normals = [];
	var uvs = [];

	var centriod = [];
	var faceTemp = [];

	var pattern;
	var result;

	data = data.split('\n');
	
	// 1st line: OFF
	pattern = /OFF/g;
	result=pattern.exec(data[0]);
	if(result==null) 
		return null;
	
	// 2nd line: vertex_count face_count edge_count
	var str = data[1].toString().replace('\r', '');
	var listCount = str.split(' ');
	var countVertex = parseInt(listCount[0]);
	var countFace = parseInt(listCount[1]);
	var countEdge = parseInt(listCount[2]);
	
	var total = 0;
	var max = 0;
	
	var max = 0;
	var min = 0;
	var meanX = 0;
	var meanY = 0;
	var meanZ = 0;
	// list of vertex
	for(var cv = 0; cv<countVertex; cv++) {
		var str = data[cv+2].toString().replace('\r', '');
		var listVertex = str.split(' ');
		vertices.push( vector(
			parseFloat( listVertex[ 0 ] ),
			parseFloat( listVertex[ 1 ] ),
			parseFloat( listVertex[ 2 ] )
		) );
		meanX = meanX + vertices[cv].x;
		meanY = meanY + vertices[cv].y;
		meanZ = meanZ + vertices[cv].z;
		var arr1 = [vertices[cv].x, vertices[cv].y, vertices[cv].z];
		arr1.sort(sortNumber);
		if(arr1[2] > max){
			max = arr1[2];
		}
		if(arr1[0] < min){
			min = arr1[0];
		}	
	}

	meanX = meanX / countVertex;
	meanY = meanY / countVertex;
	meanZ = meanZ / countVertex;

	var scalar = (max - min)*1.1;

	for(var i = 0; i < countVertex; i++){
		vertices[i].x = (vertices[i].x - meanX) / scalar;
		vertices[i].y = (vertices[i].y - meanY) / scalar;
		vertices[i].z = (vertices[i].z - meanZ) / scalar;
	}



	var map = {};
	// list of faces
	for(var cf = 0; cf<countFace; cf++) {

		var str = data[cf+countVertex+2].toString().replace('\r', '');
		var listFace = str.split(' ');
		
		var geometry = new THREE.Geometry();
		geometry.vertices = vertices;
		
		var numFace = parseInt(listFace[0]);
		var f;
		var v1 = parseInt( listFace[ 1 ]);
		var v2 = parseInt( listFace[ 2 ]);
		var v3 = parseInt( listFace[ 3 ]);

		var arr = [v1.toString(), v2.toString(), v3.toString()];

		arr.sort(sortNumber);
		//console.log(arr);

		var index1 = (arr[0] * countVertex + arr[1]).toString();
		var index2 = (arr[1] * countVertex + arr[2]).toString();
		var index3 = (arr[0] * countVertex + arr[2]).toString();

		var index = [index1, index2, index3];
		//console.log(index);
		
		
		faceTemp.push(arr);

		if(typeof map[index1] === "undefined"){
			//map[index1] = [[cf,v1,v2,v3]];
			map[index1] = [cf];
		} else{
			//map[index1].push([cf,v1,v2,v3]);
			map[index1].push(cf);
		}

		if(typeof map[index2] === "undefined"){
			//map[index2] = [[cf,v1,v2,v3]];
			map[index2] = [cf];
		} else{
			//map[index2].push([cf,v1,v2,v3]);
			map[index2].push(cf);
		}

		if(typeof map[index3] === "undefined"){
			//map[index3] = [[cf,v1,v2,v3]];
			map[index3] = [cf];
		} else{
			//map[index3].push([cf,v1,v2,v3]);
			map[index3].push(cf);
		}
		

		
		// switch(numFace) {
		// 	//all we have in our module will always be triangles.
		// 	case 3:
		// 		f = face3(v1, v2, v3);
		// 		break;
		
		// 	case 4:
		// 		var v4 = parseInt( listFace[ 4 ] );		
		// 		f = face4(v1, v2, v3, v4);
		// 		break;
		
		// 	case 5: // need to implement a tessellation scheme
		// 		var v4 = parseInt( listFace[ 4 ] );
		// 		var v5 = parseInt( listFace[ 5 ] );
		// 		f = face4(v1, v2, v3, v4, v5);
		// 		break;
		
		// 	default:
		// 		break;
		// }

		f = face3(v1, v2, v3);

		geometry.faces.push(f);
		geometry.faces.faceIndex = cf;
		//geometry.faces.normal = new THREE.Vector3();
		geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        // compute the centroid after normalization
 		geometry.computeBoundingSphere();

        var center = computeCentroid(vertices[v1],vertices[v2],vertices[v3]);
        centriod.push(center);
      
        geometry.faces.centriod = center;

		material = new THREE.MeshBasicMaterial( {color: 0xF8F8FF} );
		group.add( new THREE.Mesh( geometry,  material) );

		material = new THREE.MeshBasicMaterial( { color: 0x585858, wireframe: true, transparent: true } );
		group.add( new THREE.Mesh( geometry,  material) );

	}

	


	//console.log(map);
	// get the hash map for neighbour map
	var neiborMap = [];
	for(var i = 0; i < countFace; i++){

		var index1 = (faceTemp[i][0] * countVertex + faceTemp[i][1]).toString();
		var index2 = (faceTemp[i][1] * countVertex + faceTemp[i][2]).toString();
		var index3 = (faceTemp[i][0] * countVertex + faceTemp[i][2]).toString();
		// console.log([index1,index2,index3]);
		var arr = [];
		for(var j = 0; j < map[index1].length; j++){
			if(map[index1][j] != i){
				arr.push(map[index1][j]);
			}
		}
		for(var j = 0; j < map[index2].length; j++){
			if(map[index2][j] != i){
				arr.push(map[index2][j]);
			}
		}
		for(var j = 0; j < map[index3].length; j++){
			if(map[index3][j] != i){
				arr.push(map[index3][j]);
			}
		}

		neiborMap.push(arr);

	}

	//console.log(neiborMap);

	//console.log(Object.keys(map));
	group.NeighborMap = neiborMap;
	//group.countFace = countFace;
	//group.faceCentriod = centriod;
	return group;

}