/**
 * 平台差异化处理
 */
export class PlatformHandle {

    constructor() {
        this.tabImgMap = new Map();
        this.imgOptions = {format: 'jpeg', quality: 50}
    }

    /**
     * 获取tab预览图片。是个列表形式的。
     * @param tabId 如果指明tabId 返回的就是只有一个的列表。
     * @returns {*[]}
     */
    async getTabPreviewImage(tabId) {
        return []
    }

}

//chrom 可惜的是Chrome只支持获取当前tab的截图，所以忽略chrome平台
export class ChromePlatformHandle extends PlatformHandle {
    constructor() {
        super();
    }

    async getTabPreviewImage(tabId) {
        return super.getTabPreviewImage(tabId);
    }

}

//fireFox
export class FireFoxPlatformHandle extends PlatformHandle {

    constructor() {
        super();
    }

    async getTabPreviewImage(tabId) {

        function captureTab(id) {
            let capturing = browser.tabs.captureTab(
                id,
                this.imgOptions
            );
            return {tabId: tabId, img: capturing}
        }

        if (tabId) {
            return [captureTab(tabId)]
        }

        let tabs = await browser.tabs.query({})
        let previews = []
        for (let tab of tabs) {
            previews.push(captureTab(tab.id))
        }
        return previews;
    }
}