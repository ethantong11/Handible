// chessGame.js
export class ChessGame {
  constructor() {
    this.board = [];
    this.currentTurn = 'white';
    this.selectedPiece = null;
    this.validMoves = [];
    this.enPassantTarget = null;
    this.castlingRights = {
      whiteKingSide: true,
      whiteQueenSide: true,
      blackKingSide: true,
      blackQueenSide: true
    };
    this.moveHistory = [];
    this.capturedPieces = { white: [], black: [] };
    
    this.initializeBoard();
  }

  initializeBoard() {
    // Initialize empty board
    for (let row = 0; row < 8; row++) {
      this.board[row] = [];
      for (let col = 0; col < 8; col++) {
        this.board[row][col] = null;
      }
    }

    // Place pieces in starting positions
    // Black pieces (rows 0-1)
    this.board[0] = [
      { type: 'rook', isWhite: false },
      { type: 'knight', isWhite: false },
      { type: 'bishop', isWhite: false },
      { type: 'queen', isWhite: false },
      { type: 'king', isWhite: false },
      { type: 'bishop', isWhite: false },
      { type: 'knight', isWhite: false },
      { type: 'rook', isWhite: false }
    ];
    
    for (let col = 0; col < 8; col++) {
      this.board[1][col] = { type: 'pawn', isWhite: false };
    }

    // White pieces (rows 6-7)
    for (let col = 0; col < 8; col++) {
      this.board[6][col] = { type: 'pawn', isWhite: true };
    }
    
    this.board[7] = [
      { type: 'rook', isWhite: true },
      { type: 'knight', isWhite: true },
      { type: 'bishop', isWhite: true },
      { type: 'queen', isWhite: true },
      { type: 'king', isWhite: true },
      { type: 'bishop', isWhite: true },
      { type: 'knight', isWhite: true },
      { type: 'rook', isWhite: true }
    ];
  }

  getBoard() {
    return this.board;
  }

  getPieceAt(row, col) {
    if (row < 0 || row > 7 || col < 0 || col > 7) return null;
    return this.board[row][col];
  }

  isValidPosition(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  isSquareEmpty(row, col) {
    return this.isValidPosition(row, col) && this.board[row][col] === null;
  }

  isEnemyPiece(row, col, isWhite) {
    const piece = this.getPieceAt(row, col);
    return piece !== null && piece.isWhite !== isWhite;
  }

  canCapture(row, col, isWhite) {
    return this.isValidPosition(row, col) && 
           (this.isSquareEmpty(row, col) || this.isEnemyPiece(row, col, isWhite));
  }

  getValidMoves(row, col) {
    const piece = this.getPieceAt(row, col);
    if (!piece) return [];

    const moves = [];
    const { type, isWhite } = piece;

    switch (type) {
      case 'pawn':
        moves.push(...this.getPawnMoves(row, col, isWhite));
        break;
      case 'rook':
        moves.push(...this.getRookMoves(row, col, isWhite));
        break;
      case 'knight':
        moves.push(...this.getKnightMoves(row, col, isWhite));
        break;
      case 'bishop':
        moves.push(...this.getBishopMoves(row, col, isWhite));
        break;
      case 'queen':
        moves.push(...this.getQueenMoves(row, col, isWhite));
        break;
      case 'king':
        moves.push(...this.getKingMoves(row, col, isWhite));
        break;
    }

    // Filter out moves that would put own king in check
    return moves.filter(move => !this.wouldBeInCheck(row, col, move.row, move.col, isWhite));
  }

  getPawnMoves(row, col, isWhite) {
    const moves = [];
    const direction = isWhite ? -1 : 1;
    const startRow = isWhite ? 6 : 1;

    // Move forward one square
    if (this.isSquareEmpty(row + direction, col)) {
      moves.push({ row: row + direction, col });
      
      // Move forward two squares from starting position
      if (row === startRow && this.isSquareEmpty(row + 2 * direction, col)) {
        moves.push({ row: row + 2 * direction, col });
      }
    }

    // Capture diagonally
    if (this.isEnemyPiece(row + direction, col - 1, isWhite)) {
      moves.push({ row: row + direction, col: col - 1 });
    }
    if (this.isEnemyPiece(row + direction, col + 1, isWhite)) {
      moves.push({ row: row + direction, col: col + 1 });
    }

    // En passant
    if (this.enPassantTarget) {
      const targetRow = isWhite ? 3 : 4;
      if (row === targetRow) {
        if (this.enPassantTarget.row === row && 
            Math.abs(this.enPassantTarget.col - col) === 1) {
          moves.push({ 
            row: row + direction, 
            col: this.enPassantTarget.col,
            isEnPassant: true
          });
        }
      }
    }

    return moves;
  }

  getRookMoves(row, col, isWhite) {
    const moves = [];
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    for (const [dr, dc] of directions) {
      for (let i = 1; i < 8; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;
        
        if (!this.isValidPosition(newRow, newCol)) break;
        
        if (this.isSquareEmpty(newRow, newCol)) {
          moves.push({ row: newRow, col: newCol });
        } else if (this.isEnemyPiece(newRow, newCol, isWhite)) {
          moves.push({ row: newRow, col: newCol });
          break;
        } else {
          break;
        }
      }
    }

    return moves;
  }

  getKnightMoves(row, col, isWhite) {
    const moves = [];
    const offsets = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];

    for (const [dr, dc] of offsets) {
      const newRow = row + dr;
      const newCol = col + dc;
      
      if (this.canCapture(newRow, newCol, isWhite)) {
        moves.push({ row: newRow, col: newCol });
      }
    }

    return moves;
  }

