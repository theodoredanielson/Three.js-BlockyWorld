# Three.js 3D Scene Assignment

This project is an assignment that guides you through creating a 3D scene using [Three.js](https://threejs.org/). By following a structured list of tutorials, you'll implement various features such as animated cubes, textures, custom 3D models, camera controls, multiple light sources, a skybox, and additional 3D objects. You'll also explore advanced computer graphics techniques to enhance your scene.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup](#setup)
3. [Assignment Steps](#assignment-steps)
   - [1. Create a Simple Three.js Scene](#1-create-a-simple-threejs-scene)
   - [2. Add Textures](#2-add-textures)
   - [3. Add a Custom 3D Model](#3-add-a-custom-3d-model)
   - [4. Add Controls to Your Camera](#4-add-controls-to-your-camera)
   - [5. Add Extra Light Sources](#5-add-extra-light-sources)
   - [6. Add a Skybox](#6-add-a-skybox)
   - [7. Add More 3D Objects to Your Scene](#7-add-more-3d-objects-to-your-scene)
   - [8. Extras](#8-extras)
4. [Resources](#resources)
5. [Contributing](#contributing)
6. [License](#license)

---

## Prerequisites

- Basic understanding of JavaScript, HTML, and CSS.
- Familiarity with Three.js fundamentals.
- A local web server to serve static files.
- Optional: Knowledge of Git and GitHub.

---

## Setup

1. **Clone or Download the Repository:**
   ```bash
   git clone https://github.com/your-username/threejs-assignment.git
   ```
2. **Install Dependencies:**  
   If you're using a module bundler like Vite, Parcel, or Webpack, install the required packages.
3. **Start Your Local Server:**  
   Serve the `index.html` file to preview your 3D scene in the browser.

---

## Assignment Steps

### 1. Create a Simple Three.js Scene
**Tutorial Reference:** [Fundamentals](https://threejs.org/manual/#en/fundamentals)  
- Initialize a Three.js scene.
- Add multiple animated cubes.
- Incorporate a directional light source.
- Set up a perspective camera.

> **Tip:** Ensure the cubes are animated (e.g., rotating) so you can verify that everything is rendered correctly.

---

### 2. Add Textures
**Tutorial Reference:** [Textures](https://threejs.org/manual/#en/textures)  
- Learn how to load and map textures onto objects.
- Apply the same texture to all six faces of a cube.
- Experiment with different textures on each face.
- Understand texture filtering: minification, magnification, and mipmapping.

> **Tip:** Adjust filtering settings if you notice any issues with texture quality.

---

### 3. Add a Custom 3D Model
**Tutorial Reference:** [Load OBJ Models](https://threejs.org/manual/#en/load-obj)  
- Find a free 3D model in the `.obj` format or create your own using a tool like Blender.
- Use the OBJLoader (and optionally MTLLoader) to load and display your model.
- Position and scale the model appropriately within the scene.

> **Tip:** Double-check file paths for your model and textures to avoid loading errors.

---

### 4. Add Controls to Your Camera
**Tutorial Reference:** [Cameras](https://threejs.org/manual/#en/cameras)  
- Implement OrbitControls to enable mouse-based interaction.
- Allow users to pan, rotate, and zoom the camera.
- Fine-tune control parameters for a smooth user experience.

> **Tip:** Experiment with damping and sensitivity to find the optimal settings.

---

### 5. Add Extra Light Sources
**Tutorial Reference:** [Lights](https://threejs.org/manual/#en/lights)  
- Add at least three different light sources (e.g., AmbientLight, PointLight, SpotLight).
- Experiment with light color, intensity, and shadows.
- Use a GUI tool (like `lil-gui`) to adjust these settings in real-time.

> **Tip:** Use a combination of light sources to create a dynamic and visually appealing scene.

---

### 6. Add a Skybox
**Tutorial Reference:** [Backgrounds](https://threejs.org/manual/#en/backgrounds)  
- Create a cubemap-based skybox that surrounds the scene.
- Ensure the camera is inside the skybox for an immersive effect.
- Experiment with different sky textures for varied environments.

> **Tip:** Free cubemap textures are available online for different environments such as space, landscapes, etc.

---

### 7. Add More 3D Objects to Your Scene
- Add at least 20 additional 3D objects (cubes, spheres, cylinders, etc.).
- Arrange them creatively to build a meaningful scene.
- Consider adding more custom models to enhance visual diversity.

> **Tip:** Vary the scale, position, and textures of objects to keep the scene engaging.

---

### 8. Extras
Choose **three advanced techniques** to implement from the list below or explore other techniques in computer graphics:
- **Shadows:** [Shadows](https://threejs.org/manual/#en/shadows)
- **Picking (Object Selection):** [Picking](https://threejs.org/manual/#en/picking)
- **Fog:** [Fog](https://threejs.org/manual/#en/fog)
- **Billboards:** [Billboards](https://threejs.org/manual/#en/billboards)
- **Multiple Cameras:** [Multiple Cameras](https://threejs.org/manual/#en/cameras)
- **Render to Texture:** [Render Targets](https://threejs.org/manual/#en/rendertargets)

> **Tip:** Document your implementation and explain why you chose these techniques and how they enhance the scene.

---

## Resources

- [Three.js Official Website](https://threejs.org/)
- [Three.js Manual and Examples](https://threejs.org/manual/)
- [Three.js GitHub Repository](https://github.com/mrdoob/three.js/)

---

## Contributing

Contributions are welcome! If you have suggestions for improvements or additional features, please feel free to open an issue or submit a pull request.

---

## License

This project is open-source and available under the [MIT License](LICENSE). Use and modify it as needed.
```