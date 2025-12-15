/*
    (c) 2024 kanaaa224. All rights reserved.
*/

import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/+esm';

export default class CoverFlow {

    constructor(items = [], loop = false, range = 10) {
        this.items = items;
        this.loop  = loop;
        this.range = range;

        this.container = null;
        this.index     = 0;
    }

    attach(parent = document.body) {
        if(this.container) return this;

        this.container = document.createElement('div');

        this.container.style.perspective    = '200vh';
        this.container.style.transformStyle = 'preserve-3d';
        this.container.style.display        = 'flex';
        this.container.style.justifyContent = 'center';
        this.container.style.alignItems     = 'center';

        for(const [ i, item ] of this.items.entries()) {
            item.style.position       = 'absolute';
            item.style.transformStyle = 'inherit';

            if(item.updatable) {
                const onclick = item.onclick;

                item.onclick = onclick ? () => { this.update(i); onclick(); } : () => this.update(i);
            }

            this.container.appendChild(item);
        }

        parent.appendChild(this.container);

        return this;
    }

    update(index = this.index) {
        const length = this.items.length;

        this.index = this.loop ? ((index % length) + length) % length : Math.max(0, Math.min(index, length - 1));

        for(const [ i, item ] of this.items.entries()) {
            let offset = i - this.index;

            if(this.loop) {
                if(offset >  length / 2) offset -= length;
                if(offset < -length / 2) offset += length;
            }

            const w = item.offsetWidth;
            const x = w * 0.5 * offset + (offset < 0 ? -w * 0.4 : offset > 0 ? w * 0.4 : 0);
            const z = offset === 0 ? 0 : -w * 1.8;
            const r = offset < 0 ? 55 : offset > 0 ? -55 : 0;
            const s = offset === 0 ? 1 : 0.95;
            const o = Math.abs(offset) > this.range ? 0 : 1;

            gsap.to(item, {
                x, z,
                rotateY: r,
                scale: s,
                opacity: o,
                duration: 1,
                ease: 'expo.out',
                filter: `brightness(${s})`
            });
        }

        return this;
    }

    destroy() {
        if(!this.container) return this;

        this.container.remove();

        this.container = null;
        this.index     = 0;

        return this;
    }

}