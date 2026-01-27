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
    document.getElementById('selectedDesc').innerText = item.description;
    
    const formEl = document.getElementById('inputForm');
    formEl.innerHTML = '';
    
    item.inputs.forEach(inputName => {
        const div = document.createElement('div');
        div.className = 'input-group';
        div.innerHTML = `<label>${inputName}</label><textarea id="input-${inputName}" placeholder="${inputName}を入力..."></textarea>`;
        formEl.appendChild(div);
    });

    const genBtn = document.getElementById('generateBtn');
    genBtn.style.display = 'block';
    genBtn.onclick = () => assembleFinalPrompt(item);
}

// 9つの項目を、あなたの望む順番で、かつ中身を「埋めて」から結合する
function assembleFinalPrompt(item) {
    let result = "";
    
    // 1. 各項目の情報を先頭に並べる
    result += `【説明】\n${item.description}\n\n`;
    result += `【重要度】\n${item.importance}\n\n`;
    result += `【冒頭フック例】\n${item.hook_examples}\n\n`;
    result += `【投稿テンプレート構成】\n${item.composition}\n\n`;
    result += `【具体的な流れ】\n${item.flow}\n\n`;
    result += `【ポイント・コツ】\n${item.tips}\n\n`;

    // 2. ユーザーの入力を取得し、プロンプト内の {テーマ} などを書き換える準備
    let aiPromptProcessed = item.ai_prompt;
    let inputSummary = "--- ユーザー入力情報 ---\n";

    item.inputs.forEach(inputName => {
        const val = document.getElementById(`input-${inputName}`).value;
        inputSummary += `【${inputName}】: ${val}\n`;
        // プロンプト内の {テーマ} などを実際の文字に置き換える
        const regex = new RegExp(`\\{${inputName}\\}`, 'g');
        aiPromptProcessed = aiPromptProcessed.replace(regex, val);
    });

    // 3. 入力情報の要約を載せる
    result += inputSummary + "\n";

    // 4. 最後に、中身が埋まった「最終プロンプト」をドカンと置く
    result += `--- 最終プロンプト指示 ---\n`;
    result += aiPromptProcessed;

    document.getElementById('resultText').value = result;
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
    alert('プロンプトを完璧にコピーしました！AIに貼り付けてください。');
};

window.onload = () => renderList();
