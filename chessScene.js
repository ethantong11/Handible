// chessScene.js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { setSceneObjects } from "./sceneManager.js";
import { handConfig } from "./handTracking.js";
import { ChessGame } from "./chessGame.js";

// Chess piece models
function createPawnModel() {
  const group = new THREE.Group();
  
  // Base
  const baseGeometry = new THREE.CylinderGeometry(0.08, 0.09, 0.03, 32);
  const base = new THREE.Mesh(baseGeometry);
  base.position.y = 0.015;
  group.add(base);
  
  // Body
  const bodyGeometry = new THREE.CylinderGeometry(0.06, 0.08, 0.1, 32);
  const body = new THREE.Mesh(bodyGeometry);
  body.position.y = 0.08;
  group.add(body);
  
  // Head
  const headGeometry = new THREE.SphereGeometry(0.04, 32, 16);
  const head = new THREE.Mesh(headGeometry);
  head.position.y = 0.15;
  group.add(head);
  
  return group;
}

function createRookModel() {
  const group = new THREE.Group();
  
  // Base
  const baseGeometry = new THREE.CylinderGeometry(0.08, 0.09, 0.03, 32);
  const base = new THREE.Mesh(baseGeometry);
  base.position.y = 0.015;
  group.add(base);
  
  // Body
  const bodyGeometry = new THREE.CylinderGeometry(0.07, 0.08, 0.12, 32);
  const body = new THREE.Mesh(bodyGeometry);
  body.position.y = 0.09;
  group.add(body);
  
  // Top
  const topGeometry = new THREE.BoxGeometry(0.12, 0.04, 0.12);
  const top = new THREE.Mesh(topGeometry);
  top.position.y = 0.17;
  group.add(top);
  
  // Battlements
  const battlementGeometry = new THREE.BoxGeometry(0.025, 0.03, 0.025);
  const positions = [
    [-0.04, 0.2, -0.04], [0, 0.2, -0.04], [0.04, 0.2, -0.04],
    [-0.04, 0.2, 0.04], [0, 0.2, 0.04], [0.04, 0.2, 0.04],
    [-0.04, 0.2, 0], [0.04, 0.2, 0]
  ];
  positions.forEach(pos => {
    const battlement = new THREE.Mesh(battlementGeometry);
    battlement.position.set(pos[0], pos[1], pos[2]);
    group.add(battlement);
  });
  
  return group;
}

function createKnightModel() {
  const group = new THREE.Group();
  
  // Base
  const baseGeometry = new THREE.CylinderGeometry(0.08, 0.09, 0.03, 32);
  const base = new THREE.Mesh(baseGeometry);
  base.position.y = 0.015;
  group.add(base);
  
  // Body (curved)
  const bodyGeometry = new THREE.CylinderGeometry(0.06, 0.08, 0.08, 32);
  const body = new THREE.Mesh(bodyGeometry);
  body.position.y = 0.07;
  group.add(body);
  
  // Head (elongated)
  const headGeometry = new THREE.BoxGeometry(0.04, 0.08, 0.1);
  const head = new THREE.Mesh(headGeometry);
  head.position.set(0.02, 0.13, 0);
  head.rotation.z = -0.3;
  group.add(head);
  
  // Mane
  const maneGeometry = new THREE.BoxGeometry(0.02, 0.04, 0.08);
  const mane = new THREE.Mesh(maneGeometry);
  mane.position.set(-0.01, 0.15, 0);
  group.add(mane);
  
  return group;
}

function createBishopModel() {
  const group = new THREE.Group();
  
  // Base
  const baseGeometry = new THREE.CylinderGeometry(0.08, 0.09, 0.03, 32);
  const base = new THREE.Mesh(baseGeometry);
  base.position.y = 0.015;
  group.add(base);
  
  // Body
  const bodyGeometry = new THREE.CylinderGeometry(0.05, 0.08, 0.14, 32);
  const body = new THREE.Mesh(bodyGeometry);
  body.position.y = 0.1;
  group.add(body);
  
  // Head
  const headGeometry = new THREE.SphereGeometry(0.035, 32, 16);
  const head = new THREE.Mesh(headGeometry);
  head.position.y = 0.18;
  group.add(head);
  
  // Top point
  const topGeometry = new THREE.ConeGeometry(0.015, 0.03, 16);
  const top = new THREE.Mesh(topGeometry);
  top.position.y = 0.22;
  group.add(top);
  
  return group;
}

