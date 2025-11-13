import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Grid, Square, Trash2, RotateCcw, Copy, Box, Eye } from 'lucide-react';
import * as THREE from 'three';

export default function ShelfConfigurator() {
  const [gridSize, setGridSize] = useState({ rows: 8, cols: 8 });
  const [boxes, setBoxes] = useState(() => {
    // Start with all compartments selected/active
    const initial = new Set();
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        initial.add(`${i}-${j}`);
      }
    }
    return initial;
  });
  
  // New state for modes
  const [editorMode, setEditorMode] = useState('structure'); // 'structure', 'fill', 'resize'
  const [coloredItems, setColoredItems] = useState(new Map()); // Map of cell keys to colors
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');
  
  // Custom dimensions for each box - stores offset adjustments
  const [boxDimensions, setBoxDimensions] = useState(new Map()); // Map of cell keys to { left, right, top, bottom }
  
  // Wall positions for resize mode
  const [horizontalWalls, setHorizontalWalls] = useState(() => 
    Array.from({ length: 9 }, (_, i) => i)
  );
  const [verticalWalls, setVerticalWalls] = useState(() => 
    Array.from({ length: 9 }, (_, i) => i)
  );
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState(null); // 'add' or 'remove'
  const [draggingWall, setDraggingWall] = useState(null); // { boxKey, wallType: 'left'|'right'|'top'|'bottom' }
  
  const gridRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const shelfGroupRef = useRef(null);
  const animationRef = useRef(null);
  
  const colors = ['#004996', '#F2B705', '#E2E4F3', '#1A1C2E', '#6B6F88', '#8C7851', '#2F3246', '#C1C3D7'];

  const getCellKey = (row, col) => `${row}-${col}`;

  // Initialize 3D scene
  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0d17);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      50,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(10, 8, 11);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      antialias: true 
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(12, 20, 8);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0x9aa7ff, 0.25);
    fillLight.position.set(-6, 8, -4);
    scene.add(fillLight);

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x101223, roughness: 1 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    scene.add(ground);

    // Shelf group
    const shelfGroup = new THREE.Group();
    scene.add(shelfGroup);
    shelfGroupRef.current = shelfGroup;

    // Animation loop
    let autoRotate = true;
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      if (autoRotate && shelfGroupRef.current) {
        shelfGroupRef.current.rotation.y += 0.005;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Mouse interaction for rotation
    let mouseDown = false;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseDown = (e) => {
      mouseDown = true;
      mouseX = e.clientX;
      mouseY = e.clientY;
      autoRotate = false;
    };

    const onMouseMove = (e) => {
      if (!mouseDown) return;
      
      const deltaX = e.clientX - mouseX;
      const deltaY = e.clientY - mouseY;
      
      if (shelfGroupRef.current) {
        shelfGroupRef.current.rotation.y += deltaX * 0.01;
        shelfGroupRef.current.rotation.x += deltaY * 0.01;
        shelfGroupRef.current.rotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, shelfGroupRef.current.rotation.x));
      }
      
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onMouseUp = () => {
      mouseDown = false;
    };

    canvasRef.current.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current || !camera || !renderer) return;
      camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      canvasRef.current?.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
    };
  }, []);

  // Update 3D shelf when boxes change
  useEffect(() => {
    if (!shelfGroupRef.current) return;

    // Clear existing shelf
    while (shelfGroupRef.current.children.length > 0) {
      const child = shelfGroupRef.current.children[0];
      shelfGroupRef.current.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
    }

    const boxSize = 1;
    const rodThickness = 0.03;
    const depth = 0.8;

    const rodMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f2635,
      roughness: 0.6,
      metalness: 0.3
    });

    // Calculate center offset
    const offsetX = -(gridSize.cols * boxSize) / 2;
    const offsetY = -(gridSize.rows * boxSize) / 2;

    // Helper function to check if a box is active
    const isBoxActive = (row, col) => {
      if (row < 0 || row >= gridSize.rows || col < 0 || col >= gridSize.cols) return false;
      return boxes.has(getCellKey(row, col));
    };

    // Helper to check if any adjacent box is active for a horizontal rod
    const shouldRenderHorizontalRod = (row, col, depth) => {
      // Check boxes above and below this rod
      const boxAbove = isBoxActive(row, col);
      const boxBelow = isBoxActive(row - 1, col);
      return boxAbove || boxBelow;
    };

    // Helper to check if any adjacent box is active for a vertical rod
    const shouldRenderVerticalRod = (row, col, depth) => {
      // Check boxes left and right of this rod
      const boxLeft = isBoxActive(row, col - 1);
      const boxRight = isBoxActive(row, col);
      return boxLeft || boxRight;
    };

    // Helper to check if any adjacent box is active for a depth rod
    const shouldRenderDepthRod = (row, col) => {
      // Check all 4 possible adjacent boxes
      const topLeft = isBoxActive(row, col);
      const topRight = isBoxActive(row, col - 1);
      const bottomLeft = isBoxActive(row - 1, col);
      const bottomRight = isBoxActive(row - 1, col - 1);
      return topLeft || topRight || bottomLeft || bottomRight;
    };

    // ========== CREATE SCAFFOLDING RODS (ONLY WHERE NEEDED) ==========
    
    // 1. HORIZONTAL RODS (left to right) - only where adjacent boxes are active
    for (let row = 0; row <= gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        // Front horizontal rod
        if (shouldRenderHorizontalRod(row, col, 'front')) {
          const frontHorizGeom = new THREE.CylinderGeometry(rodThickness, rodThickness, boxSize, 8);
          const frontHoriz = new THREE.Mesh(frontHorizGeom, rodMaterial.clone());
          frontHoriz.rotation.z = Math.PI / 2;
          frontHoriz.position.set(
            offsetX + col * boxSize + boxSize / 2,
            offsetY + row * boxSize,
            depth / 2
          );
          frontHoriz.castShadow = true;
          shelfGroupRef.current.add(frontHoriz);
        }

        // Back horizontal rod
        if (shouldRenderHorizontalRod(row, col, 'back')) {
          const backHorizGeom = new THREE.CylinderGeometry(rodThickness, rodThickness, boxSize, 8);
          const backHoriz = new THREE.Mesh(backHorizGeom, rodMaterial.clone());
          backHoriz.rotation.z = Math.PI / 2;
          backHoriz.position.set(
            offsetX + col * boxSize + boxSize / 2,
            offsetY + row * boxSize,
            -depth / 2
          );
          backHoriz.castShadow = true;
          shelfGroupRef.current.add(backHoriz);
        }
      }
    }

    // 2. VERTICAL RODS (up and down) - only where adjacent boxes are active
    for (let col = 0; col <= gridSize.cols; col++) {
      for (let row = 0; row < gridSize.rows; row++) {
        // Front vertical rod
        if (shouldRenderVerticalRod(row, col, 'front')) {
          const frontVertGeom = new THREE.CylinderGeometry(rodThickness, rodThickness, boxSize, 8);
          const frontVert = new THREE.Mesh(frontVertGeom, rodMaterial.clone());
          frontVert.position.set(
            offsetX + col * boxSize,
            offsetY + row * boxSize + boxSize / 2,
            depth / 2
          );
          frontVert.castShadow = true;
          shelfGroupRef.current.add(frontVert);
        }

        // Back vertical rod
        if (shouldRenderVerticalRod(row, col, 'back')) {
          const backVertGeom = new THREE.CylinderGeometry(rodThickness, rodThickness, boxSize, 8);
          const backVert = new THREE.Mesh(backVertGeom, rodMaterial.clone());
          backVert.position.set(
            offsetX + col * boxSize,
            offsetY + row * boxSize + boxSize / 2,
            -depth / 2
          );
          backVert.castShadow = true;
          shelfGroupRef.current.add(backVert);
        }
      }
    }

    // 3. DEPTH RODS (front to back) - only at corners where adjacent boxes are active
    for (let row = 0; row <= gridSize.rows; row++) {
      for (let col = 0; col <= gridSize.cols; col++) {
        if (shouldRenderDepthRod(row, col)) {
          const depthRodGeom = new THREE.CylinderGeometry(rodThickness, rodThickness, depth, 8);
          const depthRod = new THREE.Mesh(depthRodGeom, rodMaterial.clone());
          depthRod.rotation.x = Math.PI / 2;
          depthRod.position.set(
            offsetX + col * boxSize,
            offsetY + row * boxSize,
            0
          );
          depthRod.castShadow = true;
          shelfGroupRef.current.add(depthRod);
        }
      }
    }

    // ========== ADD COLORED WALLS FOR FILLED COMPARTMENTS ==========
    coloredItems.forEach((color, key) => {
      const [row, col] = key.split('-').map(Number);
      if (boxes.has(key)) {
        const wallMaterial = new THREE.MeshStandardMaterial({
          color: color,
          roughness: 0.6,
          metalness: 0.2
        });

        const wallThickness = 0.02;
        const wallInset = rodThickness * 2;

        // Get custom dimensions for this box (or use defaults)
        const dims = boxDimensions.get(key) || { left: 0, right: 0, top: 0, bottom: 0 };
        
        // Calculate adjusted dimensions
        const boxLeft = offsetX + col * boxSize + dims.left * boxSize;
        const boxRight = offsetX + (col + 1) * boxSize + dims.right * boxSize;
        const boxBottom = offsetY + row * boxSize + dims.bottom * boxSize;
        const boxTop = offsetY + (row + 1) * boxSize + dims.top * boxSize;
        const boxWidth = boxRight - boxLeft;
        const boxHeight = boxTop - boxBottom;
        const boxCenterX = (boxLeft + boxRight) / 2;
        const boxCenterY = (boxBottom + boxTop) / 2;

        // Back wall
        const backGeometry = new THREE.BoxGeometry(
          boxWidth - wallInset * 2,
          boxHeight - wallInset * 2,
          wallThickness
        );
        const backWall = new THREE.Mesh(backGeometry, wallMaterial.clone());
        backWall.position.set(
          boxCenterX,
          boxCenterY,
          -depth / 2
        );
        backWall.castShadow = true;
        backWall.receiveShadow = true;
        shelfGroupRef.current.add(backWall);

        // Bottom wall
        const bottomGeometry = new THREE.BoxGeometry(
          boxWidth - wallInset * 2,
          wallThickness,
          depth - wallInset
        );
        const bottomWall = new THREE.Mesh(bottomGeometry, wallMaterial.clone());
        bottomWall.position.set(
          boxCenterX,
          boxBottom + wallInset,
          0
        );
        bottomWall.castShadow = true;
        bottomWall.receiveShadow = true;
        shelfGroupRef.current.add(bottomWall);

        // Left wall
        const leftGeometry = new THREE.BoxGeometry(
          wallThickness,
          boxHeight - wallInset * 2,
          depth - wallInset
        );
        const leftWall = new THREE.Mesh(leftGeometry, wallMaterial.clone());
        leftWall.position.set(
          boxLeft + wallInset,
          boxCenterY,
          0
        );
        leftWall.castShadow = true;
        leftWall.receiveShadow = true;
        shelfGroupRef.current.add(leftWall);

        // Right wall
        const rightGeometry = new THREE.BoxGeometry(
          wallThickness,
          boxHeight - wallInset * 2,
          depth - wallInset
        );
        const rightWall = new THREE.Mesh(rightGeometry, wallMaterial.clone());
        rightWall.position.set(
          boxRight - wallInset,
          boxCenterY,
          0
        );
        rightWall.castShadow = true;
        rightWall.receiveShadow = true;
        shelfGroupRef.current.add(rightWall);

        // Top wall
        const topGeometry = new THREE.BoxGeometry(
          boxWidth - wallInset * 2,
          wallThickness,
          depth - wallInset
        );
        const topWall = new THREE.Mesh(topGeometry, wallMaterial.clone());
        topWall.position.set(
          boxCenterX,
          boxTop - wallInset,
          0
        );
        topWall.castShadow = true;
        topWall.receiveShadow = true;
        shelfGroupRef.current.add(topWall);

        // Front wall (optional - makes it fully enclosed)
        const frontGeometry = new THREE.BoxGeometry(
          boxWidth - wallInset * 2,
          boxHeight - wallInset * 2,
          wallThickness
        );
        const frontWall = new THREE.Mesh(frontGeometry, wallMaterial.clone());
        frontWall.position.set(
          boxCenterX,
          boxCenterY,
          depth / 2
        );
        frontWall.castShadow = true;
        frontWall.receiveShadow = true;
        shelfGroupRef.current.add(frontWall);
      }
    });

  }, [boxes, gridSize, coloredItems, boxDimensions]);

  const handleMouseDown = (row, col) => {
    if (editorMode === 'structure') {
      const key = getCellKey(row, col);
      const newMode = boxes.has(key) ? 'remove' : 'add';
      setDragMode(newMode);
      setIsDragging(true);
      toggleBox(row, col, newMode);
    } else if (editorMode === 'fill') {
      const key = getCellKey(row, col);
      if (boxes.has(key)) {
        addColoredItem(row, col);
      }
    }
  };

  const handleMouseEnter = (row, col) => {
    if (editorMode === 'structure' && isDragging && dragMode) {
      toggleBox(row, col, dragMode);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragMode(null);
    setDraggingWall(null);
  };

  const toggleBox = (row, col, mode) => {
    const key = getCellKey(row, col);
    setBoxes(prev => {
      const newSet = new Set(prev);
      if (mode === 'add') {
        newSet.add(key);
      } else {
        newSet.delete(key);
        // Remove colored item if box is removed
        setColoredItems(items => {
          const newItems = new Map(items);
          newItems.delete(key);
          return newItems;
        });
        // Remove custom dimensions if box is removed
        setBoxDimensions(dims => {
          const newDims = new Map(dims);
          newDims.delete(key);
          return newDims;
        });
      }
      return newSet;
    });
  };

  const addColoredItem = (row, col) => {
    const key = getCellKey(row, col);
    setColoredItems(prev => {
      const newItems = new Map(prev);
      if (newItems.has(key)) {
        newItems.delete(key);
      } else {
        newItems.set(key, selectedColor);
      }
      return newItems;
    });
  };

  const handleWallMouseDown = (boxKey, wallType, e) => {
    if (editorMode === 'resize' && coloredItems.has(boxKey)) {
      e.stopPropagation();
      setDraggingWall({ boxKey, wallType });
    }
  };

  const handleWallDrag = (e) => {
    if (!draggingWall || !gridRef.current) return;
    
    const rect = gridRef.current.getBoundingClientRect();
    const cellSize = 40; // Match the cell size in the render
    
    const [row, col] = draggingWall.boxKey.split('-').map(Number);
    const currentDims = boxDimensions.get(draggingWall.boxKey) || { left: 0, right: 0, top: 0, bottom: 0 };
    
    if (draggingWall.wallType === 'top' || draggingWall.wallType === 'bottom') {
      const relativeY = e.clientY - rect.top - 24; // Account for padding
      const cellY = row * cellSize;
      
      if (draggingWall.wallType === 'top') {
        const offset = (relativeY - cellY) / cellSize - 1;
        setBoxDimensions(prev => {
          const newDims = new Map(prev);
          newDims.set(draggingWall.boxKey, { ...currentDims, top: Math.max(-0.4, Math.min(0.4, offset)) });
          return newDims;
        });
      } else {
        const offset = (relativeY - cellY) / cellSize;
        setBoxDimensions(prev => {
          const newDims = new Map(prev);
          newDims.set(draggingWall.boxKey, { ...currentDims, bottom: Math.max(-0.4, Math.min(0.4, offset)) });
          return newDims;
        });
      }
    } else {
      const relativeX = e.clientX - rect.left - 24;
      const cellX = col * cellSize;
      
      if (draggingWall.wallType === 'right') {
        const offset = (relativeX - cellX) / cellSize - 1;
        setBoxDimensions(prev => {
          const newDims = new Map(prev);
          newDims.set(draggingWall.boxKey, { ...currentDims, right: Math.max(-0.4, Math.min(0.4, offset)) });
          return newDims;
        });
      } else {
        const offset = (relativeX - cellX) / cellSize;
        setBoxDimensions(prev => {
          const newDims = new Map(prev);
          newDims.set(draggingWall.boxKey, { ...currentDims, left: Math.max(-0.4, Math.min(0.4, offset)) });
          return newDims;
        });
      }
    }
  };

  const clearAll = () => {
    setBoxes(new Set());
    setColoredItems(new Map());
    setBoxDimensions(new Map());
  };

  const fillAll = () => {
    const newSet = new Set();
    for (let i = 0; i < gridSize.rows; i++) {
      for (let j = 0; j < gridSize.cols; j++) {
        newSet.add(getCellKey(i, j));
      }
    }
    setBoxes(newSet);
  };

  const updateGridSize = (rows, cols) => {
    setGridSize({ rows, cols });
    setBoxes(prev => {
      const newSet = new Set();
      prev.forEach(key => {
        const [r, c] = key.split('-').map(Number);
        if (r < rows && c < cols) {
          newSet.add(key);
        }
      });
      return newSet;
    });
    
    // Reset colored items that are out of bounds
    setColoredItems(prev => {
      const newItems = new Map();
      prev.forEach((color, key) => {
        const [r, c] = key.split('-').map(Number);
        if (r < rows && c < cols) {
          newItems.set(key, color);
        }
      });
      return newItems;
    });
    
    // Reset box dimensions that are out of bounds
    setBoxDimensions(prev => {
      const newDims = new Map();
      prev.forEach((dims, key) => {
        const [r, c] = key.split('-').map(Number);
        if (r < rows && c < cols) {
          newDims.set(key, dims);
        }
      });
      return newDims;
    });
    
    // Reset wall positions
    setHorizontalWalls(Array.from({ length: rows + 1 }, (_, i) => i));
    setVerticalWalls(Array.from({ length: cols + 1 }, (_, i) => i));
  };

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-2 py-6 text-primary sm:px-0">
      <div className="border-2 border-line bg-surface p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 items-center justify-center border-2 border-line bg-background">
              <Grid className="h-7 w-7 text-dhbBlue" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl uppercase">3D shelf configurator</h1>
              <p className="text-xs tracking-[0.4rem] text-muted">
                STRUCTURE · ENCLOSE · RESIZE
              </p>
            </div>
          </div>
          <div className="border-2 border-line px-5 py-3 text-xs tracking-[0.35rem] text-muted">
            BOXES {boxes.size} / {gridSize.rows * gridSize.cols}
          </div>
        </div>
      </div>

      <div className="border-2 border-line bg-surface p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <p className="text-xs tracking-[0.35rem] text-muted">GRID DIMENSIONS</p>
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-3 text-xs tracking-[0.25rem] text-muted">
                ROWS
                <input
                  type="number"
                  min="2"
                  max="12"
                  value={gridSize.rows}
                  onChange={(e) => updateGridSize(Math.max(2, Math.min(12, parseInt(e.target.value) || 8)), gridSize.cols)}
                  className="w-20 border-2 border-line bg-background px-3 py-2 text-sm text-primary focus:border-dhbBlue focus:outline-none"
                />
              </label>
              <label className="flex items-center gap-3 text-xs tracking-[0.25rem] text-muted">
                COLUMNS
                <input
                  type="number"
                  min="2"
                  max="12"
                  value={gridSize.cols}
                  onChange={(e) => updateGridSize(gridSize.rows, Math.max(2, Math.min(12, parseInt(e.target.value) || 8)))}
                  className="w-20 border-2 border-line bg-background px-3 py-2 text-sm text-primary focus:border-dhbBlue focus:outline-none"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={fillAll}
              className="flex items-center gap-3 border-2 border-primary bg-primary px-4 py-3 text-xs font-semibold tracking-[0.3rem] text-contrast transition-transform hover:-translate-y-1"
            >
              <Square className="h-4 w-4" />
              ACTIVATE ALL
            </button>
            <button
              onClick={clearAll}
              className="flex items-center gap-3 border-2 border-line px-4 py-3 text-xs font-semibold tracking-[0.3rem] text-primary transition-transform hover:-translate-y-1 hover:border-primary"
            >
              <Trash2 className="h-4 w-4" />
              CLEAR GRID
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex flex-col items-center gap-4 border-b-2 border-line pb-6 sm:flex-row sm:justify-between">
            <span className="text-xs tracking-[0.35rem] text-muted">EDITOR MODE</span>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setEditorMode('structure')}
                className={`flex items-center gap-3 border-2 px-4 py-3 text-xs font-semibold tracking-[0.3rem] transition-all ${
                  editorMode === 'structure'
                    ? 'border-primary bg-primary text-contrast'
                    : 'border-line text-primary hover:border-primary'
                }`}
              >
                <Grid className="h-4 w-4" />
                STRUCTURE
              </button>
              <button
                onClick={() => setEditorMode('fill')}
                className={`flex items-center gap-3 border-2 px-4 py-3 text-xs font-semibold tracking-[0.3rem] transition-all ${
                  editorMode === 'fill'
                    ? 'border-primary bg-primary text-contrast'
                    : 'border-line text-primary hover:border-primary'
                }`}
              >
                <Box className="h-4 w-4" />
                ENCLOSE
              </button>
              <button
                onClick={() => setEditorMode('resize')}
                className={`flex items-center gap-3 border-2 px-4 py-3 text-xs font-semibold tracking-[0.3rem] transition-all ${
                  editorMode === 'resize'
                    ? 'border-primary bg-primary text-contrast'
                    : 'border-line text-primary hover:border-primary'
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                RESIZE
              </button>
            </div>
          </div>

          {editorMode === 'fill' && (
            <div className="border-2 border-line bg-background p-4">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-xs tracking-[0.3rem] text-muted">COLOR LIBRARY</span>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`h-10 w-10 border-2 transition-all ${
                        selectedColor === color ? 'border-dhbBlue scale-110' : 'border-line hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Color swatch ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="border-2 border-line bg-background p-4 text-xs text-muted">
            {editorMode === 'structure' && (
              <p>
                <strong className="text-primary">Structure Mode:</strong> Activate or deactivate cells to sculpt the skeletal frame. Drag across the grid to paint large gestures quickly.
              </p>
            )}
            {editorMode === 'fill' && (
              <p>
                <strong className="text-primary">Enclose Mode:</strong> Coat active compartments with pigment-rich panels. Toggle to reveal or conceal storage volumes.
              </p>
            )}
            {editorMode === 'resize' && (
              <p>
                <strong className="text-primary">Resize Mode:</strong> Pull wall handles to stretch or compress individual compartments. Achieve asymmetrical brutalist compositions effortlessly.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="border-2 border-line bg-surface p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Box className="h-5 w-5 text-dhbBlue" />
              <h3 className="text-lg uppercase">3D viewport</h3>
            </div>
            <p className="text-xs tracking-[0.3rem] text-muted">DRAG TO ROTATE</p>
          </div>
          <div className="relative border-2 border-line bg-background" style={{ height: '480px' }}>
            <canvas
              ref={canvasRef}
              className="h-full w-full cursor-grab active:cursor-grabbing"
              style={{ display: 'block' }}
            />
          </div>
        </div>

        <div className="border-2 border-line bg-surface p-6">
          <div className="mb-4 flex items-center gap-3">
            <Grid className="h-5 w-5 text-dhbBlue" />
            <h3 className="text-lg uppercase">2D editor</h3>
          </div>
          <div className="flex justify-center">
            <div
              ref={gridRef}
              className="inline-block border-2 border-line bg-background p-6"
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onMouseMove={handleWallDrag}
              style={{ userSelect: 'none' }}
            >
              {editorMode === 'resize' ? (
                <div
                  className="relative border border-line"
                  style={{
                    width: `${gridSize.cols * 40}px`,
                    height: `${gridSize.rows * 40}px`,
                    backgroundColor: 'rgba(32, 34, 52, 0.65)',
                  }}
                >
                  {Array.from({ length: gridSize.rows }, (_, row) =>
                    Array.from({ length: gridSize.cols }, (_, col) => {
                      const key = getCellKey(row, col);
                      const isActive = boxes.has(key);
                      const hasWalls = coloredItems.has(key);
                      const wallColor = coloredItems.get(key);
                      const dims = boxDimensions.get(key) || { left: 0, right: 0, top: 0, bottom: 0 };

                      const boxLeft = col * 40 + dims.left * 40;
                      const boxTop = row * 40 + dims.bottom * 40;
                      const boxWidth = 40 + (dims.right - dims.left) * 40;
                      const boxHeight = 40 + (dims.top - dims.bottom) * 40;

                      return (
                        <div key={key}>
                          {isActive && (
                            <div
                              className="absolute pointer-events-none"
                              style={{
                                left: `${col * 40}px`,
                                top: `${row * 40}px`,
                                width: '40px',
                                height: '40px',
                                border: '1px dashed rgba(226, 228, 243, 0.5)',
                              }}
                            />
                          )}

                          {hasWalls && isActive && (
                            <>
                              <div
                                className="absolute transition-all duration-100"
                                style={{
                                  left: `${boxLeft}px`,
                                  top: `${boxTop}px`,
                                  width: `${boxWidth}px`,
                                  height: `${boxHeight}px`,
                                  backgroundColor: wallColor,
                                  opacity: 0.65,
                                  border: '2px solid ' + wallColor,
                                }}
                              />

                              <div
                                className="absolute cursor-ew-resize transition-colors"
                                style={{
                                  left: `${boxLeft - 2}px`,
                                  top: `${boxTop}px`,
                                  width: '4px',
                                  height: `${boxHeight}px`,
                                  backgroundColor:
                                    draggingWall?.boxKey === key && draggingWall?.wallType === 'left'
                                      ? '#004996'
                                      : '#1f2336',
                                }}
                                onMouseDown={(e) => handleWallMouseDown(key, 'left', e)}
                              />
                              <div
                                className="absolute cursor-ew-resize transition-colors"
                                style={{
                                  left: `${boxLeft + boxWidth - 2}px`,
                                  top: `${boxTop}px`,
                                  width: '4px',
                                  height: `${boxHeight}px`,
                                  backgroundColor:
                                    draggingWall?.boxKey === key && draggingWall?.wallType === 'right'
                                      ? '#004996'
                                      : '#1f2336',
                                }}
                                onMouseDown={(e) => handleWallMouseDown(key, 'right', e)}
                              />
                              <div
                                className="absolute cursor-ns-resize transition-colors"
                                style={{
                                  left: `${boxLeft}px`,
                                  top: `${boxTop + boxHeight - 2}px`,
                                  width: `${boxWidth}px`,
                                  height: '4px',
                                  backgroundColor:
                                    draggingWall?.boxKey === key && draggingWall?.wallType === 'top'
                                      ? '#004996'
                                      : '#1f2336',
                                }}
                                onMouseDown={(e) => handleWallMouseDown(key, 'top', e)}
                              />
                              <div
                                className="absolute cursor-ns-resize transition-colors"
                                style={{
                                  left: `${boxLeft}px`,
                                  top: `${boxTop - 2}px`,
                                  width: `${boxWidth}px`,
                                  height: '4px',
                                  backgroundColor:
                                    draggingWall?.boxKey === key && draggingWall?.wallType === 'bottom'
                                      ? '#004996'
                                      : '#1f2336',
                                }}
                                onMouseDown={(e) => handleWallMouseDown(key, 'bottom', e)}
                              />
                            </>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              ) : (
                <div
                  className="grid gap-1"
                  style={{
                    gridTemplateColumns: `repeat(${gridSize.cols}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${gridSize.rows}, minmax(0, 1fr))`,
                  }}
                >
                  {Array.from({ length: gridSize.rows }, (_, row) =>
                    Array.from({ length: gridSize.cols }, (_, col) => {
                      const key = getCellKey(row, col);
                      const isActive = boxes.has(key);
                      const hasItem = coloredItems.has(key);
                      const itemColor = coloredItems.get(key);
                      const dims = boxDimensions.get(key) || { left: 0, right: 0, top: 0, bottom: 0 };
                      const hasCustomDims =
                        dims.left !== 0 || dims.right !== 0 || dims.top !== 0 || dims.bottom !== 0;

                      return (
                        <div
                          key={key}
                          onMouseDown={() => handleMouseDown(row, col)}
                          onMouseEnter={() => handleMouseEnter(row, col)}
                          className={`relative h-10 w-10 cursor-pointer border-2 transition-all ${
                            isActive
                              ? 'border-primary bg-surface'
                              : 'border-dashed border-line bg-transparent'
                          } ${editorMode === 'fill' && isActive ? 'hover:opacity-80' : ''}`}
                          style={{
                            backgroundColor: hasItem && isActive ? itemColor : undefined,
                          }}
                        >
                          {hasCustomDims && isActive && (
                            <div className="absolute inset-0 flex items-center justify-center text-[10px] tracking-[0.3rem] text-muted">
                              RESIZE
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-2 border-line bg-surface p-6">
        <h3 className="text-lg uppercase">Design summary</h3>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="border-2 border-line bg-background p-5">
            <p className="text-xs tracking-[0.4rem] text-muted">GRID SIZE</p>
            <p className="mt-3 text-3xl font-semibold text-primary">
              {gridSize.rows} × {gridSize.cols}
            </p>
          </div>
          <div className="border-2 border-line bg-background p-5">
            <p className="text-xs tracking-[0.4rem] text-muted">ACTIVE COMPARTMENTS</p>
            <p className="mt-3 text-3xl font-semibold text-primary">{boxes.size}</p>
          </div>
          <div className="border-2 border-line bg-background p-5">
            <p className="text-xs tracking-[0.4rem] text-muted">ENCLOSED MODULES</p>
            <p className="mt-3 text-3xl font-semibold text-primary">{coloredItems.size}</p>
          </div>
          <div className="border-2 border-line bg-background p-5">
            <p className="text-xs tracking-[0.4rem] text-muted">COVERAGE</p>
            <p className="mt-3 text-3xl font-semibold text-primary">
              {Math.round((boxes.size / (gridSize.rows * gridSize.cols)) * 100)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}