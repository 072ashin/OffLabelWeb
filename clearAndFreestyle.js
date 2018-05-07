function clearface(){
	for(var i = 0; i< faceArray.size() ; i++){
		var tmpIdx = faceArray.get(i).index;
		var tmpTri = scene.children[3].children[tmpIdx*2].material.color;
		tmpTri.r = faceArray.get(i).ogcolor.r;
		tmpTri.g = faceArray.get(i).ogcolor.g;
		tmpTri.b = faceArray.get(i).ogcolor.b;
	}
	for(var i = 0; i< visited.length ; i++){
		if(visited[i] == 1){
			visited[i] = 0;
		}
	}
	selectedColor = new THREE.Color(0x585858);
	faceArray.clear();
	render();
}

function freestyle(){
	console.log("freestyle");
	var selectColor = document.getElementById('selected_color');
	var primitiveIndex = selectColor.selectedIndex;
	var primitive;
	var primitiveColor;
	console.log(primitiveIndex);
	if(primitiveIndex == 0) {		
		primitiveColor = originalColor;
		for(var i = 0; i < faceArray.size() ; i++) {
			var tmpIdx = faceArray.get(i).index;
			var tmpColor = faceArray.get(i).ogcolor;
			if(tmpColor == originalColor) {
				var tmpPrimIdx = findPrimitive(tmpColor);
				tmpPrim.faces.removeIndex(tmpIdx);
			}
			scene.children[3].children[tmpIdx*2].material.color = primitiveColor;
		}
	} else {
		primitive = primitiveMap.get(primitiveIndex - 1);
		primitiveColor = primitive.color;
		for(var i = 0; i < faceArray.size() ; i++) {
			var tmpIdx = faceArray.get(i).index;
			var tmpColor = faceArray.get(i).ogcolor;
			if(tmpColor == originalColor) {
				primitive.faces.add(tmpIdx);
			} else {
				var tmpPrimIdx = findPrimitive(tmpColor);
				var tmpPrim = primitiveMap.get(tmpPrimIdx);
				tmpPrim.faces.removeIndex(tmpIdx);
				primitive.faces.add(tmpIdx);
			}
			scene.children[3].children[tmpIdx*2].material.color = primitiveColor;
		}		
	}
	faceArray.clear();
	render();
}

function findPrimitive(c) {
	for(var i = 0; i < primitiveMap.size();i++) {
		if (primitiveMap.get(i).color == c) {
			return i;
		}
	}
	return -1;
}