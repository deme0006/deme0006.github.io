const header = document.quer
const buttonElements = document.querySelectorAll('.main-content-card-button');
const sampleCardElement = document.querySelector('.main-sample-card');
const mainContentElement = document.querySelector('.main-content');
const mainSampleCardCloseElement = document.querySelector('.main-sample-card-close');

const blurryElement = document.createElement('div');
document.body.insertBefore(blurryElement, document.body.children[0]);
blurryElement.style = `position: absolute; width: 100vw; height: ${document.body.offsetHeight ? document.body.offsetHeight : document.height}px; z-index: 1000; backdrop-filter: blur(8px); cursor: pointer; background: rgba(51, 51, 51, 0.453);`;
blurryElement.style.display = 'none';

blurryElement.onclick = function () {
    this.style.display = 'none';
    sampleCardElement.style.opacity = '0';
    setTimeout(() => sampleCardElement.style.display = 'none', 500);
}

mainSampleCardCloseElement.onclick = function () {
    blurryElement.click();
};

[...buttonElements].forEach(buttonElement => {
    buttonElement.onclick = () => {
        blurryElement.style.display = null;
        sampleCardElement.style.display = 'block';
        setTimeout(() => sampleCardElement.style.opacity = '100%')
    }
});