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
    genBtn.onclick = () => buildFinalPrompt(item);
}

// ここで9項目を「正しい順序」で合体させます
function buildFinalPrompt(item) {
    let output = "";
    
    output += `【説明】\n${item.explanation}\n\n`;
    output += `【重要度】\n${item.importance}\n\n`;
    output += `【冒頭フック例】\n${item.hook_examples}\n\n`;
    output += `【投稿テンプレート構成】\n${item.composition}\n\n`;
    output += `【具体的な流れ】\n${item.flow}\n\n`;
    output += `【ポイント・コツ】\n${item.tips}\n\n`;
    
    output += `--- ユーザー入力情報 ---\n`;
    item.inputs.forEach(inputName => {
        const val = document.getElementById(`input-${inputName}`).value;
        output += `【${inputName}】: ${val}\n`;
    });

    // 指示通り、AIへの「プロンプト」を一番最後に配置します
    output += `\n--- 最終プロンプト指示 ---\n`;
    output += item.prompt_main;

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
    alert('プロンプトを完全にコピーしました！');
};

window.onload = () => renderList();
