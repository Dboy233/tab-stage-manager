//chrom 可惜的是Chrome只支持获取当前tab的截图，所以忽略chrome平台
export class ChromePlatformHandle {

    async captureTab(id) {
        console.log("chrome 获取图片")
        return "";
    }

}

//fireFox
export class FireFoxPlatformHandle {

    /**
     * {
     *     tabId:"123"
     *     img:"base64"
     * }
     * @param id
     * @returns {Promise<{tabId, img: (Promise<{tabId, img: *}[]|*[]>|Promise<[]>|*)}>}
     */
    async captureTab(id) {
        return await browser.tabs.captureTab(
            id,
            {format: 'jpeg', quality: 50}
        )
    }
}