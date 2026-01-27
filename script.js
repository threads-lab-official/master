// 今どの部屋（カテゴリ）にいるかを記録する変数
let currentCategory = 'buzz';

// ボタンを押した時に「部屋」を切り替える関数
function switchCategory(category) {
    currentCategory = category;
    
    // 全てのボタンから「active（光ってる状態）」を外す
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 押されたボタンだけを「active」にする
    // ボタンのテキストに含まれるキーワードで判定
    const labels = { buzz: 'バズ', long: '長文', rewrite: 'リライト', affiliate: 'アフィリ' };
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.innerText.includes(labels[category])) {
            btn.classList.add('active');
        }
    });

    // 画面のリストを更新
    renderList();
    // 入力欄をリセット
    clearEditor();
}

// 選択された部屋の中身を左側に並べる関数
function renderList() {
    const listEl = document.getElementById('itemList');
    listEl.innerHTML = '';
    
    // 各ファイル（buzz.jsなど）からデータを取ってくる
    const items = window.MASTER_DATA[currentCategory] || [];
    
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerText = item.name;
        div.onclick = () => selectItem(item);
        listEl.appendChild(div);
    });
}

// 項目を選んだ時に右側の入力欄を作る関数
function selectItem(item) {
    document.getElementById('selectedName').innerText = item.name;
    document.getElementById('selectedDesc').innerText = item.desc || "";
    
    const formEl = document.getElementById('inputForm');
    formEl.innerHTML = '';
    
    item.inputs.forEach(inputName => {
        const div = document.createElement('div');
        div.className = 'input-group';
        div.innerHTML = `
            <label>${inputName}</label>
            <textarea id="input-${inputName}" placeholder="${inputName}を入力..."></textarea>
        `;
        formEl.appendChild(div);
    });

    const genBtn = document.getElementById('generateBtn');
    genBtn.style.display = 'block';
    genBtn.onclick = () => generatePrompt(item);
}

// 入力された文字をプロンプトにはめ込む関数
function generatePrompt(item) {
    let result = item.template;
    item.inputs.forEach(inputName => {
        const val = document.getElementById(`input-${inputName}`).value;
        // {テーマ} などの文字を、入力した文字に置き換える
        result = result.replace(new RegExp(`\\{${inputName}\\}`, 'g'), val);
    });
    document.getElementById('resultText').value = result;
}

// 画面を綺麗にする関数
function clearEditor() {
    document.getElementById('selectedName').innerText = '項目を選択してください';
    document.getElementById('selectedDesc').innerText = '';
    document.getElementById('inputForm').innerHTML = '';
    document.getElementById('generateBtn').style.display = 'none';
    document.getElementById('resultText').value = '';
}

// コピー機能
document.getElementById('copyBtn').onclick = () => {
    const text = document.getElementById('resultText');
    if(!text.value) return;
    text.select();
    document.execCommand('copy');
    alert('プロンプトをコピーしました！');
};

// サイトが開いた瞬間に「バズ構文」を表示する
window.onload = () => renderList();
