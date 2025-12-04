### 概要

2025年 個人制作  
[デモ](https://kanaaa224.github.io/coverflow-js/)

### 特徴

・任意のDOM要素を表示可能  
・ループ可能（無限スクロール）  
・要素をクリックして移動可能

### 使うには

```html
<script type="module">
    import CoverFlow from 'https://cdn.jsdelivr.net/gh/kanaaa224/coverflow-js@master/dist/coverflow.esm.min.js';

    const colors = [ '#0ea5e9', '#3b82f6', '#8b5cf6', '#a78bfa', '#e11d48', '#f472b6', '#fb923c', '#facc15', '#84cc16', '#10b981' ];

    const size = 200;

    const items = Array.from({ length: 50 }, (_, i) => {
        const e = document.createElement('div');

        e.style.width           = `${size}px`;
        e.style.height          = `${size}px`;
        e.style.backgroundColor = colors[i % colors.length];
        e.style.aspectRatio     = '1 / 1';

        e.style.borderRadius = '0.25rem';
        e.style.boxShadow    = '0 0 3rem 0 #0000001a';
        e.style.cursor       = 'pointer';

        e.style.transition = 'border .25s ease';

        e.onmouseenter = () => {
            e.style.border = '0.25rem solid #777';
        };

        e.onmouseleave = () => {
            e.style.border = '0.25rem solid #7770';
        };

        e.style.display        = 'flex';
        e.style.justifyContent = 'center';
        e.style.alignItems     = 'center';

        e.innerHTML = `<p style="opacity: 0.25; font-weight: bold;">${i}</p>`;

        e.onclick = () => {
            console.log(`[ CoverFlow ] clicked: ${i}`);
        };

        e.updatable = true;

        return e;
    });

    const coverFlow = new CoverFlow(items, true, Math.floor(window.innerWidth / size) - 1);

    coverFlow
        .attach(document.body)
        .update();

    window.addEventListener('wheel', (e) => {
        coverFlow.update(e.deltaY > 0 ? coverFlow.index + 1 : e.deltaY < 0 ? coverFlow.index - 1 : coverFlow.index);
    }, { passive: true });

    window.addEventListener('keydown', e => {
        coverFlow.update(e.key === 'ArrowRight' ? coverFlow.index + 1 : e.key === 'ArrowLeft' ? coverFlow.index - 1 : coverFlow.index);

        if(e.key === 'D') coverFlow.destroy();
        if(e.key === 'A') coverFlow.attach(document.body).update();
    });

    let x = 0;

    window.addEventListener('touchstart', e => {
        x = e.changedTouches[0].clientX;
    }, { passive: true });

    window.addEventListener('touchend', e => {
        const diff = e.changedTouches[0].clientX - x;

        coverFlow.update(diff < -50 ? coverFlow.index + 1 : diff > 50 ? coverFlow.index - 1 : coverFlow.index);
    }, { passive: true });
</script>
```