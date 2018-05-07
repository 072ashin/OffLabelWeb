function loadoff(id){
	document.getElementById(id).disabled = true;
	document.getElementById('label-file-input').disabled = false;
	init();
	animate();
	//document.getElementById(id).disabled = true;
}

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 2000 );
	camera.position.z = 1.5;
	scene.add( camera );

	var ambient = new THREE.AmbientLight( 0x444444);
	scene.add( ambient );

	var directionalLight = new THREE.DirectionalLight( 0xffffff );
	directionalLight.position.set( 0, 0, 1 ).normalize();
	scene.add( directionalLight );

	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};

	var onError = function ( xhr ) { };

	// read color file
	getLocalFile("colors.txt", function(text){
		if(text != null){
			colorArray = text.split("\n");
		}
	});

	var loader = new THREE.OFFLoader();
	loader.load( offFilePath, function ( object ) {
		console.log("success load");
		var i = 0;
		object.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh ) {
				var temp = child.geometry.faces;
            	var faceIndex = temp.faceIndex;
            	var faceNormal = temp[0].normal;
            	var face = {};
            	face.index = faceIndex;
            	face.centroid = temp.centriod;
            	face.normal = faceNormal;
            	face.ogcolor = originalColor;
            	faceAll.add(face);
            	i = i + 1;
			}
		});
		var centerT = object.children[0].geometry.boundingSphere.center;
		object.position.x = -centerT.x;
		object.position.y = -centerT.y;
		object.position.z = -centerT.z;
		scene.add( object );
		console.log(object);
	}, onProgress, onError );


	// RENDERER
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();
	window.addEventListener( 'resize', onWindowResize, false );
	window.addEventListener("mousedown",onMouseDown,false);
}


function getLocalFile(url, doneCallback) {
	var xhr;
	xhr = new XMLHttpRequest();
	xhr.onreadystatechange = handleStateChange;
		xhr.open("GET", url, true);
	xhr.send();
	function handleStateChange() {
		if (xhr.readyState === 4) {
			doneCallback(xhr.status == 200 ? xhr.responseText : null);
		}
	}
}

function onMouseDown(){
	if(geometry == ""){
		console.log("wait for loading...");
	}
	else if(keyboard.pressed("shift")){

		event.preventDefault();
        //将屏幕像素坐标转化成camare坐标
        mouse.x = (event.clientX/renderer.domElement.clientWidth)*2-1;
        mouse.y = - (event.clientY/renderer.domElement.clientHeight)*2+1;
        //设置射线的起点是相机
        raycaster.setFromCamera( mouse, camera );

        //将射线投影到屏幕，如果scene.children里的某个或多个形状相交，则返回这些形状
        //第二个参数是设置是否递归，默认是false，也就是不递归。当scene里面添加了Group对象的实例时，就需要设置这个参数为true
        //第一个参数不传scene.children也可以，传一个group.children或一个形状数组都可以（这样可以实现一些特别的效果如点击内部的效果）
        //另外，因为返回的是一个数组，所以遍历数组就可以获得所有相交的对象，当元素重叠时，特别有用
        var intersects = raycaster.intersectObjects(scene.children, true);  
        if(intersects.length > 0){
            var currObj = intersects[0];
            var face3 = intersects[0].face;
            var faceIndex = intersects[0].object.geometry.faces.faceIndex;
            var faceCentroid = intersects[0].object.geometry.faces.centriod;
            var faceNormal = intersects[0].object.geometry.faces[0].normal;
            var faceColor = scene.children[3].children[faceIndex*2].material.color;
            var face = {};
            face.index = faceIndex;
            face.position = face3;
            face.centroid = faceCentroid;
            face.normal = faceNormal;

            if(faceArray.contains(face)){           	
            	currObj.object.material.color = faceArray.get(faceArray.indexOf(face)).ogcolor;
            	faceArray.removeObj(face);
            }else{
            	faceArray.add(face);
            	face.ogcolor = faceColor;
            	currObj.object.material.color = selectedColor;
        	}

        	if(faceArray.size() != 0){
        		document.getElementById("plane").disabled = false;
        		document.getElementById("cylinder").disabled = false;
        		document.getElementById("cone").disabled = false;
        		document.getElementById("sphere").disabled = false;
        	}
        	// } else if(faceArray.size() == 2){
        	// 	document.getElementById("plane").disabled = false;
        	// 	document.getElementById("cylinder").disabled = false;
        	// 	document.getElementById("cone").disabled = true;
        	// 	document.getElementById("sphere").disabled = true;

        	// } else if(faceArray.size() == 3){
        	// 	document.getElementById("plane").disabled = true;
        	// 	document.getElementById("cylinder").disabled = true;
        	// 	document.getElementById("cone").disabled = false;
        	// 	document.getElementById("sphere").disabled = true;

        	// } else if(faceArray.size() >= 5){
        	// 	document.getElementById("plane").disabled = true;
        	// 	document.getElementById("cylinder").disabled = true;
        	// 	document.getElementById("cone").disabled = false;
        	// 	document.getElementById("sphere").disabled = false;

        	// } else{
        	// 	document.getElementById("plane").disabled = true;
        	// 	document.getElementById("cylinder").disabled = true;
        	// 	document.getElementById("cone").disabled = true;
        	// 	document.getElementById("sphere").disabled = true;
        	// }

            console.log(faceArray);
     	}
     	render();
 	}

}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function update(){
	controls.update();
}

function animate() {
	requestAnimationFrame( animate );
	render();
	update();
}

function render() {

	renderer.render( scene, camera );
}


function readOff(files){
	// blocking window is to prevent user input
	// when waiting for server to reply
	// setBlockingWindow();
	document.getElementById("load").disabled = false;
	if(files.length){
		var file = files[0];
		var reader = new FileReader();
		var offPath = document.getElementById('off-file-input').value;
		offFileName = offPath.replace(/^.*[\\\/]/, '');
		offFileName = offFileName.replace(/\.[^/.]+$/, "");
		var fileExtensionName = /\.[^\.]+$/.exec(offPath);
		var checkExtension = new String(fileExtensionName).valueOf() == new String('.off').valueOf();
		if (checkExtension) {
			reader.onload = function(){
				uploadOffFile(this.result, offFileName);
			}
			reader.readAsText(file);
		}
	}

}