  getBishopMoves(row, col, isWhite) {
    const moves = [];
    const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

    for (const [dr, dc] of directions) {
      for (let i = 1; i < 8; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;
        
        if (!this.isValidPosition(newRow, newCol)) break;
        
        if (this.isSquareEmpty(newRow, newCol)) {
          moves.push({ row: newRow, col: newCol });
        } else if (this.isEnemyPiece(newRow, newCol, isWhite)) {
          moves.push({ row: newRow, col: newCol });
          break;
        } else {
          break;
        }
      }
    }

    return moves;
  }

  getQueenMoves(row, col, isWhite) {
    return [
      ...this.getRookMoves(row, col, isWhite),
      ...this.getBishopMoves(row, col, isWhite)
    ];
  }

  getKingMoves(row, col, isWhite) {
    const moves = [];
    const offsets = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];

    for (const [dr, dc] of offsets) {
      const newRow = row + dr;
      const newCol = col + dc;
      
      if (this.canCapture(newRow, newCol, isWhite)) {
        moves.push({ row: newRow, col: newCol });
      }
    }

    // Castling
    if (this.canCastle(isWhite, true)) {
      moves.push({ row, col: col + 2, isCastling: true, side: 'king' });
    }
    if (this.canCastle(isWhite, false)) {
      moves.push({ row, col: col - 2, isCastling: true, side: 'queen' });
    }

