var inpfocused = false
var selectedsqr = null
var rightclickdown = false;
var rightclickoriginpoint;
var movedHighlightPieces = [];
var selectHighlightPiece;
var activeArrows = [];
var blackPieces = {};
var whitePieces = {};

String.prototype.toDegrees = function() {
	return Number(this) * (180 / Math.PI);
}
String.prototype.toRadians = function() {
	return Number(this) * (Math.PI / 180);
}
Number.prototype.toDegrees = function() {
	return (this) * (180 / Math.PI);
}
Number.prototype.toRadians = function() {
	return (this) * (Math.PI / 180);
}
String.prototype.legalMoves = function(base = false) {
	//base means it doesnt matter about moving into check/being pinned
	let str = this.toString() //ex. e4, c6
	let strFile = str[0]
	let strRank = str[1]
	let pieceType = getPieceFromSquare(str)[0]
	let lglmoves = [];
	switch (pieceType.toLowerCase()) {
		case "k":
			//king
			[-9, -8, -7, -1, 1, 7, 8, 9].forEach(move => {
				//calculate if str -> projectMoveWithNP(str, move) is legal
				//if its part of the base set of moves
				if(projectMoveWithNP(str, move) === false) return;
				//if its not taking your own piece
				if(isUpperCase(getPieceFromSquare(projectMoveWithNP(str, move))[0]) === isUpperCase(pieceType)) return;
				//if its not moving into check
				//if castle
				lglmoves.push(projectMoveWithNP(str, move))
			})
			break;
		case "b":
			//bishop
			[-63, -54, -45, -36, -27, -18, -9, 9, 18, 27, 36, 45, 54, 63, -49, -42, -35, -28, -21, -14, -7, 7, 14, 21, 28, 35, 42, 49].forEach(move => {
				//calculate if str -> projectMoveWithNP(str, move) is legal
				//if its part of the base set of moves
				if(projectMoveWithNP(str, move) === false) return;
				console.log(str, projectMoveWithNP(str, move))
				if(Math.abs(files.indexOf(str[0]) - files.indexOf(projectMoveWithNP(str, move)[0])) !== Math.abs(ranks.indexOf(Number(str[1])) - ranks.indexOf(Number(projectMoveWithNP(str, move)[1])))) return;
				//if its not taking your own piece
				if(isUpperCase(getPieceFromSquare(projectMoveWithNP(str, move))[0]) === isUpperCase(pieceType)) return;
				getDOMElemFromSquare(projectMoveWithNP(str, move)).classList.add('highlight');
				lglmoves.push(projectMoveWithNP(str, move))
			})
			break;
		case "n":
			//knight
			[-9, -8, -7, -1, 1, 7, 8, 9].forEach(move => {
				//calculate if str -> projectMoveWithNP(str, move) is legal
				if(projectMoveWithNP(str, move) === false) return;
				if(isUpperCase(getPieceFromSquare(projectMoveWithNP(str, move))[0]) === isUpperCase(pieceType)) return;
				lglmoves.push(projectMoveWithNP(str, move))
			})
			break;
		case "r":
			//rook
			[-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, -8, -16, -24, -32, -40, -48, -56, 56, 48, 40, 32, 24, 16, 8].forEach(move => {
				//calculate if str -> projectMoveWithNP(str, move) is legal
				if(projectMoveWithNP(str, move) === false) return;
				if(str[0] !== projectMoveWithNP(str, move)[0] && str[1] !== projectMoveWithNP(str, move)[1]) return;
				//if its not taking your own piece
				if(isUpperCase(getPieceFromSquare(projectMoveWithNP(str, move))[0]) === isUpperCase(pieceType)) return;
				getDOMElemFromSquare(projectMoveWithNP(str, move)).classList.add('highlight');
				lglmoves.push(projectMoveWithNP(str, move))
			})
			break;
		case "q":
			//queen
			[-63, -54, -45, -36, -27, -18, -9, 9, 18, 27, 36, 45, 54, 63, -49, -42, -35, -28, -21, -14, -7, 7, 14, 21, 28, 35, 42, 49, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, -8, -16, -24, -32, -40, -48, -56, 56, 48, 40, 32, 24, 16, 8].forEach(move => {
				//calculate if str -> projectMoveWithNP(str, move) is legal
				//if its part of the base set of moves
				if(projectMoveWithNP(str, move) === false) return;
				if(Math.abs(files.indexOf(str[0]) - files.indexOf(projectMoveWithNP(str, move)[0])) !== Math.abs(ranks.indexOf(Number(str[1])) - ranks.indexOf(Number(projectMoveWithNP(str, move)[1])))) {
					if(str[0] !== projectMoveWithNP(str, move)[0] && str[1] !== projectMoveWithNP(str, move)[1]) return;
				}
				//ifs its not taking your own piece
				getDOMElemFromSquare(projectMoveWithNP(str, move)).classList.add('highlight')
				if(isUpperCase(getPieceFromSquare(projectMoveWithNP(str, move))[0]) === isUpperCase(pieceType)) return;
				lglmoves.push(projectMoveWithNP(str, move))
			})
			break;
		case "p":
			//pawn
			[-16, -9, -8, -7, 7, 8, 9, 16].forEach(move => {
				//calculate if str -> projectMoveWithNP(str, move) is legal
				//if its part of the base set of moves
				if(projectMoveWithNP(str, move) === false) return;
				if((pieceType === "P" && (move.toString())[0] !== '-') || (pieceType === "p" && (move.toString())[0] === '-')) return;
				//if capture available
				if(Math.abs(move) == 7 || Math.abs(move) == 9) {
					if(getPieceFromSquare(projectMoveWithNP(str, move))[0] == 'x') return;
				} else {
					if(getPieceFromSquare(projectMoveWithNP(str, move))[0] != 'x') return;
				}
				//if you can move double the amount
				if(Math.abs(move) == 16) {
					if(strRank == '2' && isUpperCase(pieceType) || strRank == '7' && !isUpperCase(pieceType)) {
						//you can move twice
						//check if its being blocked
						if(getPieceFromSquare(projectMoveWithNP(str, move > 0 ? 8 : -8))[0] !== 'x') return;
					} else {
						return;
					}
				}
				//if its not taking your own piece
				if(isUpperCase(getPieceFromSquare(projectMoveWithNP(str, move))[0]) === isUpperCase(pieceType)) return;
				getDOMElemFromSquare(projectMoveWithNP(str, move)).classList.add('highlight')
				lglmoves.push(projectMoveWithNP(str, move))
			})
			break;
	}
	return lglmoves;

}
document.getElementById('moveinputtext').addEventListener("focus", e=>inpfocused=true)
document.getElementById('moveinputtext').addEventListener("blur", e=>inpfocused=false)
window.addEventListener('mousedown', e => {
	if(e.button === 2) {
		rightclickdown = true;
		if (e.composedPath().length === 10) {
			rightclickoriginpoint = e.composedPath()[1];
		} else if (e.composedPath().length === 9) {
			rightclickoriginpoint = e.composedPath()[0];
		}
	}
	if(e.button === 0) {
		//delete all highlighted squares and arrows
		[...boardtable.children[0].children].forEach(rank => {
			[...rank.children].forEach(file => {
				file.classList.remove("highlight")
			})
		})
		document.querySelector('#arrows').innerHTML = '';
		activeArrows = [];
	}
})
window.addEventListener('mouseup', e => {
	if(e.button === 2) {
		rightclickdown = false;
		let rightclickendingpoint;
		if (e.composedPath().length === 10) {
			rightclickendingpoint = e.composedPath()[1];
		} else if (e.composedPath().length === 9) {
			rightclickendingpoint = e.composedPath()[0];
		}
		if (rightclickendingpoint === rightclickoriginpoint) {
			//highlighted square
			if(e.composedPath().length === 10) {
				//non-empty square
				if(e.composedPath()[1].classList.contains("highlight")) e.composedPath()[1].classList.remove("highlight")
				else e.composedPath()[1].classList.add("highlight")
			}
			if(e.composedPath().length === 9) {
				//empty square
				if(e.composedPath()[0].classList.contains("highlight")) e.composedPath()[0].classList.remove("highlight")
				else e.composedPath()[0].classList.add("highlight")
			}
		} else {
			if(rightclickendingpoint == undefined) return;
			//draw arrow from rightclickoriginpoint to rightclickendingpoint
			let startSquare = getSquareFromDOMElem(rightclickoriginpoint);
			let endSquare = getSquareFromDOMElem(rightclickendingpoint);
			if(activeArrows.indexOf(startSquare + endSquare) !== -1) {
				document.querySelector(`#${startSquare + endSquare}`).parentElement.removeChild(document.querySelector(`#${startSquare + endSquare}`))
				activeArrows.splice(activeArrows.indexOf(startSquare + endSquare), 1)
				return;
			}
			activeArrows.push(startSquare + endSquare);
			let startSquareCoords = [(files.indexOf(startSquare[0]) * 12.5 + 6.25), (ranks.indexOf(Number(startSquare[1])) * 12.5 + 6.25)];
			let endSquareCoords = [(files.indexOf(endSquare[0]) * 12.5 + 6.25), (ranks.indexOf(Number(endSquare[1])) * 12.5 + 6.25)];
			let arrowLen = Math.sqrt((Math.abs(endSquareCoords[0] - startSquareCoords[0]))**2 + (Math.abs(endSquareCoords[1] - startSquareCoords[1]))**2) - 4.5;
			let arrowBodyLen = arrowLen - 4.5;
			var newArrow = document.createElementNS('http://www.w3.org/2000/svg','polygon');
			newArrow.setAttribute('points', [
				//left base
				`${startSquareCoords[0] - 1.375} ${startSquareCoords[1] - 4.5}`,
				//right base
				`${startSquareCoords[0] + 1.375} ${startSquareCoords[1] - 4.5}`,
				//right armpit
				`${startSquareCoords[0] + 1.375} ${startSquareCoords[1] - arrowBodyLen - 4.5}`,
				//right hand
				`${startSquareCoords[0] + 3.25} ${startSquareCoords[1] - arrowBodyLen - 4.5}`,
				//point
				`${startSquareCoords[0]} ${startSquareCoords[1] - arrowLen - 4.5}`,
				//left hand
				`${startSquareCoords[0] - 3.25} ${startSquareCoords[1] - arrowBodyLen - 4.5}`,
				//left armpit
				`${startSquareCoords[0] - 1.375} ${startSquareCoords[1] - arrowBodyLen - 4.5}`,

			].join(', '))
			newArrow.setAttribute('style', 'fill: rgba(255, 170, 0, 0.8); opacity: 0.8;')
			newArrow.setAttribute('id', startSquare + endSquare)
			let rotDeg, quadrant, dx = Math.abs(endSquareCoords[0] - startSquareCoords[0]);
			if(endSquareCoords[0] > startSquareCoords[0]) {
				//its pointing to the right
				if(endSquareCoords[1] > startSquareCoords[1]) {
					//its pointing to the bottom right
					quadrant = 4;
				}
				if(endSquareCoords[1] < startSquareCoords[1]) {
					//its pointing to the top right
					quadrant = 1;
				}
			}
			if(endSquareCoords[0] < startSquareCoords[0]) {
				//its pointing to the left
				if(endSquareCoords[1] > startSquareCoords[1]) {
					//its pointing to the bottom left
					quadrant = 3;
				}
				if(endSquareCoords[1] < startSquareCoords[1]) {
					//its pointing to the top left
					quadrant = 2;
				}
			}
			if(endSquareCoords[0] == startSquareCoords[0]) {
				//its pointing up or down
				if(endSquareCoords[1] > startSquareCoords[1]) {
					//its pointing down
					quadrant = 'down';
				}
				if(endSquareCoords[1] < startSquareCoords[1]) {
					//its pointing up
					quadrant = 'up';
				}
			}
			if(endSquareCoords[1] == startSquareCoords[1]) {
				//its pointing left or right
				if(endSquareCoords[0] < startSquareCoords[0]) {
					//its pointing left
					quadrant = 'left';
				}
				if(endSquareCoords[0] > startSquareCoords[0]) {
					//its pointing right
					quadrant = 'right';
				}
			}
			switch (quadrant) {
				case 'up':
					rotDeg = 0;
					break;
				case 'down':
					rotDeg = 180;
					break;
				case 'left':
					rotDeg = 270;
					break;
				case 'right':
					rotDeg = 90;
					break;
				case 1:
					rotDeg = Math.asin(dx/(arrowLen + 4.5)).toDegrees();
					break;
				case 2:
					rotDeg = 360 - Math.asin(dx/(arrowLen + 4.5)).toDegrees();
					break;
				case 3:
					rotDeg = 180 + Math.asin(dx/(arrowLen + 4.5)).toDegrees();
					break;
				case 4:
					rotDeg = 180 - Math.asin(dx/(arrowLen + 4.5)).toDegrees();
					break;
			}
			newArrow.setAttribute('transform', `rotate(${rotDeg} ${startSquareCoords[0]} ${startSquareCoords[1]})`)
			document.querySelector('#arrows').appendChild(newArrow);
		}
	}

})
window.addEventListener('keypress', e => {
	if(e.key==="Enter" && inpfocused) {
		movePiece(document.getElementById('moveinputtext').value);
		document.getElementById('moveinputtext').value = ''
	}
})
window.addEventListener('contextmenu', e=>{e.preventDefault()})

