import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

// --------- Helper Classes ---------

// Helper for changing color via GUI
class ColorGUIHelper {
	constructor(object, prop) {
	this.object = object;
	this.prop = prop;
	}
	get value() {
	return `#${this.object[this.prop].getHexString()}`;
	}
	set value(hexString) {
	this.object[this.prop].set(hexString);
	}
}

// Helper for changing camera near/far properties via GUI
class MinMaxGUIHelper {
	constructor(obj, minProp, maxProp, minDif) {
	this.obj = obj;
	this.minProp = minProp;
	this.maxProp = maxProp;
	this.minDif = minDif;
	}
	get min() {
	return this.obj[this.minProp];
	}
	set min(v) {
	this.obj[this.minProp] = v;
	this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
	}
	get max() {
	return this.obj[this.maxProp];
	}
	set max(v) {
	this.obj[this.maxProp] = v;
	this.min = this.min;  // trigger the min setter to enforce the constraint
	}
}

// Creates a canvas-based label texture
function makeLabelCanvas(baseWidth, size, name) {
	const borderSize = 2;
	const ctx = document.createElement('canvas').getContext('2d');
	const font = `${size}px bold sans-serif`;
	ctx.font = font;
	
	// measure how long the name will be
	const textWidth = ctx.measureText(name).width;
	const doubleBorderSize = borderSize * 2;
	const width = baseWidth + doubleBorderSize;
	const height = size + doubleBorderSize;

	ctx.canvas.width = width;
	ctx.canvas.height = height;

	ctx.font = font;
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'center';
	ctx.fillStyle = 'blue';
	ctx.fillRect(0, 0, width, height);

	// scale to fit but don't stretch
	const scaleFactor = Math.min(1, baseWidth / textWidth);
	ctx.translate(width / 2, height / 2);
	ctx.scale(scaleFactor, 1);
	ctx.fillStyle = 'white';
	ctx.fillText(name, 0, 0);

	return ctx.canvas;
}

// --------- Main Function ---------
function main() {
	// ----- Renderer -----
	const canvas = document.querySelector('#c');
	const renderer = new THREE.WebGLRenderer({
	antialias: true,
	canvas,
	logarithmicDepthBuffer: true,
	alpha: true,
	});
	renderer.shadowMap.enabled = true;

	// ----- Camera & Controls -----
	const fov = 85;
	const aspect = 2;  // the canvas default
	const near = 0.1;
	const far = 100;
	const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set(0, 10, 20);

	const controls = new OrbitControls(camera, renderer.domElement);
	controls.target.set(0, 5, 0);
	controls.enableDamping = true;
	controls.dampingFactor = 0.05;
	controls.update();

	// ----- Scene -----
	const scene = new THREE.Scene();
	// Default background (will be replaced below)
	scene.background = new THREE.Color('white');

	// Add fog and set background
	{
	const fogColor = 'white';
	const nearFog = 15;
	const farFog = 40;
	scene.fog = new THREE.Fog(fogColor, nearFog, farFog);
	scene.background = new THREE.Color(fogColor);
	}

	// ----- GUI -----
	const gui = new GUI();
	// Camera FOV GUI
	gui.add(camera, 'fov', 1, 180).onChange(() => camera.updateProjectionMatrix());
	// Camera Near/Far GUI
	const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
	gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1)
		.name('near')
		.onChange(() => camera.updateProjectionMatrix());
	gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1)
		.name('far')
		.onChange(() => camera.updateProjectionMatrix());

	// ----- Ground Plane & Background Texture -----
	addGroundPlaneAndBackground(scene);

	// ----- Lights -----
	addAmbientLight(scene, gui);
	addDirectionalLight(scene, gui);
	addSpotLight(scene, gui);

	// ----- Geometries & Labels -----
	let spinningCube = addGeometries(scene);

	// ----- Model Loading (OBJ/MTL) -----
	loadStatue(scene);

	// ----- Render Loop -----
	requestAnimationFrame(function render() {
	if (resizeRendererToDisplaySize(renderer)) {
		const canvas = renderer.domElement;
		camera.aspect = canvas.clientWidth / canvas.clientHeight;
		camera.updateProjectionMatrix();
	}

	// Spin the cube
	if (spinningCube) {
		spinningCube.rotation.x += 0.01;
		spinningCube.rotation.y += 0.01;
	}

	controls.update();
	renderer.render(scene, camera);
	requestAnimationFrame(render);
	});
}

// --------- Helper Functions ---------

// Resizes the renderer if display size differs from the current size
function resizeRendererToDisplaySize(renderer) {
	const canvas = renderer.domElement;
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	const needResize = canvas.width !== width || canvas.height !== height;
	if (needResize) {
	renderer.setSize(width, height, false);
	}
	return needResize;
}

