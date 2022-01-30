//This module has no exports (yet?). It is a self-executing button effects provider.
// To use it just import it

// If new effects are added, no change to init is required
const availableEffects = [
    ["ripple", ripple]
];

function ripple (event) {
    let boundingRect = event.target.getBoundingClientRect();
    let x = event.clientX - boundingRect.left;
    let y = event.clientY - boundingRect.top;
    // console.log(event.clientY);
    // console.log(event.target.offsetTop);
    let circle = document.createElement('span');
    circle.style.setProperty('--ripple-x', x + 'px');
    circle.style.setProperty('--ripple-y', y + 'px');
    event.target.appendChild(circle);
    setTimeout(() => circle.remove(), 500)
}

//Set up button effects
document.addEventListener('DOMContentLoaded', () => {
    for (let effect of availableEffects)
    {
        let buttons = document.querySelectorAll(`button.${effect[0]}`);
        buttons.forEach(b => b.addEventListener('click', effect[1]));
    }
});