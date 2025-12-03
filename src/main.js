import CoverFlow from './coverflow.js';

const colors = [ '#0ea5e9', '#3b82f6', '#8b5cf6', '#a78bfa', '#e11d48', '#f472b6', '#fb923c', '#facc15', '#84cc16', '#10b981' ];

const size = 200;

const items = Array.from({ length: 101 }, (_, i) => {
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

    const p = document.createElement('p');

    p.style.textAlign = 'center';

    switch(i) {
        case 0: {
            p.appendChild(document.createTextNode('CoverFlow JS'));
            p.appendChild(document.createElement('br'));

            let s = document.createElement('span');

            s.style.fontSize = '0.75rem';

            s.textContent = '任意のDOM要素を表示可能';

            p.appendChild(s);

            break;
        }

        case 1: {
            p.appendChild(document.createTextNode('設定'));
            p.appendChild(document.createElement('br'));

            let s = document.createElement('span');

            s.style.fontSize       = '0.75rem';
            s.style.textDecoration = 'underline';

            s.textContent = '両端ループ: オン/オフ';

            s.onclick = () => {
                coverFlow.loop = !coverFlow.loop;
                coverFlow.update();
            };

            p.appendChild(s);
            p.appendChild(document.createElement('br'));

            s = document.createElement('span');

            s.style.fontSize       = '0.75rem';
            s.style.textDecoration = 'underline';

            s.textContent = '両端自動非表示: オン/オフ';

            s.onclick = () => {
                coverFlow.range = coverFlow.range === 10 ? (Math.floor(window.innerWidth / size) - 1) : 10;
                coverFlow.update();
            };

            p.appendChild(s);

            break;
        }

        default: {
            p.style.fontWeight = 'bold';
            p.style.opacity    = '0.25';

            p.textContent = i - 1;
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
    .attach(document.querySelector('main .container'))
    .update();

window.addEventListener('wheel', (e) => {
    coverFlow.update(e.deltaY > 0 ? coverFlow.index + 1 : e.deltaY < 0 ? coverFlow.index - 1 : coverFlow.index);
}, { passive: true });

window.addEventListener('keydown', e => {
    coverFlow.update(e.key === 'ArrowRight' ? coverFlow.index + 1 : e.key === 'ArrowLeft' ? coverFlow.index - 1 : coverFlow.index);

    if(e.key === 'D') coverFlow.destroy();
    if(e.key === 'A') coverFlow.attach(document.querySelector('main .container')).update();
});

let x = 0;

window.addEventListener('touchstart', e => {
    x = e.changedTouches[0].clientX;
}, { passive: true });

window.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - x;

    coverFlow.update(diff < -50 ? coverFlow.index + 1 : diff > 50 ? coverFlow.index - 1 : coverFlow.index);
}, { passive: true });