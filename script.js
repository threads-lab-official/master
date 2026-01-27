let currentCategory = 'buzz';

function switchCategory(category) {
    currentCategory = category;
    renderList();
    clearEditor();
}

function renderList() {
    const listEl = document.getElementById('itemList');
    listEl.innerHTML = '';
    const items = window.MASTER_DATA[currentCategory] || [];
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerText = item.name;
        div.onclick = () => selectItem(item);
        listEl.appendChild(div);
    });
}

function selectItem(item) {
    document.getElementById('selectedName').innerText = `${item.name} (${item.importance})`;
    document.getElementById('selectedDesc').innerText = item.explanation;
    
    const formEl = document.getElementById('inputForm');
    formEl.innerHTML = '';
    
    item.inputs.forEach(inputName => {
        const div = document.createElement('div');
        div.className = 'input-group';
        div.innerHTML = `<label>${inputName}</label><textarea id="input-${inputName}"></textarea>`;
        formEl.appendChild(div);
    });

    const genBtn = document.getElementById('generateBtn');
    genBtn.style.display = 'block';
    genBtn.onclick = () => assembleFinalPrompt(item);
}

// ここがあなたの求めていた「黄金の並び順」
function assembleFinalPrompt(item) {
    let output = "";
    
    // 1. 説明
    output += `【説明】\n${item.explanation}\n\n`;
    // 2. 冒頭フック例
    output += `【冒頭フック例】\n${item.hooks}\n\n`;
    // 3. 投稿テンプレート構成
    output += `【投稿テンプレート構成】\n${item.composition}\n\n`;
    // 4. 具体的な流れ
    output += `【具体的な流れ】\n${item.flow}\n\n`;
    // 5. ポイント・コツ
    output += `【ポイント・コツ】\n${item.tips}\n\n`;
    
    // 6. ユーザーの入力内容
    output += `--- ユーザー入力内容 ---\n`;
    item.inputs.forEach(inputName => {
        const val = document.getElementById(`input-${inputName}`).value;
        output += `【${inputName}】: ${val}\n`;
    });

    // 7. プロンプト（AIへの長い指示）を最後に！
    output += `\n--- AIへの最終指示 ---\n`;
    output += item.ai_prompt;

    document.getElementById('resultText').value = output;
}

function clearEditor() {
    document.getElementById('selectedName').innerText = '項目を選択してください';
    document.getElementById('selectedDesc').innerText = '';
    document.getElementById('inputForm').innerHTML = '';
    document.getElementById('generateBtn').style.display = 'none';
    document.getElementById('resultText').value = '';
}

document.getElementById('copyBtn').onclick = () => {
    const text = document.getElementById('resultText');
    if(!text.value) return;
    text.select();
    document.execCommand('copy');
    alert('コピーしました！AIに貼り付けてください。');
};

window.onload = () => renderList();
