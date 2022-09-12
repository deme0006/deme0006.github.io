const cardElements = document.querySelectorAll('.main-content-card');

[...cardElements].forEach(element => element.onclick = function (event) {
    if (!String(event.target).includes('http')) {
        if (this.style.paddingBottom) {
            this.children[1].style = null;
            this.style = null;
            this.children[2].style = null;
        } else {
            this.children[1].style.fontSize = '1em';
            this.style.paddingBottom = '0';
            this.children[2].style.animation = 'none'
            this.children[2].style.transform = 'rotateX(180deg) rotateZ(135deg)'

        }
    }
})