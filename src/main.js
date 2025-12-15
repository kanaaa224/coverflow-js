/*
    (c) 2024 kanaaa224. All rights reserved.
*/

import CoverFlow from '../dist/coverflow.js';

(async () => {
    try {
        let manifest = document.querySelector('link[rel="manifest"]');

        const response = await fetch(manifest.href);
        const data     = await response.json();

        manifest = data;

        const link = document.createElement('link');

        link.rel  = 'icon';
        link.href = new URL(manifest.icons[0].src, response.url).href;

        document.head.appendChild(link);

        const title = document.title = manifest.name;

        document.body.innerHTML = `
            <main>
                <article></article>
            </main>
            <header>
                <h1>${title}</h1>
                <p>
                    <a href="https://github.com/kanaaa224/coverflow-js#readme" target="_blank">
                        <span class="mdi mdi-github"></span>
                    </a>
                </p>
            </header>
            <footer>
                <p>© 2024 <a href="https://kanaaa224.github.io" target="_blank">kanaaa224</a>. All rights reserved.</p>
            </footer>
        `;

        // --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        const colors = [ '#0ea5e9', '#3b82f6', '#8b5cf6', '#a78bfa', '#e11d48', '#f472b6', '#fb923c', '#facc15', '#84cc16', '#10b981' ];

        const size = 200;

        const items = Array.from({ length: 100 }, (_, i) => {
            const e = document.createElement('div');

            e.style.inlineSize      = `${size}px`;
            e.style.blockSize       = `${size}px`;
            e.style.backgroundColor = colors[i % colors.length];
            e.style.aspectRatio     = '1 / 1';

            e.style.borderRadius = '.25rem';
            e.style.boxShadow    = '0 0 3rem 0 #0000001a';
            e.style.cursor       = 'pointer';

            e.style.transition = 'border .25s ease';

            e.onmouseenter = () => {
                e.style.border = '.25rem solid #777';
            };

            e.onmouseleave = () => {
                e.style.border = '.25rem solid #7770';
            };

            e.style.display        = 'flex';
            e.style.justifyContent = 'center';
            e.style.alignItems     = 'center';

            const p = document.createElement('p');

            p.style.textAlign = 'center';

            switch(i) {
                case 0: {
                    p.appendChild(document.createTextNode('設定'));
                    p.appendChild(document.createElement('br'));

                    const s1 = document.createElement('span');

                    s1.style.fontSize       = '.75rem';
                    s1.style.textDecoration = 'underline';

                    s1.textContent = '両端ループ: オン';

                    s1.onclick = () => {
                        coverFlow.loop = !coverFlow.loop;
                        coverFlow.update();

                        s1.textContent = `両端ループ: ${coverFlow.loop ? 'オン' : 'オフ'}`;
                    };

                    p.appendChild(s1);
                    p.appendChild(document.createElement('br'));

                    const s2 = document.createElement('span');

                    s2.style.fontSize       = '.75rem';
                    s2.style.textDecoration = 'underline';

                    s2.textContent = '両端自動非表示: オン';

                    s2.onclick = () => {
                        coverFlow.range = coverFlow.range === 10 ? (Math.floor(window.innerWidth / size) - 1) : 10;
                        coverFlow.update();

                        s2.textContent = `両端自動非表示: ${coverFlow.range !== 10 ? 'オン' : 'オフ'}`;
                    };

                    p.appendChild(s2);

                    break;
                }

                default: {
                    p.style.fontWeight = 'bold';
                    p.style.opacity    = '.25';

                    p.textContent = i;
                }
            }

            e.appendChild(p);

            e.onclick = () => {
                console.log(`[ CoverFlow ] clicked: ${i}`);
            };

            e.updatable = true;

            return e;
        });

        const coverFlow = new CoverFlow(items, true, Math.floor(window.innerWidth / size) - 1);

        coverFlow
            .attach(document.querySelector('main article'))
            .update();

        window.addEventListener('wheel', (e) => {
            coverFlow.update(e.deltaY > 0 ? coverFlow.index + 1 : e.deltaY < 0 ? coverFlow.index - 1 : coverFlow.index);
        }, { passive: true });

        window.addEventListener('keydown', e => {
            coverFlow.update(e.key === 'ArrowRight' ? coverFlow.index + 1 : e.key === 'ArrowLeft' ? coverFlow.index - 1 : coverFlow.index);

            if(e.key === 'D') coverFlow.destroy();
            if(e.key === 'A') coverFlow.attach(document.querySelector('main article')).update();
        });

        let x = 0;

        window.addEventListener('touchstart', e => {
            x = e.changedTouches[0].clientX;
        }, { passive: true });

        window.addEventListener('touchend', e => {
            const diff = e.changedTouches[0].clientX - x;

            coverFlow.update(diff < -50 ? coverFlow.index + 1 : diff > 50 ? coverFlow.index - 1 : coverFlow.index);
        }, { passive: true });
    } catch(e) {
        console.error(e);
    }
})();