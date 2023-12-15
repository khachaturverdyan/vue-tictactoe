<template>
    <div v-if="winningMessage" class="winning-message">
      {{ winningMessage }}
    </div>
    
        <el-button
        size="large"
        type="primary"
        v-if="!gameOver && startGameButton"
        @click="startGame"
        
      >
        Start Game
      </el-button>
 
      <el-button
        size="large"
        type="plain"
        @click="startGame"
        v-if="gameOver"
        style="background-color: rgb(14, 219, 113);"
      >
        Restart the Game
      </el-button>
      <p>
        <el-button
        size="large"
        type="plain"
        @click="closeMultiplayerAndStartGame"
        v-if="gameOver"
      >
        Go offline
      </el-button>
      </p>


    <p>
        <el-button
          type="primary"
          v-if="isLoggedIn && !isMultiplayerStarted"
          @click="multiplayer"
          style="background-color: rgb(161, 14, 219);"

        >
         Multiplayer
        </el-button>

        <el-button
          type="primary"
          v-if="isLoggedIn && isMultiplayerStarted && joinButton"
          @click="startGameMultiplayer"
          style="background-color: rgb(161, 14, 219);"

        >
         Join
        </el-button>
        
        <div v-if="showMultiPlayerNames">
          <table>
            <tr>
              <td id="player1"><h1>{{ currentAccount.name }}({{ currentAccount.value }})</h1></td>
              <td><h1> -vs- </h1></td>
              <td id="player2"><h1>{{ multiplayerOpponent.name }} ({{ multiplayerOpponent.value }})</h1></td>
            </tr>
            <tr>
              <h1><td id="player1">{{currentAccount.score}}</td></h1>
              <td></td>
              <h1><td id="player2">{{multiplayerOpponent.score}}</td></h1>
            </tr>
          </table>
        </div>
      </p>
    <div v-if="showBoard" class="board-container">

        <el-col v-for="(cell, cellIndex) in board" :key="cellIndex" @click="handleCellClick(cellIndex)" :style="{ pointerEvents: !isMultiplayerStarted || (isMultiplayerStarted && isActivePlayer) ? 'auto' : 'none' }"> 
          <div class="cell"  @click="handleCellClick(rowIndex, cellIndex)">
            {{ cell }}
          </div>
        </el-col>
    </div>
  </template>
  
