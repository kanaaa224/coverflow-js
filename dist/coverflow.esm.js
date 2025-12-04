// --------------------------------------------------
//  CoverFlow JS
//  (c) 2025 kanaaa224. All rights reserved.
// --------------------------------------------------

import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/+esm';

class CoverFlow {
    constructor(items = [], loop = false, range = 10) {
        this.items  = items;
        this.length = items.length;
        this.loop   = loop;
        this.range  = range;

        this.container = null;
        this.index     = 0;
    }

    attach(parent = document.body) {
        if(this.container) return this;

        this.container = document.createElement('div');

        this.container.classList.add('coverFlow');

        this.container.style.perspective    = '200vh';
        this.container.style.transformStyle = 'preserve-3d';
        this.container.style.display        = 'flex';
        this.container.style.justifyContent = 'center';
        this.container.style.alignItems     = 'center';

        this.items.forEach((item, i) => {
            item.classList.add('item');

            item.style.position       = 'absolute';
            item.style.transformStyle = 'inherit';

            if(item.updatable) {
                const original = item.onclick;

                item.onclick = original ? () => { this.update(i); original(); } : () => this.update(i);
            }

            this.container.appendChild(item);
        });

        parent.appendChild(this.container);

        return this;
    }

    update(index = this.index) {
        this.index = this.loop ? ((index % this.length) + this.length) % this.length : Math.max(0, Math.min(index, this.length - 1));

        const w = this.items[0].offsetWidth;

        this.items.forEach((item, i) => {
            let offset = i - this.index;

            if(this.loop) {
                if(offset >  this.length / 2) offset -= this.length;
                if(offset < -this.length / 2) offset += this.length;
            }

            const s = offset === 0 ? 1 : 0.95;
            const x = w * 0.5 * offset + (offset < 0 ? -w * 0.4 : offset > 0 ? w * 0.4 : 0);
            const z = offset === 0 ? 0 : -w * 1.8;
            const r = offset < 0 ? 55 : offset > 0 ? -55 : 0;

            const opacity = Math.abs(offset) > this.range ? 0 : 1;

            gsap.to(item, {
                duration: 1,
                x,
                z,
                rotateY: r,
                scale: s,
                opacity,
                ease: 'expo.out',
                filter: `brightness(${s})`
            });
        });

        return this;
    }

    destroy() {
        if(!this.container) return this;

        this.container.remove();
        this.container = null;

        return this;
    }
}

export default CoverFlow;