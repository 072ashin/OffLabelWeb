// upload label file to server
function uploadLabelFile(arr1, arr2){
	$.ajax({
	   type: "POST",
	   url: "receiveLabel.php",
	   data: {"label": arr1, "labelFileName":arr2},
	   success: function (data){
	   		var offLabelFileName = data;	  
	   		loadOffLabelFile(offLabelFileName);
	   		document.getElementById('overlay').style.display = "none";
		}
	});
}


function readLabel(files){
	// blocking window is to prevent user input
	// when waiting for server to reply
	setBlockingWindow();
	if(files.length){
		var file = files[0];
		var reader = new FileReader();
		if (/text+/.test(file.type)) {
			reader.onload = function(){
				var offLabelPath = document.getElementById('label-file-input').value;
				var offLabelFileName = offLabelPath.replace(/^.*[\\\/]/, '');
				offLabelFileName = offLabelFileName.replace(/\.[^/.]+$/, "");
				uploadLabelFile(this.result, offLabelFileName);
			}
			reader.readAsText(file);
		}
	}

}

function loadOffLabelFile(offLabelFileName)
{
	getLocalFile( offLabelFileName, function(text){
		if(text != null){

			var labelFile = text.split('**********');
			var faceLabels = labelFile[0].split('\n');
			var primitiveLabels = labelFile[1].split('\n');

			var nullArray = new ArrayList();
			var tmpFaceList = {"0":nullArray};
			for(var j = 0; j < faceLabels.length; j++) {
				var t = faceLabels[j].split(" ");
				var faceIdx = parseInt(t[0]);
				var faceLabel = parseInt(t[1]);
				if(tmpFaceList.hasOwnProperty(faceLabel)) {
					tmpFaceList[faceLabel].add(faceIdx);
				} else {
					tmpFaceList[faceLabel] = new ArrayList();
					tmpFaceList[faceLabel].add(faceIdx);
				}
			}

			for(var v = 0; v < tmpFaceList[0].size(); v++) {
				var tempTriIndex = tmpFaceList[0].get(v);
				scene.children[3].children[tempTriIndex*2].material.color = originalColor;
			}

			for(var i = 1; i < primitiveLabels.length; i++) {
				// obtain parameters
				var t = primitiveLabels[i].split(' ');
				var p1 = new THREE.Vector3(parseFloat(t[1]), parseFloat(t[2]), parseFloat(t[3]));
				var p2 = new THREE.Vector3(parseFloat(t[4]), parseFloat(t[5]), parseFloat(t[6]));
				var p3 = parseFloat(t[7]);
				var type = geoTypeEnumPy[parseInt(t[8])];
				var primitiveInfo = {para1:p1, para2:p2, para3:p3, geoType:type};
				
				// pick new color
				var colorKey = parseInt(colorArray[colorCount], 16);
				var faceColor = new THREE.Color(colorKey);
				colorKey = rgbToHex(faceColor.r*255, faceColor.g*255, faceColor.b*255);

				var facesIdx = tmpFaceList[parseInt(t[0])];
				for(var m = 0;m < facesIdx.size(); m++) {
					scene.children[3].children[facesIdx.get(m)*2].material.color = faceColor;
				}


				// push new object into arraylist
				primitiveObj = {color: faceColor, primitive: primitiveInfo, faces:facesIdx};
				primitiveMap.add(primitiveObj);

				// update selection bar
				selectObj.options.add(new Option(type, primitiveMap.size()));
				selectObj[primitiveMap.size()].style.background = colorKey; 
				colorCount = colorCount + 1;


			}

			console.log(primitiveMap);	
		}
	});
}