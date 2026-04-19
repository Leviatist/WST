/**
 * 搜索引擎配置中心
 * 拓展方法：在此对象中添加新的键值对即可
 * key: 内部标识
 * name: 显示名称
 * url: 搜索接口基础URL (query param name usually 'q')
 * icon: 显示的图标或Emoji
 * color: 可选，用于切换时的主题色变化
 */
const SEARCH_ENGINES = {
    bing: {
        name: 'Bing',
        url: 'https://www.bing.com/search',
        param: 'q',
        icon: '🔍',
        color: '#0078d4'
    },
    google: {
        name: 'Google',
        url: 'https://www.google.com/search',
        param: 'q',
        icon: 'G',
        color: '#4285f4'
    },
    // 未来拓展示例:
    // baidu: {
    //     name: '百度',
    //     url: 'https://www.baidu.com/s',
    //     param: 'wd',
    //     icon: 'B',
    //     color: '#2932e1'
    // }
};

class SearchWidget {
    constructor(widgetId, defaultEngineKey = 'bing') {
        this.widget = document.getElementById(widgetId);
        if (!this.widget) return;

        // DOM 元素引用
        this.engineBtn = this.widget.querySelector('#engineBtn');
        this.engineList = this.widget.querySelector('#engineList');
        this.currentEngineIcon = this.widget.querySelector('#currentEngineIcon');
        this.currentEngineName = this.widget.querySelector('#currentEngineName');
        this.searchForm = this.widget.querySelector('#searchForm');
        this.searchInput = this.widget.querySelector('#searchInput');
        
        // 状态
        this.currentEngineKey = defaultEngineKey;
        this.isOpen = false;

        // 初始化
        this.init();
    }

    init() {
        // 1. 渲染初始状态
        this.setEngine(this.currentEngineKey);

        // 2. 绑定事件
        this.bindEvents();
        
        // 3. 动态生成下拉列表 (如果HTML中没有预先生成，或者为了同步配置)
        this.renderDropdownList();
    }

    renderDropdownList() {
        // 清空现有列表以防重复
        this.engineList.innerHTML = '';
        
        Object.keys(SEARCH_ENGINES).forEach(key => {
            const engine = SEARCH_ENGINES[key];
            const li = document.createElement('li');
            li.setAttribute('data-engine', key);
            li.setAttribute('role', 'menuitem');
            li.innerHTML = `<span class="icon">${engine.icon}</span> ${engine.name}`;
            
            // 点击切换事件
            li.addEventListener('click', () => {
                this.setEngine(key);
                this.toggleDropdown(false);
                this.searchInput.focus(); // 切换后聚焦输入框
            });

            this.engineList.appendChild(li);
        });
    }

    setEngine(key) {
        const engine = SEARCH_ENGINES[key];
        if (!engine) return;

        this.currentEngineKey = key;

        // 更新 UI 显示
        this.currentEngineIcon.textContent = engine.icon;
        this.currentEngineName.textContent = engine.name;

        // 更新 Form 动作
        // 注意：实际提交时，我们需要确保参数名正确。
        // 大多数现代搜索引擎都支持 'q'，但为了严谨，我们动态处理 input name
        this.searchInput.name = engine.param; 
        
        // 更新 Placeholder
        this.searchInput.placeholder = `Search with ${engine.name}...`;

        // 可选：更新主题色以匹配引擎
        document.documentElement.style.setProperty('--sw-primary-color', engine.color);
    }

    toggleDropdown(forceState = null) {
        if (forceState !== null) {
            this.isOpen = forceState;
        } else {
            this.isOpen = !this.isOpen;
        }

        if (this.isOpen) {
            this.widget.querySelector('.engine-selector').classList.add('active');
            this.engineBtn.setAttribute('aria-expanded', 'true');
        } else {
            this.widget.querySelector('.engine-selector').classList.remove('active');
            this.engineBtn.setAttribute('aria-expanded', 'false');
        }
    }

    bindEvents() {
        // 点击按钮切换下拉
        this.engineBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        // 点击外部关闭下拉
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.widget.contains(e.target)) {
                this.toggleDropdown(false);
            }
        });

        // 表单提交处理 (虽然 form action 已经设置，但这里可以做额外验证)
        this.searchForm.addEventListener('submit', (e) => {
            const engine = SEARCH_ENGINES[this.currentEngineKey];
            // 确保 action 是正确的 URL
            this.searchForm.action = engine.url;
            // input 的 name 已经在 setEngine 中设置为正确的 param (q 或 wd)
            // 浏览器会自动拼接 ?q=keyword
        });
        
        // 键盘支持 (Esc 关闭下拉)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.toggleDropdown(false);
            }
        });
    }
}

// 启动组件
document.addEventListener('DOMContentLoaded', () => {
    // 默认使用 Bing
    new SearchWidget('searchWidget', 'bing');
});