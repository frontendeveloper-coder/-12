

// Наборы символов
const CHAR_LOWER = 'abcdefghijklmnopqrstuvwxyz';
const CHAR_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const CHAR_NUM = '0123456789';
const CHAR_SYMBOLS = '@#%&*?';
const CHAR_EMOJI = '😀😃😄😁😆😅🤣😂🙂🙃😉😊😇🤩😎';

// DOM элементы
const lengthEl = document.getElementById('length');
const lenLabel = document.getElementById('lenLabel');
const pwdOut = document.getElementById('passwordOutput');
const copyBtn = document.getElementById('copyBtn');
const generateBtn = document.getElementById('generateBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const lower = document.getElementById('lower');
const upper = document.getElementById('upper');
const numbers = document.getElementById('numbers');
const symbols = document.getElementById('symbols');
const avoidSimilar = document.getElementById('avoidSimilar');
const includeEmoji = document.getElementById('includeEmoji');
const strengthText = document.getElementById('strengthText');
const strengthBar = document.querySelector('#strength .bar');

function getRandomInt(max){
	const array = new Uint32Array(1);
	window.crypto.getRandomValues(array);
	return array[0] % max;
}

function shuffleString(s){
	const arr = Array.from(s);
	for(let i = arr.length - 1; i > 0; i--){
		const j = getRandomInt(i + 1);
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr.join('');
}

function generatePassword(len, opts){
	let pool = '';
	if(opts.lower) pool += CHAR_LOWER;
	if(opts.upper) pool += CHAR_UPPER;
	if(opts.numbers) pool += CHAR_NUM;
	if(opts.symbols) pool += CHAR_SYMBOLS;
	if(opts.emoji) pool += CHAR_EMOJI;

	if(!pool) return '';

	if(opts.avoidSimilar){
		pool = pool.replace(/[il1Lo0O]/g,'');
	}

	const result = [];

	const requiredSets = [];
	if(opts.lower) requiredSets.push(CHAR_LOWER);
	if(opts.upper) requiredSets.push(CHAR_UPPER);
	if(opts.numbers) requiredSets.push(CHAR_NUM);
	if(opts.symbols) requiredSets.push(CHAR_SYMBOLS);
	if(opts.emoji) requiredSets.push(CHAR_EMOJI);


	requiredSets.forEach(set => {
		let setStr = set;
		if(opts.avoidSimilar) setStr = setStr.replace(/[il1Lo0O]/g,'');
		const idx = getRandomInt(setStr.length);
		result.push(setStr[idx]);
	});

	// fill the rest
	while(result.length < len){
		const idx = getRandomInt(pool.length);
		result.push(pool[idx]);
	}

	return shuffleString(result.join(''));
}

function scorePassword(pwd){
	if(!pwd) return {score:0,label:'—'};
	let score = 0;
	score += Math.min(40, pwd.length * 2);
	if(/[a-z]/.test(pwd)) score += 15;
	if(/[A-Z]/.test(pwd)) score += 15;
	if(/[0-9]/.test(pwd)) score += 15;
	if(/[^A-Za-z0-9\s]/.test(pwd)) score += 15;
	score = Math.min(100, Math.floor(score));
	let label = 'Очень слабый';
	if(score >= 80) label = 'Отличный';
	else if(score >= 60) label = 'Хороший';
	else if(score >= 40) label = 'Средний';
	else if(score >= 20) label = 'Слабый';
	return {score,label};
}

function updateStrength(pwd){
	const {score,label} = scorePassword(pwd);
	strengthBar.style.width = score + '%';
	strengthText.textContent = label;
	if(score < 30) strengthBar.style.background = 'linear-gradient(90deg,#ff4d4f,#ff9b9b)';
	else if(score < 60) strengthBar.style.background = 'linear-gradient(90deg,#ff7a59,#ffd36b)';
	else strengthBar.style.background = 'linear-gradient(90deg,#7b61ff,#50e3c2)';
}

function generateAndShow(){
	const opts = {
		lower: lower.checked,
		upper: upper.checked,
		numbers: numbers.checked,
		symbols: symbols.checked,
		emoji: includeEmoji ? includeEmoji.checked : false,
		avoidSimilar: avoidSimilar.checked
	};
	const len = parseInt(lengthEl.value, 10) || 16;
	const pwd = generatePassword(len, opts);
	pwdOut.value = pwd || 'Выберите хотя бы один набор символов';
	updateStrength(pwd);
}

generateBtn.addEventListener('click', generateAndShow);

shuffleBtn.addEventListener('click', ()=>{
	if(!pwdOut.value) return;
	pwdOut.value = shuffleString(pwdOut.value);
	updateStrength(pwdOut.value);
});

copyBtn.addEventListener('click', async ()=>{
	try{
		await navigator.clipboard.writeText(pwdOut.value);
		const prev = copyBtn.textContent;
		copyBtn.textContent = 'Скопировано!';
		setTimeout(()=>copyBtn.textContent = prev,1200);
	}catch(e){
		try{
			pwdOut.select();
			document.execCommand('copy');
			const prev = copyBtn.textContent;
			copyBtn.textContent = 'Скопировано!';
			setTimeout(()=>copyBtn.textContent = prev,1200);
		}catch(_){/* ignore */}
	}
});


lengthEl.addEventListener('input', ()=>{
	lenLabel.textContent = lengthEl.value;
});


generateAndShow();


document.addEventListener('keydown',(e)=>{
	if(e.key === 'Enter' && document.activeElement !== pwdOut) generateAndShow();
});