// Adds the ground plane and sets the background to an equirectangular texture
function addGroundPlaneAndBackground(scene) {
	// Ground plane
	const planeSize = 60;
	const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
	const planeMat = new THREE.MeshPhongMaterial({
	color: 0x654321, // dark brown color
	side: THREE.DoubleSide
	});
	const mesh = new THREE.Mesh(planeGeo, planeMat);
	mesh.rotation.x = Math.PI * -0.5;
	mesh.receiveShadow = true;
	scene.add(mesh);

	// Background texture
	const loader = new THREE.TextureLoader();
	const bgTexture = loader.load(
	'https://threejs.org/manual/examples/resources/images/equirectangularmaps/tears_of_steel_bridge_2k.jpg',
	() => {
		bgTexture.mapping = THREE.EquirectangularReflectionMapping;
		bgTexture.colorSpace = THREE.SRGBColorSpace;
		scene.background = bgTexture;
	}
	);
}

// Adds an ambient light and GUI controls for it
function addAmbientLight(scene, gui) {
	const ambientColor = 0x404040;
	const ambientIntensity = 0.5;
	const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
	scene.add(ambientLight);

	gui.add(ambientLight, 'intensity', 0, 2, 0.01).name('Ambient Intensity');
	gui.addColor(new ColorGUIHelper(ambientLight, 'color'), 'value').name('Ambient Color');
}

// Adds a directional light and GUI controls for it
function addDirectionalLight(scene, gui) {
	const directionalColor = 0xffffff;
	const directionalIntensity = 1;
	const directionalLight = new THREE.DirectionalLight(directionalColor, directionalIntensity);
	directionalLight.position.set(5, 18, 2);
	directionalLight.castShadow = true;
	directionalLight.target.position.set(0, 0, 0);
	scene.add(directionalLight);
	scene.add(directionalLight.target);

	gui.add(directionalLight, 'intensity', 0, 5, 0.01).name('Directional Intensity');
	gui.add(directionalLight.target.position, 'x', -10, 10).name('Directional Target X');
	gui.add(directionalLight.target.position, 'z', -10, 10).name('Directional Target Z');
	gui.add(directionalLight.target.position, 'y', 0, 10).name('Directional Target Y');
}

// Adds a spotlight and GUI controls for it
function addSpotLight(scene, gui) {
	const spotColor = 0xffffff;
	const spotIntensity = 150;
	const spotLight = new THREE.SpotLight(spotColor, spotIntensity);
	spotLight.position.set(0, 18, 0);
	spotLight.angle = Math.PI / 6;
	spotLight.penumbra = 0.1;
	spotLight.decay = 2;
	spotLight.distance = 200;
	spotLight.castShadow = true;
	scene.add(spotLight);
	scene.add(spotLight.target);

	gui.add(spotLight, 'intensity', 0, 350, 0.01).name('Spot Intensity');
	gui.addColor(new ColorGUIHelper(spotLight, 'color'), 'value').name('Spot Color');
	gui.add(spotLight, 'angle', 0, Math.PI / 2, 0.01).name('Spot Angle');
	gui.add(spotLight, 'penumbra', 0, 1, 0.01).name('Spot Penumbra');
}

