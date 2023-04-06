
let saveBtn = document.getElementById("btn_save_key");
if (saveBtn) {
    saveBtn.onclick = (e) => {
        let hotKey = document.getElementById("input_key").value;
        console.log("快捷键",hotKey)
        browser.storage.sync.set({
            hot_key: hotKey
        });
        e.preventDefault();
    }
}
function restoreOptions() {
    let gettingItem = browser.storage.sync.get('hot_key');
    gettingItem.then((res) => {
        let key = res.hot_key;
        if (key===undefined) {
            if (navigator.platform.toUpperCase().includes("MAC")) {
                key = "e"
            } else {
                key = "w"
            }
        }
        document.getElementById("input_key").value = key;
    });
}
document.addEventListener('DOMContentLoaded', restoreOptions);