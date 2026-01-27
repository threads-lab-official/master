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
    genBtn.onclick = () => assemblePrompt(item);
}

// ここがあなたの求めていた「正しい組み立て順序」です
function assemblePrompt(item) {
    let final = "";
    
    final += `【説明】\n${item.explanation}\n\n`;
    final += `【冒頭フック例】\n${item.hook_examples}\n\n`;
    final += `【投稿テンプレート構成】\n${item.composition}\n\n`;
    final += `【具体的な流れ】\n${item.flow}\n\n`;
    final += `【ポイント・コツ】\n${item.tips}\n\n`;
    
    final += `--- ユーザー入力 ---\n`;
    item.inputs.forEach(inputName => {
        const val = document.getElementById(`input-${inputName}`).value;
        final += `【${inputName}】：${val}\n`;
    });
    
    // 一番最後に、あの長いプロンプト（AIへの役割指示とルール）を置く
    final += `\n--- AIへの指示 ---\n`;
    final += item.prompt_main;

    document.getElementById('resultText').value = final;
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
    alert('プロンプトをコピーしました！');
};

window.onload = () => renderList();
