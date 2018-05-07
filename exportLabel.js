function exportLabel(){
	var tempType = Object.freeze({"plane":0, "sphere":1, "cylinder":2, "cone":3});
	// triverse all triangles to define label
	var utm;
	for(var i = 0; i < faceAll.size(); i = i + 2){
		var triColor = scene.children[3].children[i].material.color;
		var colorcmp = compareColor(triColor, originalColor);
		var triIndex = faceAll.get(i).index;
		var triLabel = 0;
		if(colorcmp == -1){
			triLabel = findPrimitive(triColor) + 1;
		}
		if(utm == null)
		{
			utm = triIndex + ' ' + triLabel;
		}else{
			utm = utm + '\n' + triIndex + ' ' + triLabel;
		}
	}
	if(utm == null){
		alert("no label exsist");
		return ;
	}
	// output info about geometries
	// output format: [para1, para2, para3, geoType]
	// 		para1: Vector3
	// 		para2: Vector3
	// 		para3: Float
	// 		geoType: String
	var utm1;
	var geometryNum = primitiveMap.size();

	for(var j = 0; j < geometryNum; j++){
		var geoIndex = j + 1;
		var geoInfo = primitiveMap.get(j).primitive;
		var geoType = tempType[geoInfo["geoType"]];
		if(utm1 == null){
			utm1 = geoIndex + ' ' + geoInfo["para1"].x + ' ' + geoInfo["para1"].y + ' ' + geoInfo["para1"].z;
			utm1 = utm1 + ' ' + geoInfo["para2"].x + ' ' + geoInfo["para2"].y + ' ' + geoInfo["para2"].z;
			utm1 = utm1 + ' ' + geoInfo["para3"] + ' ' + geoType;
		}else{
			utm1 = utm1 + '\n' + geoIndex + ' ' + geoInfo["para1"].x + ' ' + geoInfo["para1"].y + ' ' + geoInfo["para1"].z;
			utm1 = utm1 + ' ' + geoInfo["para2"].x + ' ' + geoInfo["para2"].y + ' ' + geoInfo["para2"].z;
			utm1 = utm1 + ' ' + geoInfo["para3"] + ' ' + geoType;
		}
	}

	// saving the label file to local
	if(utm1 == null){
		alert("no primitive exsist");
		return ;
	} else {
		utm = utm + '\n**********\n' + utm1;
		var saveName = offFileName + "_Label.txt";
		var blob = new Blob([utm], {type: "text/plain;charset=utf-8"});
		saveAs(blob, saveName);
	}

}

function findPrimitive(c) {
	for(var i = 0; i < primitiveMap.size();i++) {
		if (primitiveMap.get(i).color == c) {
			return i;
		}
	}
	return -1;
}

function compareColor(c1, c2) {
	if (c1.r == c2.r && c1.g == c2.g && c1.b == c2.b) {
		return 1;
	}
	return -1;
}