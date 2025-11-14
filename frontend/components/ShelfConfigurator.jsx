import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Grid, Square, Trash2, RotateCcw, Copy, Box, Eye } from 'lucide-react';
import * as THREE from 'three';

const createCells = (rows, cols, predicate = () => true) => {
  const result = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (predicate(row, col)) {
        result.push(`${row}-${col}`);
      }
    }
  }
  return result;
};

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
  const [editorMode, setEditorMode] = useState('structure'); // 'structure', 'fill', 'resize', 'editWalls'
  const [coloredItems, setColoredItems] = useState(new Map()); // Map of cell keys to colors
  const [selectedColor, setSelectedColor] = useState('#004996');
  
  // Custom dimensions for each box - stores offset adjustments
  const [boxDimensions, setBoxDimensions] = useState(new Map()); // Map of cell keys to { left, right, top, bottom }
  
  // Wall editing state
  const [selectedWall, setSelectedWall] = useState(null); // { boxKey, wallType }
  const [wallProperties, setWallProperties] = useState(new Map()); // Map of "boxKey-wallType" to { color, visible, opacity }
  
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
  const minZoomDistance = 5;
  const maxZoomDistance = 25;

  const templates = useMemo(() => {
    const atriumActive = createCells(8, 8, (r, c) =>
      r === 0 ||
      r === 7 ||
      c === 0 ||
      c === 7 ||
      ((c === 3 || c === 4) && r >= 2 && r <= 5)
    );

    const galleryActive = createCells(8, 8, (r, c) =>
      c === 1 ||
      c === 6 ||
      (r >= 3 && r <= 5 && c >= 2 && c <= 5)
    );

    const cascadeActive = [];
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 10; col++) {
        if (col >= row && col <= row + 4) {
          cascadeActive.push(`${row}-${col}`);
        }
      }
    }

    const vaultActive = createCells(7, 7, (r, c) =>
      r === 3 ||
      c === 3 ||
      ((r === 1 || r === 5) && c >= 1 && c <= 5)
    );

    const serpentineActive = createCells(8, 8, (r, c) => {
      if (r < 2) return c <= 5;
      if (r < 4) return c >= 2 && c <= 7;
      if (r < 6) return c <= 4;
      return c >= 1 && c <= 6;
    });

    return [
      {
        id: 'atrium',
        name: 'Atrium Archive',
        description: 'Perimeter gallery with open core spines.',
        gridSize: { rows: 8, cols: 8 },
        activeCells: atriumActive,
        coloredCells: [
          { key: '0-1', color: '#004996' },
          { key: '0-6', color: '#F2B705' },
          { key: '7-2', color: '#E2E4F3' },
          { key: '7-5', color: '#6B6F88' },
          { key: '3-3', color: '#E2E4F3' },
          { key: '4-3', color: '#004996' },
        ],
        boxDims: [],
        wallSettings: [],
        features: ['Perimeter frame', 'Hidden fronts', 'Tiered crown'],
      },
      {
        id: 'gallery',
        name: 'Gallery Spine',
        description: 'Dual towers joined by a suspended spine.',
        gridSize: { rows: 8, cols: 8 },
        activeCells: galleryActive,
        coloredCells: [
          { key: '3-3', color: '#004996' },
          { key: '4-4', color: '#F2B705' },
          { key: '5-2', color: '#E2E4F3' },
          { key: '3-5', color: '#1A1C2E' },
          { key: '4-3', color: '#2F3246' },
          { key: '4-5', color: '#6B6F88' },
        ],
        boxDims: [],
        wallSettings: [],
        features: ['Dual spines', 'Hover plinth', 'Reveal niches'],
      },
      {
        id: 'cascade',
        name: 'Cascade Storage',
        description: 'Diagonal cascade with stepped volumes.',
        gridSize: { rows: 6, cols: 10 },
        activeCells: cascadeActive,
        coloredCells: [
          { key: '0-2', color: '#E2E4F3' },
          { key: '1-3', color: '#F2B705' },
          { key: '2-4', color: '#004996' },
          { key: '3-5', color: '#6B6F88' },
          { key: '4-6', color: '#F2B705' },
          { key: '5-7', color: '#004996' },
        ],
        boxDims: [],
        wallSettings: [],
        features: ['Diagonal cascade', 'Layered heights', 'Soft reveals'],
      },
      {
        id: 'vault',
        name: 'Vault Display',
        description: 'Cross-shaped vault with translucent bays.',
        gridSize: { rows: 7, cols: 7 },
        activeCells: vaultActive,
        coloredCells: [
          { key: '3-3', color: '#004996' },
          { key: '1-3', color: '#F2B705' },
          { key: '5-3', color: '#E2E4F3' },
          { key: '3-2', color: '#6B6F88' },
          { key: '3-4', color: '#F2B705' },
        ],
        boxDims: [],
        wallSettings: [],
        features: ['Central vault', 'Translucent bays', 'Monumental cross'],
      },
      {
        id: 'serpentine',
        name: 'Serpentine Loft',
        description: 'S-curve shelving with color blocking.',
        gridSize: { rows: 8, cols: 8 },
        activeCells: serpentineActive,
        coloredCells: [
          { key: '0-2', color: '#E2E4F3' },
          { key: '0-3', color: '#2F3246' },
          { key: '1-2', color: '#1A1C2E' },
          { key: '1-3', color: '#E2E4F3' },
          { key: '1-4', color: '#1A1C2E' },
          { key: '2-3', color: '#F2B705' },
          { key: '3-2', color: '#004996' },
          { key: '3-3', color: '#1A1C2E' },
          { key: '3-4', color: '#E2E4F3' },
          { key: '4-1', color: '#1A1C2E' },
          { key: '4-2', color: '#6B6F88' },
          { key: '5-4', color: '#E2E4F3' },
          { key: '5-5', color: '#6B6F88' },
          { key: '6-4', color: '#1A1C2E' },
          { key: '6-5', color: '#004996' },
          { key: '6-6', color: '#E2E4F3' },
          { key: '7-4', color: '#2F3246' },
          { key: '7-5', color: '#E2E4F3' },
        ],
        boxDims: [],
        wallSettings: [
          { key: '0-2', wallType: 'front', props: { visible: false } },
          { key: '0-3', wallType: 'front', props: { visible: false } },
          { key: '1-2', wallType: 'right', props: { visible: false } },
          { key: '1-4', wallType: 'left', props: { visible: false } },
          { key: '2-3', wallType: 'front', props: { opacity: 0.2 } },
          { key: '3-2', wallType: 'front', props: { visible: false } },
          { key: '3-4', wallType: 'front', props: { visible: false } },
          { key: '4-1', wallType: 'front', props: { visible: false } },
          { key: '4-2', wallType: 'front', props: { opacity: 0.6 } },
          { key: '5-4', wallType: 'back', props: { opacity: 0.3 } },
          { key: '6-4', wallType: 'front', props: { visible: false } },
          { key: '6-5', wallType: 'front', props: { visible: false } },
          { key: '7-4', wallType: 'front', props: { visible: false } },
        ],
        features: ['Serpentine flow', 'Color blocking', 'Varied depths'],
      },
    ];
  }, []);

  const getCellKey = (row, col) => `${row}-${col}`;
  
  // Helper functions for wall properties
  const getWallKey = (boxKey, wallType) => `${boxKey}-${wallType}`;
  
  const getWallProperty = (boxKey, wallType, property, defaultValue) => {
    const wallKey = getWallKey(boxKey, wallType);
    const props = wallProperties.get(wallKey);
    return props ? (props[property] ?? defaultValue) : defaultValue;
  };
  
  const setWallProperty = (boxKey, wallType, property, value) => {
    const wallKey = getWallKey(boxKey, wallType);
    setWallProperties(prev => {
      const newProps = new Map(prev);
      const currentProps = newProps.get(wallKey) || {};
      newProps.set(wallKey, { ...currentProps, [property]: value });
      return newProps;
    });
  };
  
  const handleWallClick = (boxKey, wallType, e) => {
    if (editorMode === 'editWalls' && coloredItems.has(boxKey)) {
      e.stopPropagation();
      setSelectedWall({ boxKey, wallType });
    }
  };

  const applyTemplate = (template) => {
    const {
      gridSize: templateGrid,
      activeCells = [],
      coloredCells = [],
      boxDims = [],
      wallSettings = [],
    } = template;

    const combinedActive = new Set(activeCells);
    coloredCells.forEach(({ key }) => combinedActive.add(key));
    boxDims.forEach(({ key }) => combinedActive.add(key));
    wallSettings.forEach(({ key }) => combinedActive.add(key));

    setGridSize(templateGrid);
    setBoxes(combinedActive);
    setColoredItems(new Map(coloredCells.map(({ key, color }) => [key, color])));
    setBoxDimensions(new Map(boxDims.map(({ key, dims }) => [key, dims])));
    setWallProperties(
      new Map(wallSettings.map(({ key, wallType, props }) => [`${key}-${wallType}`, props]))
    );
    setSelectedWall(null);
    setEditorMode('structure');
  };

  // Initialize 3D scene
  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      50,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(12, 10, 12);
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 15, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });
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
      
      // Check for wall click in edit mode
      if (editorMode === 'editWalls') {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const rect = canvasRef.current.getBoundingClientRect();
        
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(shelfGroupRef.current.children);
        
        if (intersects.length > 0) {
          const clickedObject = intersects[0].object;
          if (clickedObject.userData.boxKey && clickedObject.userData.wallType) {
            setSelectedWall({
              boxKey: clickedObject.userData.boxKey,
              wallType: clickedObject.userData.wallType
            });
            mouseDown = false; // Don't rotate when clicking walls
          }
        }
      }
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

    const onWheel = (e) => {
      e.preventDefault();
      const camera = cameraRef.current;
      if (!camera) return;

      const currentDistance = camera.position.length();
      const newDistance = THREE.MathUtils.clamp(
        currentDistance + e.deltaY * 0.01,
        minZoomDistance,
        maxZoomDistance
      );

      const direction = camera.position.clone().normalize();
      camera.position.copy(direction.multiplyScalar(newDistance));
    };

    canvasRef.current.addEventListener('mousedown', onMouseDown);
    canvasRef.current.addEventListener('wheel', onWheel, { passive: false });
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
      canvasRef.current?.removeEventListener('wheel', onWheel);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
    };
  }, [editorMode, minZoomDistance, maxZoomDistance]);

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
      color: 0x8b4513,
      roughness: 0.7,
      metalness: 0.2
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
      const wallThickness = 0.02;
      const coverageOffset = rodThickness * 2;
      const lateralThickness = wallThickness + coverageOffset;
      const verticalThickness = wallThickness + coverageOffset;
      const depthThickness = wallThickness + coverageOffset;

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

      const expandedWidth = boxWidth + coverageOffset * 2;
      const expandedHeight = boxHeight + coverageOffset * 2;
      const expandedDepth = depth + coverageOffset * 2;

      // Wall types and their properties
      const wallTypes = [
        { 
          type: 'back', 
          geometry: new THREE.BoxGeometry(expandedWidth, expandedHeight, depthThickness),
          position: [boxCenterX, boxCenterY, -depth / 2 - depthThickness / 2]
        },
        { 
          type: 'bottom', 
          geometry: new THREE.BoxGeometry(expandedWidth, verticalThickness, expandedDepth),
          position: [boxCenterX, boxBottom - verticalThickness / 2, 0]
        },
        { 
          type: 'left', 
          geometry: new THREE.BoxGeometry(lateralThickness, expandedHeight, expandedDepth),
          position: [boxLeft - lateralThickness / 2, boxCenterY, 0]
        },
        { 
          type: 'right', 
          geometry: new THREE.BoxGeometry(lateralThickness, expandedHeight, expandedDepth),
          position: [boxRight + lateralThickness / 2, boxCenterY, 0]
        },
        { 
          type: 'top', 
          geometry: new THREE.BoxGeometry(expandedWidth, verticalThickness, expandedDepth),
          position: [boxCenterX, boxTop + verticalThickness / 2, 0]
        },
        { 
          type: 'front', 
          geometry: new THREE.BoxGeometry(expandedWidth, expandedHeight, depthThickness),
          position: [boxCenterX, boxCenterY, depth / 2 + depthThickness / 2]
        }
      ];

      wallTypes.forEach(({ type, geometry, position }) => {
        // Get individual wall properties
        const wallColor = getWallProperty(key, type, 'color', color);
        const wallVisible = getWallProperty(key, type, 'visible', true);
        const wallOpacity = getWallProperty(key, type, 'opacity', 1);
        
        if (!wallVisible) return; // Skip if wall is hidden
        
        const wallMaterial = new THREE.MeshStandardMaterial({
          color: wallColor,
          roughness: 0.6,
          metalness: 0.2,
          transparent: wallOpacity < 1,
          opacity: wallOpacity
        });

        const wall = new THREE.Mesh(geometry, wallMaterial);
        wall.position.set(...position);
        wall.castShadow = true;
        wall.receiveShadow = true;
        
        // Add user data for selection
        wall.userData = { boxKey: key, wallType: type };
        
        // Highlight if selected
        if (selectedWall && selectedWall.boxKey === key && selectedWall.wallType === type) {
          const highlightMaterial = new THREE.MeshStandardMaterial({
            color: 0xF7B801,
            roughness: 0.3,
            metalness: 0.5,
            emissive: 0xF7B801,
            emissiveIntensity: 0.3
          });
          wall.material = highlightMaterial;
        }
        
        shelfGroupRef.current.add(wall);
      });
    });

  }, [boxes, gridSize, coloredItems, boxDimensions, wallProperties, selectedWall, getWallProperty]);

  const handleMouseDown = (row, col) => {
    if (editorMode === 'structure') {
      const key = getCellKey(row, col);
      const newMode = boxes.has(key) ? 'remove' : 'add';
      setDragMode(newMode);
      setIsDragging(true);
      toggleBox(row, col, newMode);
    } else if (editorMode === 'fill') {
      addColoredItem(row, col);
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
                STRUCTURE · ENCLOSE · EDIT WALLS · RESIZE
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
                onClick={() => { setEditorMode('structure'); setSelectedWall(null); }}
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
                onClick={() => { setEditorMode('fill'); setSelectedWall(null); }}
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
                onClick={() => { setEditorMode('editWalls'); }}
                className={`flex items-center gap-3 border-2 px-4 py-3 text-xs font-semibold tracking-[0.3rem] transition-all ${
                  editorMode === 'editWalls'
                    ? 'border-primary bg-primary text-contrast'
                    : 'border-line text-primary hover:border-primary'
                }`}
              >
                <Eye className="h-4 w-4" />
                EDIT WALLS
              </button>
              <button
                onClick={() => { setEditorMode('resize'); setSelectedWall(null); }}
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
            {editorMode === 'editWalls' && (
              <p>
                <strong className="text-primary">Edit Walls Mode:</strong> Isolate and modify individual wall surfaces. Click any panel in 2D or 3D space to adjust color, opacity, and visibility independently.
              </p>
            )}
            {editorMode === 'resize' && (
              <p>
                <strong className="text-primary">Resize Mode:</strong> Pull wall handles to stretch or compress individual compartments. Achieve asymmetrical brutalist compositions effortlessly.
              </p>
            )}
          </div>

          {editorMode === 'editWalls' && selectedWall && (
            <div className="border-2 border-dhbBlue bg-background p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xs font-semibold tracking-[0.3rem] text-primary">
                  {selectedWall.wallType.toUpperCase()} WALL PROPERTIES
                </h3>
                <button
                  onClick={() => setSelectedWall(null)}
                  className="text-muted hover:text-primary"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs tracking-[0.25rem] text-muted">COLOR</label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setWallProperty(selectedWall.boxKey, selectedWall.wallType, 'color', color)}
                        className={`h-8 w-8 border-2 transition-all ${
                          getWallProperty(selectedWall.boxKey, selectedWall.wallType, 'color', coloredItems.get(selectedWall.boxKey)) === color 
                            ? 'border-dhbBlue scale-110' : 'border-line hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-xs tracking-[0.25rem] text-muted">VISIBILITY</label>
                  <button
                    onClick={() => {
                      const currentVisibility = getWallProperty(selectedWall.boxKey, selectedWall.wallType, 'visible', true);
                      setWallProperty(selectedWall.boxKey, selectedWall.wallType, 'visible', !currentVisibility);
                    }}
                    className={`border-2 px-4 py-1 text-xs font-semibold tracking-[0.25rem] transition-colors ${
                      getWallProperty(selectedWall.boxKey, selectedWall.wallType, 'visible', true)
                        ? 'border-primary bg-primary text-contrast'
                        : 'border-line text-muted'
                    }`}
                  >
                    {getWallProperty(selectedWall.boxKey, selectedWall.wallType, 'visible', true) ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs tracking-[0.25rem] text-muted">OPACITY</label>
                    <span className="text-xs text-primary">
                      {Math.round(getWallProperty(selectedWall.boxKey, selectedWall.wallType, 'opacity', 1) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={getWallProperty(selectedWall.boxKey, selectedWall.wallType, 'opacity', 1)}
                    onChange={(e) => setWallProperty(selectedWall.boxKey, selectedWall.wallType, 'opacity', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <button
                  onClick={() => {
                    const wallKey = getWallKey(selectedWall.boxKey, selectedWall.wallType);
                    setWallProperties(prev => {
                      const newProps = new Map(prev);
                      newProps.delete(wallKey);
                      return newProps;
                    });
                  }}
                  className="w-full border-2 border-line px-4 py-2 text-xs font-semibold tracking-[0.25rem] text-primary transition-all hover:border-primary"
                >
                  RESET TO DEFAULT
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="border-2 border-line bg-surface p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Box className="h-5 w-5 text-dhbBlue" />
                <h3 className="text-lg uppercase">3D viewport</h3>
              </div>
              <p className="text-xs tracking-[0.3rem] text-muted">
                {editorMode === 'editWalls' ? 'CLICK WALLS' : 'DRAG · SCROLL TO ZOOM'}
              </p>
            </div>
            <div className="relative border-2 border-line bg-background" style={{ height: '500px' }}>
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

                          {isActive && (
                              <>
                                <div
                                  className="absolute transition-all duration-100"
                                  style={{
                                    left: `${boxLeft}px`,
                                    top: `${boxTop}px`,
                                    width: `${boxWidth}px`,
                                    height: `${boxHeight}px`,
                                  backgroundColor: hasWalls ? wallColor : 'rgba(111, 116, 137, 0.35)',
                                  opacity: hasWalls ? 0.65 : 0.35,
                                  border: `2px solid ${hasWalls ? wallColor : 'rgba(111, 116, 137, 0.5)'}`,
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
                ) : editorMode === 'editWalls' ? (
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
                        const hasWalls = coloredItems.has(key);
                        const baseColor = coloredItems.get(key);

                        if (!hasWalls) return null;

                        return (
                          <div
                            key={key}
                            className="absolute"
                            style={{ left: `${col * 40}px`, top: `${row * 40}px`, width: '40px', height: '40px' }}
                          >
                            <div
                              className="absolute cursor-pointer transition-opacity hover:opacity-80"
                              style={{
                                left: '0px',
                                top: '4px',
                                width: '6px',
                                height: '32px',
                                backgroundColor: getWallProperty(key, 'left', 'color', baseColor),
                                opacity: getWallProperty(key, 'left', 'visible', true) ? getWallProperty(key, 'left', 'opacity', 1) : 0.2,
                                border: selectedWall?.boxKey === key && selectedWall?.wallType === 'left' ? '2px solid #F7B801' : '1px solid rgba(0,0,0,0.2)',
                              }}
                              onClick={(e) => handleWallClick(key, 'left', e)}
                            />
                            <div
                              className="absolute cursor-pointer transition-opacity hover:opacity-80"
                              style={{
                                right: '0px',
                                top: '4px',
                                width: '6px',
                                height: '32px',
                                backgroundColor: getWallProperty(key, 'right', 'color', baseColor),
                                opacity: getWallProperty(key, 'right', 'visible', true) ? getWallProperty(key, 'right', 'opacity', 1) : 0.2,
                                border: selectedWall?.boxKey === key && selectedWall?.wallType === 'right' ? '2px solid #F7B801' : '1px solid rgba(0,0,0,0.2)',
                              }}
                              onClick={(e) => handleWallClick(key, 'right', e)}
                            />
                            <div
                              className="absolute cursor-pointer transition-opacity hover:opacity-80"
                              style={{
                                left: '4px',
                                top: '0px',
                                width: '32px',
                                height: '6px',
                                backgroundColor: getWallProperty(key, 'top', 'color', baseColor),
                                opacity: getWallProperty(key, 'top', 'visible', true) ? getWallProperty(key, 'top', 'opacity', 1) : 0.2,
                                border: selectedWall?.boxKey === key && selectedWall?.wallType === 'top' ? '2px solid #F7B801' : '1px solid rgba(0,0,0,0.2)',
                              }}
                              onClick={(e) => handleWallClick(key, 'top', e)}
                            />
                            <div
                              className="absolute cursor-pointer transition-opacity hover:opacity-80"
                              style={{
                                left: '4px',
                                bottom: '0px',
                                width: '32px',
                                height: '6px',
                                backgroundColor: getWallProperty(key, 'bottom', 'color', baseColor),
                                opacity: getWallProperty(key, 'bottom', 'visible', true) ? getWallProperty(key, 'bottom', 'opacity', 1) : 0.2,
                                border: selectedWall?.boxKey === key && selectedWall?.wallType === 'bottom' ? '2px solid #F7B801' : '1px solid rgba(0,0,0,0.2)',
                              }}
                              onClick={(e) => handleWallClick(key, 'bottom', e)}
                            />
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                              <div className="h-2 w-2 rounded-full bg-muted opacity-50" />
                            </div>
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
                              hasItem
                                ? 'border-primary bg-surface'
                                : isActive
                                  ? 'border-line bg-background'
                                  : 'border-dashed border-line bg-transparent'
                            } ${editorMode === 'fill' ? 'hover:opacity-80' : ''}`}
                            style={{
                              backgroundColor: hasItem ? itemColor : undefined,
                            }}
                          >
                            {hasCustomDims && hasItem && (
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
          <div className="mb-4">
            <p className="text-xs tracking-[0.4rem] text-muted">TEMPLATES</p>
            <h3 className="text-xl uppercase text-primary">Quickstart layouts</h3>
            <p className="text-sm text-muted">
              Load curated compositions that combine structure, enclosure, resizing, and wall edits.
            </p>
          </div>
          <div className="space-y-4">
            {templates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => applyTemplate(template)}
                className="w-full border-2 border-line bg-background p-4 text-left transition-transform hover:-translate-y-1 hover:border-primary"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase text-primary">{template.name}</p>
                    <p className="text-xs text-muted">{template.description}</p>
                  </div>
                  <div className="text-right text-[11px] uppercase tracking-[0.25rem] text-muted">
                    <p>
                      {template.gridSize.rows}×{template.gridSize.cols}
                    </p>
                    <p>{template.activeCells.length} mods</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(template.features || []).map((feature) => (
                    <span
                      key={`${template.id}-${feature}`}
                      className="border border-line px-2 py-1 text-[10px] tracking-[0.2rem] text-muted"
                    >
                      {feature.toUpperCase()}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex gap-1">
                  {(template.coloredCells || []).slice(0, 4).map(({ color }, idx) => (
                    <span
                      key={`${template.id}-color-${idx}`}
                      className="h-3 w-6 border border-line"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="mt-4 text-right text-xs font-semibold tracking-[0.3rem] text-primary">
                  LOAD LAYOUT
                </div>
              </button>
            ))}
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