// 게임 상태 관리
let score = 0;
let currentA = null;
let currentB = null;
let highScore = localStorage.getItem('highScore') || 0;

// DOM 요소 참조
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const nameA = document.getElementById('nameA');
const descA = document.getElementById('descA');
const countryA = document.getElementById('countryA');
const nameB = document.getElementById('nameB');
const descB = document.getElementById('descB');
const countryB = document.getElementById('countryB');
const feedback = document.querySelector('.feedback');
const higherButtons = document.querySelectorAll('.higher-btn');
const followerCountA = document.getElementById('followerCountA');
const followerCountB = document.getElementById('followerCountB');

// API 호출 함수
async function fetchNewRound() {
    try {
        const response = await fetch('/api/new-round');
        const data = await response.json();
        currentA = data.account_a;
        currentB = data.account_b;
        updateUI();
    } catch (error) {
        console.error('API 호출 실패:', error);
        feedback.textContent = '데이터를 불러오는 중 오류가 발생했습니다';
    }
}

// 선택 처리
async function handleChoice(selectedAccount) {
    const isACorrect = selectedAccount === 'a' && 
                      currentA.follower_count > currentB.follower_count;
    const isBCorrect = selectedAccount === 'b' && 
                      currentB.follower_count > currentA.follower_count;
    const isCorrect = isACorrect || isBCorrect;
    
    if (isCorrect) {
        score++;
        feedback.textContent = '정답!';
        feedback.style.color = '#4CAF50';
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            updateHighScore();
        }
        updateScore();
        
        // 선택한 계정에 따라 다음 라운드 준비
        if (selectedAccount === 'a') {
            // A를 선택했으면 B를 A로 이동
            currentA = currentB;
        }
        // B를 선택했거나 A를 유지해야 하는 경우는 이미 currentA가 유지됨
        
        // 새로운 라운드 시작
        setTimeout(fetchNewRound, 1000);
    } else {
        feedback.textContent = '틀렸습니다! 게임 오버';
        feedback.style.color = '#f44336';
        score = 0;
        updateScore();
        setTimeout(init, 2000);
    }
}

// UI 업데이트
function updateUI() {
    if (currentA) {
        nameA.textContent = currentA.name;
        descA.textContent = currentA.description;
        countryA.textContent = currentA.country;
        followerCountA.textContent = formatNumber(currentA.follower_count) + ' 팔로워';
    }
    
    if (currentB) {
        nameB.textContent = currentB.name;
        descB.textContent = currentB.description;
        countryB.textContent = currentB.country;
        followerCountB.textContent = formatNumber(currentB.follower_count) + ' 팔로워';
    }
    
    scoreElement.textContent = score;
}

// 숫자 포맷팅 (1,000,000 형태로)
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 최고 점수 업데이트
function updateHighScore() {
    if (highScoreElement) {
        highScoreElement.textContent = highScore;
    }
}

// 게임 초기화
function init() {
    score = 0;
    updateScore();
    updateHighScore();
    fetchNewRound();
}

// 점수 업데이트
function updateScore() {
    if (scoreElement) {
        scoreElement.textContent = score;
    }
}

// 이벤트 리스너 설정
higherButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const selectedAccount = e.target.dataset.account;
        handleChoice(selectedAccount);
    });
});

// 게임 시작
init();
