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
    document.getElementById('selectedName').innerText = item.name;
    document.getElementById('selectedDesc').innerText = item.description;
    
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
    genBtn.onclick = () => {
        let final = `【説明】\n${item.description}\n\n`;
        let p = item.prompt;
        
        final += `--- ユーザー入力内容 ---\n`;
        item.inputs.forEach(inputName => {
            const val = document.getElementById(`input-${inputName}`).value;
            final += `【${inputName}】: ${val}\n`;
            // プロンプト内の {テーマ} などを置換
            p = p.replace(`{${inputName}}`, val);
        });
        
        // 最後にプロンプトを結合
        final += `\n--- AIへの指示 ---\n${p}`;
        document.getElementById('resultText').value = final;
    };
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
    text.select();
    document.execCommand('copy');
    alert('コピー完了！');
};

window.onload = () => renderList();