function createQueenModel() {
  const group = new THREE.Group();
  
  // Base
  const baseGeometry = new THREE.CylinderGeometry(0.08, 0.09, 0.03, 32);
  const base = new THREE.Mesh(baseGeometry);
  base.position.y = 0.015;
  group.add(base);
  
  // Body
  const bodyGeometry = new THREE.CylinderGeometry(0.06, 0.08, 0.15, 32);
  const body = new THREE.Mesh(bodyGeometry);
  body.position.y = 0.105;
  group.add(body);
  
  // Crown base
  const crownBaseGeometry = new THREE.CylinderGeometry(0.07, 0.06, 0.03, 32);
  const crownBase = new THREE.Mesh(crownBaseGeometry);
  crownBase.position.y = 0.195;
  group.add(crownBase);
  
  // Crown points
  const pointGeometry = new THREE.ConeGeometry(0.015, 0.04, 8);
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const point = new THREE.Mesh(pointGeometry);
    point.position.set(Math.cos(angle) * 0.04, 0.23, Math.sin(angle) * 0.04);
    group.add(point);
  }
  
  // Crown jewel
  const jewelGeometry = new THREE.SphereGeometry(0.015, 16, 16);
  const jewel = new THREE.Mesh(jewelGeometry);
  jewel.position.y = 0.23;
  group.add(jewel);
  
  return group;
}

function createKingModel() {
  const group = new THREE.Group();
  
  // Base
  const baseGeometry = new THREE.CylinderGeometry(0.08, 0.09, 0.03, 32);
  const base = new THREE.Mesh(baseGeometry);
  base.position.y = 0.015;
  group.add(base);
  
  // Body
  const bodyGeometry = new THREE.CylinderGeometry(0.06, 0.08, 0.16, 32);
  const body = new THREE.Mesh(bodyGeometry);
  body.position.y = 0.11;
  group.add(body);
  
  // Crown base
  const crownBaseGeometry = new THREE.CylinderGeometry(0.07, 0.06, 0.03, 32);
  const crownBase = new THREE.Mesh(crownBaseGeometry);
  crownBase.position.y = 0.205;
  group.add(crownBase);
  
  // Cross vertical
  const crossVertGeometry = new THREE.BoxGeometry(0.015, 0.06, 0.015);
  const crossVert = new THREE.Mesh(crossVertGeometry);
  crossVert.position.y = 0.25;
  group.add(crossVert);
  
  // Cross horizontal
  const crossHorGeometry = new THREE.BoxGeometry(0.04, 0.015, 0.015);
  const crossHor = new THREE.Mesh(crossHorGeometry);
  crossHor.position.y = 0.26;
  group.add(crossHor);
  
  return group;
}

