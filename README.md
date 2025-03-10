# **WebGL 3D Maze Game with Texture Mapping and Camera Controls**

## **Overview**
This is a WebGL-based 3D game featuring a maze environment where the player navigates using a first-person camera. The objective is to traverse the maze and reach the cockroach character, which initiates an animation sequence upon contact. The game includes **collision detection, texture mapping, block placement, mouse-controlled camera movement, and interactive animations.**

## **Features**
- **First-Person Camera Movement:**
  - Move with **WASD or Arrow keys**.
  - Rotate using **mouse movement** (pointer-lock enabled).
  - Press **Tab** to release the mouse.

- **Texture Mapping and Graphics:**
  - Multiple textures for different objects.
  - Skybox and ground textures.
  - Blocks have distinct textures (TEXTURE 4 for placed blocks).
  
- **Maze Environment:**
  - A **32x32 grid-based** world with walls and a floor.
  - Cockroach character built using **hierarchical transformations**.
  - Maze prevents flying over walls.

- **Block Placement (Simple Minecraft-style Building):**
  - **Shift + Click** to place a block.
  - **Ctrl + Click** to remove a block.
  - Blocks snap to the **32x32 grid** and avoid player collisions.
  - Walls cannot be modified.

- **Collision Detection & Sliding Movement:**
  - Prevents clipping through walls.
  - Camera **slides along walls** when blocked.
  - Climbing mechanics allow sliding **up vertical walls**.

- **Cockroach Interaction (Win Condition):**
  - Approaching the **cockroach’s head** (within **0.2 radius**) triggers animation.
  - Movement is disabled upon winning.
  - Displays **"YOU WIN! REFRESH TO PLAY AGAIN"** with a **black background for readability**.

- **User Input & UI Elements:**
  - `"I Quit"` button prints the current **map state**.
  - Game instructions displayed at the bottom.
  - UI elements styled for readability.

---

## **Setup Instructions**
### **1. Start a Local Web Server**
Since WebGL security restrictions prevent direct file loading, you **must** use a local web server to run this project.
- If you have Python installed:
  - Run:  
    ```
    python3 -m http.server
    ```
  - Open `http://localhost:8000/World.html` in a browser.

### **2. Controls**
| Action | Key/Input |
|--------|----------|
| **Move Forward** | W or Arrow Up |
| **Move Backward** | S or Arrow Down |
| **Move Left** | A or Arrow Left |
| **Move Right** | D or Arrow Right |
| **Pan Camera Left** | Q |
| **Pan Camera Right** | E |
| **Look Around** | Mouse Movement (when pointer is locked) |
| **Exit Pointer Lock** | Tab or Esc |
| **Place Block** | Shift + Click |
| **Remove Block** | Ctrl + Click |
| **Quit & Print Map** | Click "I Quit" button |

---

## **Technical Implementation**
### **1. WebGL Rendering & Shaders**
- **Vertex Shader:**
  - Handles **model, view, projection, and global rotation matrices**.
- **Fragment Shader:**
  - Supports multiple textures via `u_SamplerX` uniforms.

### **2. Camera System**
- Implemented in **Camera.js**.
- Uses **view and projection matrices** for first-person movement.
- Supports **collision detection** to prevent walking through walls.
- **Pointer Lock API** is used for mouse-based rotation.

### **3. Collision Handling**
- `checkCollision(x, z, radius)` prevents movement into occupied tiles.
- **Sliding logic:**  
  - When colliding with a wall in **X or Z**, movement continues in the **other direction**.
  - If blocked in both, **movement stops**.
  - Allows **vertical climbing** if there's an open space above.

### **4. Block Placement System**
- Blocks align with the **32x32 grid**.
- Cannot **modify** existing walls.
- Prevents placement in the **player’s position**.
- If blocked, places in the **next available forward tile**.

### **5. Animation & Win Condition**
- The cockroach consists of multiple **Cube** objects with **hierarchical transformations**.
- `poke()` triggers an **animation sequence** when interacted with.
- Collision with the cockroach’s head **disables movement** and displays **"YOU WIN!"**.

---

## **Known Issues & Future Improvements**
- **Performance Optimization:**  
  - Currently optimized for **10 FPS with a 32x32 world**.
  - Could implement **instancing** or more efficient rendering.
- **Improved Collision Handling:**  
  - Could be refined to better handle **diagonal movement**.
- **Save/Load Feature:**  
  - Currently, block placement **does not persist** after refresh.

---

## **Credits & Collaboration**
- **Author:** Teddy Danielson  
- **Collaborator:** Sam Morrow  
- Used **ChatGPT** for debugging, formatting, and code explanation.  
- Implemented hierarchical transformations to **animate** the cockroach.  
- **Optimization & Fixes:** Adjusted WebGL buffer management for better performance.

---

## **How to Play**
1. **Navigate through the maze** to find the **cockroach**.
2. **Avoid walls** and use **block placement** wisely.
3. **Win by approaching the cockroach’s head**.
4. **Or quit early** using the `"I Quit"` button!