// Adds the cube, sphere, cylinder pyramid, and labels. Returns the spinning cube.
function addGeometries(scene) {
	const loader = new THREE.TextureLoader();

	// ----- Spinning Cube -----
	const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
	const boxMaterials = [
	new THREE.MeshPhongMaterial({ map: loader.load('../resources/images/cartoonSky.jpg') }),
	new THREE.MeshPhongMaterial({ map: loader.load('../resources/images/cobbleStone.jpg') }),
	new THREE.MeshPhongMaterial({ map: loader.load('../resources/images/dirt.jpg') }),
	new THREE.MeshPhongMaterial({ map: loader.load('../resources/images/grass.jpg') }),
	new THREE.MeshPhongMaterial({ map: loader.load('../resources/images/sky.jpg') }),
	new THREE.MeshPhongMaterial({ map: loader.load('../resources/images/skyNew.jpg') }),
	];
	boxMaterials.castShadow = true;
	boxMaterials.receiveShadow = true;

	// Create the spinning cube
	const spinningCube = new THREE.Mesh(cubeGeometry, boxMaterials);
	spinningCube.castShadow = true;
	spinningCube.receiveShadow = true;
	spinningCube.position.set(-6, 13.75, 1);
	scene.add(spinningCube);

	// Create label for the spinning cube
	const canvas = makeLabelCanvas(150, 32, 'MegaCube');
	const cubeLabelTexture = new THREE.CanvasTexture(canvas);
	cubeLabelTexture.minFilter = THREE.LinearFilter;
	cubeLabelTexture.wrapS = THREE.ClampToEdgeWrapping;
	cubeLabelTexture.wrapT = THREE.ClampToEdgeWrapping;

	const labelMaterial = new THREE.SpriteMaterial({
	map: cubeLabelTexture,
	transparent: true,
	});
	const cubeLabel = new THREE.Sprite(labelMaterial);
	scene.add(cubeLabel);

	const labelBaseScale = 0.01;
	cubeLabel.scale.x = canvas.width * labelBaseScale * 2;
	cubeLabel.scale.y = canvas.height * labelBaseScale * 2;

	const cubeWorldPos = new THREE.Vector3();
	spinningCube.getWorldPosition(cubeWorldPos);
	cubeLabel.position.copy(cubeWorldPos);
	cubeLabel.position.y += 2.5;

	// ----- Cube Stack -----
	const textures = [
	loader.load('../resources/images/cartoonSky.jpg'),
	loader.load('../resources/images/cobbleStone.jpg'),
	loader.load('../resources/images/dirt.jpg'),
	loader.load('../resources/images/grass.jpg'),
	loader.load('../resources/images/sky.jpg'),
	loader.load('../resources/images/skyNew.jpg')
	];
	textures.forEach((tex, i) => {
	tex.castShadow = true;
	tex.receiveShadow = true;
	const singleMaterial = new THREE.MeshPhongMaterial({ map: tex });
	const cubeStack = new THREE.Mesh(cubeGeometry, singleMaterial);
	cubeStack.castShadow = true;
	cubeStack.receiveShadow = true;
	// Position each stacked cube
	cubeStack.position.set(-6, 1 + i * 2, 1);
	scene.add(cubeStack);
	});

	// ----- Sphere -----
	const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
	const sphereMaterial = new THREE.MeshPhongMaterial({ map: loader.load('../resources/images/bowlingBall.jpg') });
	const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	sphere.castShadow = true;
	sphere.receiveShadow = true;
	sphere.position.set(9, 1, 4);
	sphere.rotation.y = -Math.PI / 3;
	sphere.rotation.z = Math.PI / 3;
	scene.add(sphere);

	// Label for Sphere
	const canvas2 = makeLabelCanvas(150, 32, 'Bowling');
	const sphereLabelTexture = new THREE.CanvasTexture(canvas2);
	sphereLabelTexture.minFilter = THREE.LinearFilter;
	sphereLabelTexture.wrapS = THREE.ClampToEdgeWrapping;
	sphereLabelTexture.wrapT = THREE.ClampToEdgeWrapping;

	const sphereLabelMaterial = new THREE.SpriteMaterial({
	map: sphereLabelTexture,
	transparent: true,
	});
	const sphereLabel = new THREE.Sprite(sphereLabelMaterial);
	scene.add(sphereLabel);

	sphereLabel.position.copy(sphere.position);
	sphereLabel.position.y += 1.5;
	sphereLabel.scale.x = canvas2.width * labelBaseScale * 2;
	sphereLabel.scale.y = canvas2.height * labelBaseScale * 2;

	// ----- Cylinder Pyramid -----
	// Each row has a certain count of cylinders
	const rowCounts = [6, 5, 4, 3, 2, 1];
	const cylinderGeometry = new THREE.CylinderGeometry(0.75, 0.75, 2, 32);
	const cylinderMaterials = [
	new THREE.MeshPhongMaterial({ map: loader.load('../resources/images/bowlingPin.jpg') }),
	new THREE.MeshPhongMaterial({ color: 0xffffff }), // White color
	new THREE.MeshPhongMaterial({ color: 0xffffff })  // White color
	];
	cylinderMaterials.castShadow = true;
	cylinderMaterials.receiveShadow = true;

	const ySpacing = 2;  // Vertical spacing
	const baseY = 1.5;   // Base Y position

	rowCounts.forEach((count, rowIndex) => {
	const xSpacing = 2;
	const totalWidth = (count - 1) * xSpacing;
	const yPos = baseY + rowIndex * ySpacing;
	for (let i = 0; i < count; i++) {
		const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterials);
		const xPos = i * xSpacing - totalWidth / 2 + 10;
		cylinder.position.set(xPos, yPos, 0);
		scene.add(cylinder);
	}
	});

	return spinningCube;
}

// Loads OBJ/MTL model (Statue of Liberty)
function loadStatue(scene) {
	const mtlLoader = new MTLLoader();
	mtlLoader.load('../resources/obj/LibertStatue.mtl', (mtl) => {
	mtl.preload();
	const objLoader = new OBJLoader();
	objLoader.setMaterials(mtl);
	objLoader.load('../resources/obj/LibertStatue.obj', (root) => {
		root.scale.set(50, 50, 50);
		root.position.set(0, 0, -20);
		root.castShadow = true;
		root.receiveShadow = true;
		scene.add(root);
	});
	});
}

// ----- Initialize -----
main();