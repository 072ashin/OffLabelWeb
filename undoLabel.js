function undoLabel() {
	document.getElementById("plane").disabled = true;
	document.getElementById("cylinder").disabled = true;
	document.getElementById("cone").disabled = true;
	document.getElementById("sphere").disabled = true;
	document.getElementById("sphere").disabled = false;
	var primitiveNum = primitiveMap.size();
	if(primitiveNum > 0) {
		var lastPrimitive = primitiveMap.get(primitiveNum - 1);
		var lastPrimFaces = lastPrimitive.faces;
		for(var i = 0; i < lastPrimFaces.size(); i++) {
			scene.children[3].children[lastPrimFaces.get(i)*2].material.color = originalColor;
		}
		selectObj.options.remove(primitiveNum);
		primitiveMap.removeIndex(primitiveNum - 1);
		clearface();		
	} else {
		alert("No primitive exist.");
	}
}