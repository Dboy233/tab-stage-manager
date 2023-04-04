//
// let saveBtn = document.getElementById("btn_save_key");
// if (saveBtn) {
//     saveBtn.onclick = (e) => {
//         browser.storage.sync.set({
//             hot_key: document.getElementById("input_key").value
//         });
//         e.preventDefault();
//     }
// }
//
//
// function restoreOptions() {
//     let storageItem = browser.storage.managed.get('hot_key');
//     storageItem.then((res) => {
//         console.log("storageItem",res)
//         document.getElementById("input_key").innerText = res.hot_key||'NULL';
//     });
//
//     let gettingItem = browser.storage.sync.get('hot_key');
//     gettingItem.then((res) => {
//         console.log("gettingItem",res)
//         document.getElementById("input_key").value = res.hot_key || 'NULL';
//     });
// }
//
// document.addEventListener('DOMContentLoaded', restoreOptions);