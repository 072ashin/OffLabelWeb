function confirmLabel(t, p1, p2, p3, facesIdx){
	document.getElementById("confirm").disabled = false;
	document.getElementById("plane").disabled = true;
	document.getElementById("cylinder").disabled = true;
	document.getElementById("cone").disabled = true;
	document.getElementById("sphere").disabled = true;

	// var tmpColor, colorKey, tmpIdx;
	var primitiveInfo = {para1:p1, para2:p2, para3:p3, geoType:t};
	var colorKey = parseInt(colorArray[colorCount], 16);
	var faceColor = new THREE.Color(colorKey);
	colorKey = rgbToHex(faceColor.r*255, faceColor.g*255, faceColor.b*255);

	// render the geometry with new color
	for(var i = 0; i< facesIdx.size() ; i++){
		scene.children[3].children[facesIdx.get(i)*2].material.color = faceColor;
	}

	// push new object into arraylist
	primitiveObj = {color: faceColor, primitive: primitiveInfo, faces: facesIdx};
	primitiveMap.add(primitiveObj);

	// update selection bar
	selectObj.options.add(new Option(t, primitiveMap.size()));
	selectObj[primitiveMap.size()].style.background = colorKey; 
	colorCount = colorCount + 1;
	faceArray.clear();
	visited = [];
}


function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}