<script>
  import {ElButton} from 'element-plus';
  import { mapGetters } from 'vuex';
  import io from 'socket.io-client';
  export default {
    name: 'HelloWorld',
    data() {
      return {
      currentAccount: {},
      multiplayerOpponent: {},
      isActivePlayer: false,
      joinButton: true,
      startGameButton: true,
      showMultiPlayerNames: false,
      isMultiplayerStarted: false,
      socket: null,
      room: '',
      board: new Array(9).fill(''),
      showBoard: false, 
      gameOver: false,
      currentPlayer: 'X',
      winningMessage: '',
      winningCombinations: [
          [0, 1, 2], [3, 4, 5], [6, 7, 8],
          [0, 3, 6], [1, 4, 7], [2, 5, 8],
          [0, 4, 8], [2, 4, 6]
        ]
      }
    },
    components: {
      ElButton,
    },
    props: {
  
    }, 
    computed: {
      ...mapGetters(['isLoggedIn', 'loggedInUser']),
    },
    created(){
      this.socket = io('http://localhost:8000');
      this.socket.on('connect', () => {
        console.log('Connected to Socket.IO server');
        
      });
    },
    mounted() {
      this.socket.on('closeMultiplayerGame',  () => {
        console.log('received closemultiplayergame')
        this.showBoard = false;
        this.winningMessage = '';
        this.gameOver = false;
        this.startGameButton = true;
        this.joinButton = true;
        this.showMultiPlayerNames = false;
        this.isMultiplayerStarted = false;
        this.isActivePlayer = false;
        this.currentAccount = {};
        this.multiplayerOpponent = {};
        this.board = new Array(9).fill('');
        this.currentPlayer = 'X';
      }),
      this.socket.on('incomingMessage', (data) => {
        console.log(`Received message from another user:${data.user} with value ${data.value} with score ${data.score}`);
        this.multiplayerOpponent = {name: data.user, value: data.value, score: data.score};
        this.currentAccount = { name: this.$store.getters.loggedInUser.name, value: 'O', score: 0 }
        this.isMultiplayerStarted = true;
        console.log(`Received message from another user:${data.user} with value ${data.value}`);
      }),

      this.socket.on('incomingGameState', (data) => {
          console.log('Received incoming game state:', data);
          this.showBoard = data.showBoard;
          this.board = data.board;
          this.gameOver = data.gameOver;
          this.winningMessage = data.winningMessage;
          this.currentPlayer = data.currentPlayer;
          this.startGameButton = data.startGameButton;
          this.joinButton = data.joinButton;
          this.showMultiPlayerNames = data.showMultiPlayerNames;
          this.isMultiplayerStarted = data.isMultiplayerStarted;
          this.multiplayerOpponent = data.multiplayerOpponent;
          this.isActivePlayer = data.isActivePlayer;

        });
    },
    methods:  {
      closeMultiplayerAndStartGame () {
        console.log('sent closemultiplayergame')

        this.showBoard = false;
        this.winningMessage = '';
        this.gameOver = false;
        this.startGameButton = true;
        this.joinButton = true;
        this.showMultiPlayerNames = false;
        this.isMultiplayerStarted = false;
        this.isActivePlayer = false;
        this.currentAccount = {};
        this.multiplayerOpponent = {};
        this.board = new Array(9).fill('');
        this.currentPlayer = 'X';
        this.socket.emit('closeMultiplayerGame');
      },
      multiplayer() {
        const currentUser = this.$store.getters.loggedInUser.name;
        const currentSymbol = 'X';
        const opponentSymbol = 'O';
        this.socket.emit('multiplayer', {user:  currentUser, value: currentSymbol, score: 0, room: this.socket.id});
        this.currentAccount = { name: currentUser, value: currentSymbol, score: 0};
        this.multiplayerOpponent = { name: '', value: opponentSymbol, score: 0};
        this.isActivePlayer = true
        console.log(this.isActivePlayer)
      },

     emitGameState() {
      this.socket.emit('gameState', {
        showBoard: this.showBoard,
        board: this.board,
        gameOver: this.gameOver,
        winningMessage: this.winningMessage,
        startGameButton: this.startGameButton,
        joinButton: this.joinButton,
        showMultiPlayerNames: this.showMultiPlayerNames,
        isMultiplayerStarted: this.isMultiplayerStarted,
        multiplayerOpponent: this.currentAccount,
        isActivePlayer:  true
      });
    },
      startGame() {
        this.showBoard = true;
        this.winningMessage = '';
        this.gameOver = false;
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        // this.isMultiplayerStarted = false;
      },

      startGameMultiplayer() {
        this.showBoard = true;
        this.winningMessage = '';
        this.gameOver = false;
        this.board = Array(9).fill('');
        this.startGameButton = false;
        this.joinButton = false;
        this.showMultiPlayerNames = true;
        this.emitGameState()
      },
  
      checkWinner(currentPlayer) {
            for (const combination of this.winningCombinations) {
                const [a, b, c] = combination;
                  if (this.board[a] === currentPlayer &&
                    this.board[b] === currentPlayer &&
                    this.board[c] === currentPlayer
                ) {
                  console.log(this.board)
                    return true;
                }
                
            }
            return false;
      },
  
      handleCellClick(cellIndex) {
        // if (!this.isActivePlayer) return;

          if(this.isMultiplayerStarted) {
            if (!this.gameOver && this.board[cellIndex] === '') {
              const currentPlayer = this.currentAccount.value;
              const currentPlayerName = this.currentAccount.name;

              this.board[cellIndex] = currentPlayer;
              if(this.board.every(el => el !== '')) {
                this.gameOver = true;
                this.winningMessage = `Draw!`;
              }
              if (this.checkWinner(currentPlayer)) { 
                  this.gameOver = true;
                  this.winningMessage = `Player ${currentPlayerName} wins!`;
                  if (currentPlayer === this.currentAccount.value) {
                    this.currentAccount.score++;
                  } else {
                    this.multiplayerOpponent.score++;
                  }
                  
              } else {
                this.isActivePlayer = !this.isActivePlayer
              }
              this.emitGameState()
            }
          }
          if (!this.gameOver && this.board[cellIndex] === '') {
                this.board[cellIndex] = this.currentPlayer;
                if(this.board.every(el => el !== '')) {
                this.gameOver = true;
                this.winningMessage = `Draw!`;
              }
                if (this.checkWinner(this.currentPlayer)) {
                  this.gameOver = true;

                  // 1. No logged in user
                  if (!this.isLoggedIn) {
                    this.winningMessage = `Player ${this.currentPlayer} wins!`;
                  }
                  //2. With logged in user
                  //2.1 When the user wins
                  if(this.currentPlayer === 'X') {
                    this.winningMessage = `${this.loggedInUser.name} wins!!!`;
                  } else {
                  //2.2 When the user loses
                  this.winningMessage = `O wins!!!`;
                  }
                } else {
                  this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
                }
      }
     }
    }
  };
  </script>
  
<style scoped>
  
.board-container {
    margin-top: 75px;
    display: flex;
    justify-content: center;
    display: grid;
    grid-template-columns: repeat(3, auto);
  }
  .cell { 
    border: 1px solid black; 
    width: 120px; 
    height: 120px; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    font-size: 48px; 
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    color: #646cff;
    text-align: center; 
    cursor: pointer; 
    margin: 3px;
}   
  
.winning-message {
  /* background-color: #646cff;  */
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  color: #646cff;
  font-size: 36px; 
  padding: 10px;
  border-radius: 2px;
  margin: 10px 0;
}

#player1 {
  color: #646cff;
}

#player2 {
  color: #f0520f;
}

.loading {
  margin-top: 10px;
}
</style>