export function setupChessScene() {
  let scene, camera, renderer, controls;
  let chessGame;
  let boardGroup, piecesGroup;
  let selectedPiece = null;
  let validMoveHighlights = [];

  scene = new THREE.Scene();
  
  // Gradient background
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  const gradient = context.createLinearGradient(0, 0, 0, 512);
  gradient.addColorStop(0, '#1e3c72');
  gradient.addColorStop(0.5, '#2a5298');
  gradient.addColorStop(1, '#87ceeb');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 512, 512);
  const gradientTexture = new THREE.CanvasTexture(canvas);
  scene.background = gradientTexture;
  
  // Add fog for depth
  scene.fog = new THREE.Fog(0x87ceeb, 5, 15);

  // Floor
  const floorGeometry = new THREE.PlaneGeometry(15, 15);
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x2c3e50,
    roughness: 0.3,
    metalness: 0.7
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Chess table
  const tableGeometry = new THREE.BoxGeometry(4, 0.2, 4);
  const tableMaterial = new THREE.MeshStandardMaterial({
    color: 0x654321,
    roughness: 0.5,
    metalness: 0.2
  });
  const tableTop = new THREE.Mesh(tableGeometry, tableMaterial);
  tableTop.position.set(0, -1, -1);
  tableTop.castShadow = true;
  tableTop.receiveShadow = true;
  tableTop.userData.isTable = true;
  scene.add(tableTop);

  // Table legs
  const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 32);
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0x4a3018 });
  const positions = [
    { x: 1.8, z: 0.8 }, { x: 1.8, z: -2.8 },
    { x: -1.8, z: 0.8 }, { x: -1.8, z: -2.8 }
  ];
  positions.forEach(pos => {
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(pos.x, -1.6, pos.z);
    leg.castShadow = true;
    scene.add(leg);
  });

  // Create chessboard
  boardGroup = new THREE.Group();
  boardGroup.userData.isChessboard = true;
  const squareSize = 0.25;
  const boardSize = 8;
  const halfSize = (boardSize * squareSize) / 2;

  // Board squares
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const isWhiteSquare = (row + col) % 2 === 0;
      const color = isWhiteSquare ? 0xf0d9b5 : 0xb58863;
      
      const squareGeometry = new THREE.PlaneGeometry(squareSize, squareSize);
      const squareMaterial = new THREE.MeshStandardMaterial({ 
        color, 
        side: THREE.DoubleSide,
        roughness: 0.8,
        metalness: 0.1
      });
      const square = new THREE.Mesh(squareGeometry, squareMaterial);
      
      square.position.set(
        (col * squareSize) - halfSize + squareSize / 2,
        0.101,
        (row * squareSize) - halfSize + squareSize / 2
      );
      square.rotation.x = -Math.PI / 2;
      square.userData = {
        row,
        col,
        defaultColor: color,
        isSquare: true
      };
      boardGroup.add(square);
    }
  }

  // Board border
  const borderThickness = 0.05;
  const borderHeight = 0.03;
  const borderMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x4a3018,
    roughness: 0.6,
    metalness: 0.3
  });

  // Create border pieces
  const borderPositions = [
    { size: [boardSize * squareSize + borderThickness * 2, borderHeight, borderThickness], pos: [0, 0.115, halfSize + borderThickness/2] },
    { size: [boardSize * squareSize + borderThickness * 2, borderHeight, borderThickness], pos: [0, 0.115, -halfSize - borderThickness/2] },
    { size: [borderThickness, borderHeight, boardSize * squareSize], pos: [halfSize + borderThickness/2, 0.115, 0] },
    { size: [borderThickness, borderHeight, boardSize * squareSize], pos: [-halfSize - borderThickness/2, 0.115, 0] }
  ];

  borderPositions.forEach(config => {
    const borderGeometry = new THREE.BoxGeometry(...config.size);
    const border = new THREE.Mesh(borderGeometry, borderMaterial);
    border.position.set(...config.pos);
    border.castShadow = true;
    boardGroup.add(border);
  });

  boardGroup.position.set(0, 0, 0);
  tableTop.add(boardGroup);

  // Initialize chess game
  chessGame = new ChessGame();
  
  // Create pieces group
  piecesGroup = new THREE.Group();
  boardGroup.add(piecesGroup);

  // Function to create a chess piece mesh
  function createPieceMesh(type, isWhite, position) {
    let pieceModel;
    
    switch(type) {
      case 'pawn': pieceModel = createPawnModel(); break;
      case 'rook': pieceModel = createRookModel(); break;
      case 'knight': pieceModel = createKnightModel(); break;
      case 'bishop': pieceModel = createBishopModel(); break;
      case 'queen': pieceModel = createQueenModel(); break;
      case 'king': pieceModel = createKingModel(); break;
    }

    const material = new THREE.MeshStandardMaterial({
      color: isWhite ? 0xffffff : 0x333333,
      roughness: 0.2,
      metalness: 0.5
    });

    // Apply material to all meshes in the group
    pieceModel.traverse(child => {
      if (child.isMesh) {
        child.material = material;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Calculate world position
    const worldX = (position.col * squareSize) - halfSize + squareSize / 2;
    const worldZ = (position.row * squareSize) - halfSize + squareSize / 2;
    
    pieceModel.position.set(worldX, 0.1, worldZ);
    
    // Store piece data
    pieceModel.userData = {
      type,
      isWhite,
      row: position.row,
      col: position.col,
      isGrabbable: true,
      isPiece: true,
      defaultColor: isWhite ? 0xffffff : 0x333333
    };

    return pieceModel;
  }

  // Setup initial board position
  function setupInitialPosition() {
    const board = chessGame.getBoard();
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece) {
          const pieceMesh = createPieceMesh(piece.type, piece.isWhite, { row, col });
          piecesGroup.add(pieceMesh);
        }
      }
    }
  }

  setupInitialPosition();

  // Camera setup
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 2);

  // Renderer setup
  const canvasElement = document.getElementById("threeCanvas");
  renderer = new THREE.WebGLRenderer({ canvas: canvasElement, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;
  controls.minDistance = 1;
  controls.maxDistance = 10;
  controls.target.set(0, -0.5, -1);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
  keyLight.position.set(5, 10, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 50;
  keyLight.shadow.camera.left = -10;
  keyLight.shadow.camera.right = 10;
  keyLight.shadow.camera.top = 10;
  keyLight.shadow.camera.bottom = -10;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffa726, 0.4);
  fillLight.position.set(-5, 5, 3);
  scene.add(fillLight);

  const rimLight = new THREE.SpotLight(0xffffff, 0.8, 10, Math.PI / 4, 0.5, 2);
  rimLight.position.set(-3, 4, 3);
  rimLight.target.position.set(0, 0, -1);
  scene.add(rimLight);
  scene.add(rimLight.target);

  // Set hand tracking offsets for chess scene
  handConfig.xScale = 2;
  handConfig.yScale = -2;
  handConfig.zMagnification = 2;
  handConfig.zOffset = 0;
  handConfig.rotationOffset.set(0, 0, 0);

  // Store scene objects
  setSceneObjects({ scene, camera, renderer, controls });
  
  // Export chess game instance for gesture control
  window.chessGame = chessGame;
  window.piecesGroup = piecesGroup;
  window.boardGroup = boardGroup;
}
