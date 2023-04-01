console.log("popup_html")

const style = document.createElement('style');

style.innerHTML = `
    #popup_root_view {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0);
        overflow-y: auto;
        /*这两个属性要动态添加*/
        visibility: hidden;
        transition: visibility 0.3s ease-in-out, background-color 0.3s ease-in-out;
        z-index: 9999;
    }

    #popup_left_drawer {
        display: flex;
        width: 500px;
        height: auto;
        transform: translate(-500px, 0px);
        transition: transform 0.3s ease-in-out;
        flex-direction: column;
        align-items: center;
        backdrop-filter: blur(10px);
    }

    #popup_left_drawer.show {
        transform: translate(0px, 0px);
    }

    #popup_root_view.show {
        background-color: rgba(0, 0, 0, 0.1);
        visibility: visible;
    }

    .page_info_card {
        height: 50px;
        width: 400px;
        flex-shrink: 0;
        padding: 10px;
        background-color: white;
        margin-bottom: 10px;
        /*transform: scale(0.8);*/
        transition: width 0.2s ease-in-out, height 0.2s ease-in-out;
    }

    .page_info_card.choice {
        height: 100px;
        width: 500px;
    }
`;

document.head.appendChild(style);