    return moves;
  }

  canCastle(isWhite, kingSide) {
    const row = isWhite ? 7 : 0;
    const kingCol = 4;
    const rookCol = kingSide ? 7 : 0;

    // Check castling rights
    if (isWhite) {
      if (kingSide && !this.castlingRights.whiteKingSide) return false;
      if (!kingSide && !this.castlingRights.whiteQueenSide) return false;
    } else {
      if (kingSide && !this.castlingRights.blackKingSide) return false;
      if (!kingSide && !this.castlingRights.blackQueenSide) return false;
    }

    // Check if king is in check
    if (this.isInCheck(isWhite)) return false;

    // Check if squares between king and rook are empty
    const start = Math.min(kingCol, rookCol) + 1;
    const end = Math.max(kingCol, rookCol);
    for (let col = start; col < end; col++) {
      if (!this.isSquareEmpty(row, col)) return false;
    }

    // Check if king would pass through check
    const direction = kingSide ? 1 : -1;
    for (let i = 1; i <= 2; i++) {
      if (this.wouldBeInCheckAt(row, kingCol + i * direction, isWhite)) {
        return false;
      }
    }

    return true;
  }

  isInCheck(isWhite) {
    // Find the king
    let kingRow = -1, kingCol = -1;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.type === 'king' && piece.isWhite === isWhite) {
          kingRow = row;
          kingCol = col;
          break;
        }
      }
      if (kingRow !== -1) break;
    }

    if (kingRow === -1) return false;

    // Check if any enemy piece can attack the king
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.isWhite !== isWhite) {
          const moves = this.getValidMovesWithoutCheckFilter(row, col);
          if (moves.some(move => move.row === kingRow && move.col === kingCol)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  getValidMovesWithoutCheckFilter(row, col) {
    const piece = this.getPieceAt(row, col);
    if (!piece) return [];

    const { type, isWhite } = piece;
    switch (type) {
      case 'pawn': return this.getPawnMoves(row, col, isWhite);
      case 'rook': return this.getRookMoves(row, col, isWhite);
      case 'knight': return this.getKnightMoves(row, col, isWhite);
      case 'bishop': return this.getBishopMoves(row, col, isWhite);
      case 'queen': return this.getQueenMoves(row, col, isWhite);
      case 'king': return this.getKingMoves(row, col, isWhite);
      default: return [];
    }
  }

  wouldBeInCheck(fromRow, fromCol, toRow, toCol, isWhite) {
    // Make temporary move
    const originalPiece = this.board[toRow][toCol];
    const movingPiece = this.board[fromRow][fromCol];
    
    this.board[toRow][toCol] = movingPiece;
    this.board[fromRow][fromCol] = null;

    const inCheck = this.isInCheck(isWhite);

    // Restore board
    this.board[fromRow][fromCol] = movingPiece;
    this.board[toRow][toCol] = originalPiece;

    return inCheck;
  }

  wouldBeInCheckAt(row, col, isWhite) {
    // Find the king
    let kingRow = -1, kingCol = -1;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = this.board[r][c];
        if (piece && piece.type === 'king' && piece.isWhite === isWhite) {
          kingRow = r;
          kingCol = c;
          break;
        }
      }
      if (kingRow !== -1) break;
    }

    return this.wouldBeInCheck(kingRow, kingCol, row, col, isWhite);
  }

  makeMove(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol];
    if (!piece) return false;

    const validMoves = this.getValidMoves(fromRow, fromCol);
    const move = validMoves.find(m => m.row === toRow && m.col === toCol);
    
    if (!move) return false;

    // Handle special moves
    if (move.isCastling) {
      this.performCastling(piece.isWhite, move.side === 'king');
    } else if (move.isEnPassant) {
      const capturedPawnRow = piece.isWhite ? toRow + 1 : toRow - 1;
      this.board[capturedPawnRow][toCol] = null;
    }

    // Capture piece if present
    const capturedPiece = this.board[toRow][toCol];
    if (capturedPiece) {
      this.capturedPieces[capturedPiece.isWhite ? 'white' : 'black'].push(capturedPiece);
    }

    // Move the piece
    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;

    // Update castling rights
    this.updateCastlingRights(piece, fromRow, fromCol);

    // Handle pawn promotion
    if (piece.type === 'pawn' && (toRow === 0 || toRow === 7)) {
      this.board[toRow][toCol] = { type: 'queen', isWhite: piece.isWhite };
    }

    // Update en passant target
    if (piece.type === 'pawn' && Math.abs(toRow - fromRow) === 2) {
      this.enPassantTarget = { row: fromRow, col: fromCol };
    } else {
      this.enPassantTarget = null;
    }

    // Add to move history
    this.moveHistory.push({
      from: { row: fromRow, col: fromCol },
      to: { row: toRow, col: toCol },
      piece: piece.type,
      captured: capturedPiece
    });

    // Switch turns
    this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';

    return true;
  }

  performCastling(isWhite, kingSide) {
    const row = isWhite ? 7 : 0;
    const kingCol = 4;
    const rookCol = kingSide ? 7 : 0;
    const newKingCol = kingSide ? 6 : 2;
    const newRookCol = kingSide ? 5 : 3;

    // Move king
    this.board[row][newKingCol] = this.board[row][kingCol];
    this.board[row][kingCol] = null;

    // Move rook
    this.board[row][newRookCol] = this.board[row][rookCol];
    this.board[row][rookCol] = null;
  }

  updateCastlingRights(piece, fromRow, fromCol) {
    // King moved
    if (piece.type === 'king') {
      if (piece.isWhite) {
        this.castlingRights.whiteKingSide = false;
        this.castlingRights.whiteQueenSide = false;
      } else {
        this.castlingRights.blackKingSide = false;
        this.castlingRights.blackQueenSide = false;
      }
    }

    // Rook moved
    if (piece.type === 'rook') {
      if (piece.isWhite && fromRow === 7) {
        if (fromCol === 0) this.castlingRights.whiteQueenSide = false;
        if (fromCol === 7) this.castlingRights.whiteKingSide = false;
      } else if (!piece.isWhite && fromRow === 0) {
        if (fromCol === 0) this.castlingRights.blackQueenSide = false;
        if (fromCol === 7) this.castlingRights.blackKingSide = false;
      }
    }
  }

  isCheckmate() {
    const isWhiteTurn = this.currentTurn === 'white';
    
    if (!this.isInCheck(isWhiteTurn)) return false;

    // Check if any piece has valid moves
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.isWhite === isWhiteTurn) {
          const moves = this.getValidMoves(row, col);
          if (moves.length > 0) return false;
        }
      }
    }

    return true;
  }

  isStalemate() {
    const isWhiteTurn = this.currentTurn === 'white';
    
    if (this.isInCheck(isWhiteTurn)) return false;

    // Check if any piece has valid moves
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.isWhite === isWhiteTurn) {
          const moves = this.getValidMoves(row, col);
          if (moves.length > 0) return false;
        }
      }
    }

    return true;
  }

  // AI functions for bot player
  evaluatePosition() {
    let score = 0;
    const pieceValues = {
      pawn: 1,
      knight: 3,
      bishop: 3,
      rook: 5,
      queen: 9,
      king: 100
    };

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece) {
          const value = pieceValues[piece.type];
          score += piece.isWhite ? value : -value;
        }
      }
    }

    return score;
  }

  getBestMove(isWhite, depth = 3) {
    const moves = this.getAllValidMoves(isWhite);
    if (moves.length === 0) return null;

    let bestMove = null;
    let bestScore = isWhite ? -Infinity : Infinity;

    for (const move of moves) {
      // Make temporary move
      const originalPiece = this.board[move.to.row][move.to.col];
      const movingPiece = this.board[move.from.row][move.from.col];
      
      this.board[move.to.row][move.to.col] = movingPiece;
      this.board[move.from.row][move.from.col] = null;

      const score = this.minimax(depth - 1, -Infinity, Infinity, !isWhite);

      // Restore board
      this.board[move.from.row][move.from.col] = movingPiece;
      this.board[move.to.row][move.to.col] = originalPiece;

      if (isWhite && score > bestScore) {
        bestScore = score;
        bestMove = move;
      } else if (!isWhite && score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  minimax(depth, alpha, beta, isMaximizing) {
    if (depth === 0) {
      return this.evaluatePosition();
    }

    const moves = this.getAllValidMoves(isMaximizing);
    
    if (moves.length === 0) {
      if (this.isInCheck(isMaximizing)) {
        return isMaximizing ? -1000 : 1000; // Checkmate
      }
      return 0; // Stalemate
    }

    if (isMaximizing) {
      let maxScore = -Infinity;
      for (const move of moves) {
        // Make temporary move
        const originalPiece = this.board[move.to.row][move.to.col];
        const movingPiece = this.board[move.from.row][move.from.col];
        
        this.board[move.to.row][move.to.col] = movingPiece;
        this.board[move.from.row][move.from.col] = null;

        const score = this.minimax(depth - 1, alpha, beta, false);

        // Restore board
        this.board[move.from.row][move.from.col] = movingPiece;
        this.board[move.to.row][move.to.col] = originalPiece;

        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      return maxScore;
    } else {
      let minScore = Infinity;
      for (const move of moves) {
        // Make temporary move
        const originalPiece = this.board[move.to.row][move.to.col];
        const movingPiece = this.board[move.from.row][move.from.col];
        
        this.board[move.to.row][move.to.col] = movingPiece;
        this.board[move.from.row][move.from.col] = null;

        const score = this.minimax(depth - 1, alpha, beta, true);

        // Restore board
        this.board[move.from.row][move.from.col] = movingPiece;
        this.board[move.to.row][move.to.col] = originalPiece;

        minScore = Math.min(minScore, score);
        beta = Math.min(beta, score);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      return minScore;
    }
  }

  getAllValidMoves(isWhite) {
    const moves = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.isWhite === isWhite) {
          const validMoves = this.getValidMoves(row, col);
          for (const move of validMoves) {
            moves.push({
              from: { row, col },
              to: { row: move.row, col: move.col }
            });
          }
        }
      }
    }

    return moves;
  }
}
