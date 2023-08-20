//based on this: https://www.youtube.com/watch?v=OgZTRu8hJ2g

import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera = new THREE.Camera();
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
    antialias:true, 
    alpha:true
});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


//https://ar-js-org.github.io/AR.js-Docs/marker-based/#threejs ->
var ArToolkitSource = new THREEx.ArToolkitSource({
    sourceType: "webcam"
});
ArToolkitSource.init(function(){
    setTimeout(function(){
        ArToolkitSource.onResizeElement();
        ArToolkitSource.copyElementSizeTo(renderer.domElement);
    },2000)
});

var ArToolkitContext = new THREEx.ArToolkitContext({
     // url of the camera parameters
     //cameraParametersUrl: THREEx.ArToolkitContext.baseURL + '../data/data/camera_para.dat',
     cameraParametersUrl: 'camera_para.dat',

     // the mode of detection - ['color', 'color_and_matrix', 'mono', 'mono_and_matrix']
    detectionMode: 'color_and_matrix'
});
ArToolkitContext.init(function(){
    camera.projectionMatrix.copy(ArToolkitContext.getProjectionMatrix());
});

var ArMarkerControls = new THREEx.ArMarkerControls(ArToolkitContext,camera,
{
    // type of marker - ['pattern', 'barcode', 'unknown' ]
    type: "pattern",

    // url of the pattern - IIF type='pattern'
    //here we need AR marker training from this link: https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html
    patternUrl: 'pattern-FMILogo_07.patt',
    
    // change matrix mode - [modelViewMatrix, cameraTransformMatrix]
    changeMatrixMode: "cameraTransformMatrix",
});

scene.visible = false;

//<- https://ar-js-org.github.io/AR.js-Docs/marker-based/#threejs

const geometry = new THREE.CubeGeometry( 1, 1, 1 );
const material = new THREE.MeshNormalMaterial( { 
    transparent:true,
    opacity:0.5,
    side: THREE.DoubleSide
 } );
const cube = new THREE.Mesh( geometry, material );
cube.position.y = geometry.parameters.height/2;
scene.add( cube );

function animate() {
	requestAnimationFrame( animate );

	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;
    ArToolkitContext.update(ArToolkitSource.domElement);
    scene.visible = camera.visible;
	renderer.render( scene, camera );
};

animate();