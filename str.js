// 修改用户代理
Object.defineProperty(navigator, 'userAgent', {
    get: function() {
        return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    }
});

// 设置视口
const metaViewport = document.querySelector('meta[name="viewport"]');
if (metaViewport) {
    metaViewport.setAttribute('content', 'width=1024');
} else {
    const newMetaViewport = document.createElement('meta');
    newMetaViewport.name = 'viewport';
    newMetaViewport.content = 'width=1024';
    document.head.appendChild(newMetaViewport);
}

// 强制刷新页面以应用更改
window.location.reload();