window.addEventListener('keydown', e => {
	if(e.key === "ArrowLeft") {
		//Left Arrow Pressed
		//Go back one turn (if possible)
		//first check if possible
		if(movesetPGN == []) return; //you cant go left
	} else if(e.key === "ArrowRight") {
		//Right Arrow Pressed
		//Go forward one turn (if possible)
	}
})
document.body.addEventListener('dragover', e=>{e.preventDefault()})
document.body.addEventListener('drop', e=>{
	if(e.composedPath().length == 4) {
		//if dropped outside of the chess board
		selectedsqr = e.dataTransfer.getData('text/plain');
		document.getElementById('hover-square').style.visibility = 'hidden';
	}
})
document.getElementById('hover-square').addEventListener('dragover', e=>{e.preventDefault()})
document.getElementById('hover-square').addEventListener('drop', e=>{
	e.preventDefault()
	let hovSquare = document.getElementById('hover-square')
	let translateVals = hovSquare.style.transform.split("(")[1].split(', ').join('').slice(0,-2).split('%')
	let sqrPos = (files[Number(translateVals[0])/100]) + ((Number(translateVals[1])/100 - 8) * -1)
	const sqr = getDOMElemFromSquare(sqrPos)




	const id = e.dataTransfer.getData('text/plain')
	hovSquare.style.visibility = 'hidden';
	if((turn == 1 && isUpperCase(getPieceFromSquare(id)[0])) || (turn == 0 && !isUpperCase(getPieceFromSquare(id)[0]))) {
		selectHighlightPiece = id
		if(movesetPGN.length > 0) {
			let lastMoveArr = movesetPGN[movesetPGN.length - 1].split(".")
			getDOMElemFromSquare(lastMoveArr[1]).classList.add('dragging')
			getDOMElemFromSquare(lastMoveArr[2]).classList.add('dragging')
		}
		return;
	}
	sqr.classList.add("dragging")
	if(id == sqr.classList[1]) return;
	if(movedHighlightPieces[1] && id !== sqr.classList[1]) {
		//unhighlight previous highlited pieces
		movedHighlightPieces.forEach(piece => {
			getDOMElemFromSquare(piece).classList.remove('dragging');
		})
	}
	movedHighlightPieces = [id, sqr.classList[1]]
	selectHighlightPiece = undefined;
	movePiece([getPieceFromSquare(id)[0], id, sqr.classList[1]])
	e.dataTransfer.clearData('text/plain')
})

//Zayan is small and satya is smaller

var board = document.getElementsByClassName("board")[0], move = 0,boardtable = document.getElementsByClassName("boardtable")[0], movesetPGN = [], dragstartev = (e,img)=>{
	//Adding an event listener to when you start dragging the piece
	e.dataTransfer.setData('text/plain', img.id.toString()) //adds the piece information to dataTransfer so that whenever you drop the piece, it knows what piece to put
	if(selectHighlightPiece) {
		getDOMElemFromSquare(selectHighlightPiece).classList.remove("dragging");
	}
	img.parentElement.classList.add("dragging");
	selectHighlightPiece = img.id;
}, materialCount = 0, pieces = {
	'k': ["King", "k", "king.png", 0],
	'p': ["Pawn", "p", "pawn.png", 1],
	'n': ["Knight", "n", "knight.png", 3],
	'b': ["Bishop", "b", "bishop.png", 3],
	'r': ["Rook", "r", "rook.png", 5],
	'q': ["Queen", "q", "queen.png", 9],
}, boardpositions = [
	['r','n','b','q','k','b','n','r'],
	['p','p','p','p','p','p','p','p'],
	['x','x','x','x','x','x','x','x'],
	['x','x','x','x','x','x','x','x'],
	['x','x','x','x','x','x','x','x'],
	['x','x','x','x','x','x','x','x'],
	['P','P','P','P','P','P','P','P'],
	['R','N','B','Q','K','B','N','R'],
	// ['x','x','x','x','x','x','x','x'],
	// ['x','x','x','x','x','p','x','x'],
	// ['x','x','x','x','x','x','x','x'],
	// ['x','x','K','x','P','x','x','q'],
	// ['x','x','x','x','x','x','x','k'],
	// ['x','x','x','x','x','x','x','x'],
	// ['x','x','x','x','x','x','x','x'],
	// ['x','x','x','x','x','x','x','x'],
], pieceClasses = [], turn = 0, files = ['a','b','c','d','e','f','g','h'], ranks = [8,7,6,5,4,3,2,1], drawboard = function() {
	for(var i in boardpositions) {
		let bi = boardpositions[i];
		for(var j in bi) {
			let bj = bi[j]; //we are looping through every square on the board
			let tempfileletter = files[j];
			let tempranknumber = ranks[i];
			let sqrPos = tempfileletter + tempranknumber;
			//if we were looking at square e4, tempfileletter would be e and tempranknumber would be 4.
			//now that we know what square position it is, what is the array position of the square?
			if(isUpperCase(getPieceFromSquare(sqrPos)[0])) {
				whitePieces[getPieceFromSquare(sqrPos)[0] + sqrPos] = {
					type: getPieceFromSquare(sqrPos)[0],
					team: 'w',
					location: sqrPos
				}
			} else {
				if(getPieceFromSquare(sqrPos)[0] == 'x') break;
				blackPieces[getPieceFromSquare(sqrPos)[0] + sqrPos] = {
					type: getPieceFromSquare(sqrPos)[0],
					team: 'b',
					location: sqrPos
				}
			}
			addPiece(getPieceFromSquare(sqrPos)[0], sqrPos, getPieceFromSquare(sqrPos)[0] + sqrPos)
		}
	}
}, init = function() {
	//initialization function. Happens once the script is loaded (Right after all the HTML and CSS are loaded)
	//First, add all the pieces.
	drawboard(); //refer to Line 379 for the start of this function.
	//Second, add event listeners to all the chess pieces.
	document.querySelectorAll('.pimg').forEach(img=>{
		//Looping every piece image on the board
		img.addEventListener('dragstart', e=>{dragstartev(e,img)})
	})
	//Third, add event listeners to all the squares (listening for drop, and dragenter/dragleave)
	document.querySelectorAll('td').forEach(sqr=>{
		sqr.addEventListener('dragenter', e=>{
			e.preventDefault();
			//find the translate coords for any square
			const sqrPos = getSquareFromDOMElem(sqr);
			const letterPos = files.indexOf(sqrPos[0]) + 1
			const translateX = (letterPos - 1) * 100, translateY = 100 * (8 - Number(sqrPos[1]));
			document.getElementById("hover-square").style.transform = `translate(${translateX + "%"}, ${translateY+"%"})`;
			document.getElementById("hover-square").style.visibility = 'visible'
		})
		sqr.addEventListener('dragleave', e=>{
			e.preventDefault();
		})
		sqr.addEventListener('dragover', e=>{
			e.preventDefault();
		})
		sqr.addEventListener('drop', e=>{
			e.preventDefault();
			const id = e.dataTransfer.getData('text/plain')
			sqr.style.border = 'none'
			document.getElementById("hover-square").style.visibility = 'hidden';
			if((turn == 1 && isUpperCase(getPieceFromSquare(id)[0])) || (turn == 0 && !isUpperCase(getPieceFromSquare(id)[0]))) return;
			if(movedHighlightPieces[1] && id !== sqr.classList[1]) {
				//unhighlight previous highlited pieces
				movedHighlightPieces.forEach(piece => {
					getDOMElemFromSquare(piece).classList.remove('dragging');
				})
			}
			sqr.classList.add("dragging")
			if(id == sqr.classList[1]) return;
			movePiece([getPieceFromSquare(id)[0], id, sqr.classList[1]])
			movedHighlightPieces = [id, sqr.classList[1]]
			selectHighlightPiece = undefined;
			e.dataTransfer.clearData('text/plain')
		})
	})
}, getPieceFromSquare = function(sqr) {
	let file = sqr[0];
	let rank = Number(sqr[1]);
	let filenum = files.indexOf(file)
	let ranknum = ranks.indexOf(rank)
	return [boardpositions[ranknum][filenum], ranknum, filenum];
}, getSquaresfromPiece = function(piece) {
	let sqrs = [];
	for(var i in boardpositions) {
		//loops every rank
		for (var j in boardpositions[i]) {
			//loops every piece in that rank
			if(boardpositions[i][j] === piece) {
				sqrs.push(files[j] + ranks[i])
			}
		}
	}
	return sqrs;
}, getSquareFromDOMElem = function(DOMElem) {
	return (files[Array.from(DOMElem.parentElement.children).indexOf(DOMElem)]) + (8 - Array.from(DOMElem.parentElement.parentElement.children).indexOf(DOMElem.parentElement))
}, getDOMElemFromSquare = function(sqr) { //returns the DOM element from a square position (e4, f6, c8, etc.)
	return boardtable.children[0].children[8 - Number(sqr[1])].children[files.indexOf(sqr[0])];
}, getNPfromSquarePos = function(sqr) { //get numerical position value from square position value
	return Number(document.getElementsByClassName(sqr)[0].classList[2].slice(2));
}, getSquarePosfromNP = function(np) { //vice versa
	return document.getElementsByClassName(np)[0].classList[1];
}, addPiece = function(ptype, sqr, dataPiece) {
	//ptype would be the piece type (k for king, n for knight, q for queen, etc.), sqr would be e4 or c6. pteam is either 0 or 1 depending on if the piece is white or black. white is 0, black is 1
	//////////////////////////////////////////////////////////now replace the piece in the array
	if(getDOMElemFromSquare(sqr).children[0] !== undefined) {
		//we're capturing a piece
		//the piece we're capturing is getDOMElemFromSquare(sqr).children[0]
		//the piece type is getPieceFromSquare(sqr)[0]
		if(getPieceFromSquare(sqr)[0] === "k") {
			alert("White Wins!")
		} else if(getPieceFromSquare(sqr)[0] === "K") {
			alert("Black Wins!")
		} else {
			if(isUpperCase(getPieceFromSquare(sqr)[0])) {
				//white loses material
				materialCount -= pieces[getPieceFromSquare(sqr)[0].toLowerCase()][3]
				delete whitePieces[getDOMElemFromSquare(sqr).children[0].dataset.piece];
			} else {
				//black loses material
				materialCount += pieces[getPieceFromSquare(sqr)[0].toLowerCase()][3]
				delete blackPieces[getDOMElemFromSquare(sqr).children[0].dataset.piece];
			}
			
		}

	}
	if(ptype == "x") return;
	let pteam = ptype.toUpperCase() === ptype ? 0 : 1; //0 is white (uppercase), 1 is black
	let pletter = pieces[ptype.toLowerCase()][1] //this is the letter of the piece (k for king, n for knight, p for pawn, etc.)
	if(pteam == 0) {
		//white team, pletter is uppercase
		pletter = pletter.toUpperCase();
	} else if(pteam == 1) {
		//black team, pletter is lowercase
		pletter = pletter.toLowerCase();
	}
	boardpositions[getPieceFromSquare(sqr)[1]][getPieceFromSquare(sqr)[2]] = pletter;
	//////////////////////////////////////////////////////////now replace the piece in the actual DOM
	let pimg = document.createElement("img"); //actual image that will show up on browser
	getDOMElemFromSquare(sqr).replaceChildren();
	pimg.src = pteam == 0 ? `w${pieces[ptype.toLowerCase()][2]}` : `b${pieces[ptype.toLowerCase()][2]}`;
	pimg.draggable = 'true';
	pimg.classList.add('pimg')
	pimg.id = sqr
	pimg.setAttribute('data-piece', dataPiece)
	pimg.addEventListener('dragstart', e=>{dragstartev(e,pimg)})
	getDOMElemFromSquare(sqr).appendChild(pimg);
}, removePiece = function(sqr) {
	boardpositions[getPieceFromSquare(sqr)[1]][getPieceFromSquare(sqr)[2]] = "x";
	getDOMElemFromSquare(sqr).replaceChildren();
}, movePiece = function(input) {
	let output = [] //ex. ['P', e2, e4]
	if(typeof input == "object") output = input;
	else {
		var pawnturnchanger = turn == 0 ? 1 : -1
		let captures = input.indexOf("x") !== -1
		switch (input[0]) {
			case "K":
				output.push(turn == 0 ? "K" : "k")
				break;
			case "N":
				output.push(turn == 0 ? "N" : "n")
				break;
			case "B":
				output.push(turn == 0 ? "B" : "b")
				break;
			case "R":
				output.push(turn == 0 ? "R" : "r")
				break;
			case "Q":
				output.push(turn == 0 ? "Q" : "q")
				break;
			default:
				output.push(turn == 0 ? "P" : "p") //its a pawn
				let tRank = input[input[input.length - 1] === "+" || input[input.length - 1] === "#" ? input.length - 2 : input.length - 1]
				let tFile = input[input[input.length - 1] === "+" || input[input.length - 1] === "#" ? input.length - 3 : input.length - 2]
				let wbpawnltr = turn == 0 ? "P" : "p"
				if(getPieceFromSquare(`${tFile}${tRank - pawnturnchanger}`)[0] === wbpawnltr) {
					output.push(`${tFile}${tRank - pawnturnchanger}`)
				} else if(getPieceFromSquare(`${tFile}${tRank - pawnturnchanger}`)[0] === 'x' && getPieceFromSquare(`${tFile}${tRank - (2 * pawnturnchanger)}`)[0] === wbpawnltr) {
					output.push(`${tFile}${tRank - (2 * pawnturnchanger)}`)
				}
				output.push(input)
				break;
		}
	}
	if(output.length < 3) return;
	//input: e4, white
	//output: P, e2, e4
	//input: e5, black
	//output:p, e7, e5
	//P, e2, e4 means that P is ptype, e2 is pos1, e4 is pos2
	/////////////////////////////////////////we need to work on this :(
	//if promotion
	if(output[0].toUpperCase() == 'P') {
		if((output[1][1] == '2' && output[0] === 'p') || (output[1][1] == '7' && output[0] === 'P')) {
			output[0] = isUpperCase(output[0]) ? 'Q' : 'q'
		}
	}
	console.log(getDOMElemFromSquare(output[1]).children[0].dataset.piece)
	if(isUpperCase(output[0])) {
		//whites move
		whitePieces[getDOMElemFromSquare(output[1]).children[0].dataset.piece].location = output[2]
	} else {
		//blacks move
		blackPieces[getDOMElemFromSquare(output[1]).children[0].dataset.piece].location = output[2]
	}
	addPiece(output[0], output[2], getDOMElemFromSquare(output[1]).children[0].dataset.piece);
	removePiece(output[1]);
	turn = turn == 0 ? 1 : 0  //switches turn to 1 if its 0, or 0 if its 1 (0 is white 1 is black)
	move+=0.5
	if(move.toString()[move.toString().length - 2] == ".") {
		//means its blacks move
		document.body.style.backgroundColor = '#333'
	} else {
		//its whites move
		document.body.style.backgroundColor = '#aaa'
	}
}, isUpperCase = function(str) {
	//returns true if uppercase, false if not
	if(str.toUpperCase() === str) return true;
	return false;
}, projectMoveWithNP = function(square, dnp) {
	//dnp means delta (change) NP
	//square means the start square
	let projectionSquare = getNPfromSquarePos(square) + dnp;
	projectionSquare < 1 || projectionSquare > 64 ? projectionSquare = false : projectionSquare = document.querySelector(`.np${[projectionSquare]}`).classList[1]
	return projectionSquare;
}
init();
//initialization
/*
HOW TO MAKE THE PIECES MOVE
1. Base (Knights move in L shape, bishops diagonally, etc.)
2. No moev through pieces except knight
3. No move so that check
4. En croissant
5. Castle
6. In check
*/