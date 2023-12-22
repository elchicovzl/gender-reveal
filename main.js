

const createScratchCard = (canvasId, color, results) => {

    let canvas = document.getElementById(canvasId);
    let context = canvas.getContext("2d", { willReadFrequently: true });

    const devicePixelRatio = window.devicePixelRatio || 1;

    const canvasWidth = canvas.offsetWidth * devicePixelRatio;
    const canvasHeight = canvas.offsetHeight * devicePixelRatio;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    context.scale(devicePixelRatio, devicePixelRatio)

    const init = () => {
        context.fillStyle = color;
        context.fillRect(0, 0, 100, 100);
    }

    let isDraggin = false;

    const scratch = (x, y) => {
        context.globalCompositeOperation = "destination-out";
        context.beginPath();
        context.arc(x, y, 14, 0, 2 * Math.PI);
        context.fill();
    }

    const checkBlackFillPercentaje = (index, gender, parent) => {
        const imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
        const pixelData = imageData.data;
    
        let blackPixelCount = 0;
        let colour = '';
        
        for (let i = 0; i < pixelData.length; i += 4) {
            
            const red = pixelData[i];
            const green = pixelData[i + 1];
            const blue = pixelData[i + 2];
            const alpha = pixelData[i + 3];

            colour = `rgb(${red}, ${green}, ${blue}, ${alpha})`;
            let hexCode = `#${[red, green, blue].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
            

            if (hexCode === "#604092") {
                blackPixelCount++;
            }
        }

        const BlackFillPercentaje = blackPixelCount * 100 / (canvasWidth * canvasHeight);
        
        if (BlackFillPercentaje <= 80) {
            context.clearRect(0, 0, 100, 100);
            parent.classList.add("revealed");

            let flag = true;
            results.some( item => {
                if (item.index === index) {
                    flag = false;
                }
            });

            if (flag) {
                results.push({
                    'index': index,
                    'gender': gender
                });
            }

            if (results.length >= 4) {
                //searhc if winner
               let cont = 0;

               for (const item of results) {
                if (item.gender === 'niño') cont += 1;
               }


                if (cont == 4) {
                    smokeReveal();
                    confettiFireworks();
                    const elment = document.getElementById("gender-reveal");
                    const elment2 = document.getElementById("gender-reveal2");
                    elment.classList.add("revealed");
                    elment2.classList.add("revealed");
                }
            }

        }
    }

    canvas.addEventListener("mousedown", (event) => {
        isDraggin = true;

        scratch(event.offsetX, event.offsetY);
    });

    canvas.addEventListener("touchstart", (event) => {
        isDraggin = true;
        let rect = event.target.getBoundingClientRect();
        let x = event.touches[0].clientX  - rect.x;
        let y = event.touches[0].clientY  - rect.y;
        scratch(x, y);
    });

    canvas.addEventListener("mousemove", (event) => {
        if(isDraggin) {
            scratch(event.offsetX, event.offsetY);
        }
    });

    canvas.addEventListener("touchmove", (event) => {
        if(isDraggin) {
            let rect = event.target.getBoundingClientRect();
            let x = event.touches[0].clientX  - rect.x;
            let y = event.touches[0].clientY  - rect.y;
            scratch(x, y);
        }
    });

    canvas.addEventListener("mouseup", (event) => {
        isDraggin = false;
        let gender = event.target.id.split('-');
        checkBlackFillPercentaje(gender[2], gender[3], event.target.parentElement);
    });

    canvas.addEventListener("mouseleave", (event) => {
        isDraggin = false;
        let gender = event.target.id.split('-');
        checkBlackFillPercentaje(gender[2], gender[3], event.target.parentElement);
    });

    canvas.addEventListener("touchend", (event) => {
        isDraggin = false;
        let gender = event.target.id.split('-');
        checkBlackFillPercentaje(gender[2], gender[3], event.target.parentElement);
    });

    init();
}

const confettiFireworks = () => {
    const duration = 15 * 1000,
    animationEnd = Date.now() + duration,
    defaults = { startVelocity: 20, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
        return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // since particles fall down, start a bit higher than random
    confetti(
        Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
    );
    confetti(
        Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
    );
    }, 250);
}

const smokeReveal = () => {
    var canvas = document.getElementById('smoke')
	var ctx = canvas.getContext('2d')
	canvas.width = innerWidth
	canvas.height = innerHeight
	var party = smokemachine(ctx, [10,29,112])
	party.start() // start animating
	party.setPreDrawCallback(function(dt){
		party.addSmoke(innerWidth/2, innerHeight, .5)
		canvas.width = innerWidth
		canvas.height = innerHeight
	})


}

document.addEventListener("DOMContentLoaded", function(event) {
    const start = (data) => {
        data.sort(function(a, b){return 0.5 - Math.random()});
        let results = [];

        const board = document.querySelector(".board");
        data.forEach((elm, index) => {
            let  image = '';

            if (elm.gender == "niño") {
                image =  '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64px" height="64px" viewBox="0,0,256,256"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(4,4)"><path d="M51,47.584c0.612,0.268 1.289,0.416 2,0.416c2.761,0 5,-2.239 5,-5c0,-2.05 -2,-4 -4,-2" fill="#efd8be"></path><path d="M52,49c-1.137,0 -1.59,-0.327 -2.152,-0.827c-0.123,-0.108 -0.263,-0.234 -0.448,-0.373c-0.441,-0.332 -0.53,-0.959 -0.199,-1.4c0.331,-0.441 0.96,-0.529 1.4,-0.199c0.237,0.179 0.418,0.338 0.575,0.478c0.349,0.309 0.362,0.321 0.824,0.321c2.206,0 4,-1.794 4,-4c0,-0.77 -0.427,-1.55 -0.971,-1.775c-0.395,-0.162 -0.839,-0.001 -1.322,0.482c-0.391,0.391 -1.023,0.391 -1.414,0c-0.391,-0.391 -0.391,-1.023 0,-1.414c1.063,-1.062 2.341,-1.396 3.502,-0.916c1.298,0.538 2.205,2.028 2.205,3.623c0,3.309 -2.691,6 -6,6z" fill="#212ead"></path><path d="M13,47.584c-0.612,0.268 -1.289,0.416 -2,0.416c-2.761,0 -5,-2.239 -5,-5c0,-2.05 2,-4 4,-2" fill="#efd8be"></path><path d="M12,49c-3.309,0 -6,-2.691 -6,-6c0,-1.595 0.907,-3.085 2.205,-3.623c1.162,-0.479 2.438,-0.146 3.502,0.916c0.391,0.391 0.391,1.023 0,1.414c-0.391,0.391 -1.023,0.391 -1.414,0c-0.483,-0.483 -0.927,-0.646 -1.322,-0.482c-0.544,0.225 -0.971,1.005 -0.971,1.775c0,2.206 1.794,4 4,4c0.462,0 0.475,-0.012 0.824,-0.322c0.157,-0.14 0.338,-0.299 0.575,-0.478c0.441,-0.33 1.069,-0.241 1.4,0.199c0.331,0.441 0.242,1.068 -0.199,1.4c-0.186,0.139 -0.325,0.265 -0.448,0.373c-0.562,0.501 -1.015,0.828 -2.152,0.828z" fill="#212ead"></path><path d="M32,10c-12.70255,0 -23,10.52131 -23,23.5c0,12.97869 10.29745,23.5 23,23.5c12.70255,0 23,-10.52131 23,-23.5c0,-12.97869 -10.29745,-23.5 -23,-23.5z" fill="#faefde"></path><path d="M32,57c-13.233,0 -24,-10.767 -24,-24c0,-13.233 10.767,-24 24,-24c13.233,0 24,10.767 24,24c0,13.233 -10.767,24 -24,24zM32,11c-12.131,0 -22,9.869 -22,22c0,12.131 9.869,22 22,22c12.131,0 22,-9.869 22,-22c0,-12.131 -9.869,-22 -22,-22z" fill="#212ead"></path><path d="M28.516,17.331c-0.477,0 -0.898,-0.341 -0.983,-0.826l-0.348,-1.97c-0.097,-0.544 0.267,-1.062 0.811,-1.158c0.542,-0.103 1.062,0.267 1.158,0.811l0.348,1.97c0.097,0.544 -0.267,1.062 -0.811,1.158c-0.059,0.01 -0.118,0.015 -0.175,0.015zM23.851,18.88c-0.367,0 -0.721,-0.203 -0.896,-0.554l-0.893,-1.79c-0.247,-0.494 -0.046,-1.095 0.448,-1.341c0.498,-0.248 1.096,-0.045 1.341,0.448l0.893,1.79c0.247,0.494 0.046,1.095 -0.448,1.341c-0.144,0.073 -0.296,0.106 -0.445,0.106zM19.819,21.688c-0.266,0 -0.531,-0.105 -0.729,-0.315l-1.37,-1.457c-0.378,-0.402 -0.358,-1.035 0.044,-1.413c0.399,-0.378 1.033,-0.36 1.413,0.044l1.37,1.457c0.378,0.402 0.358,1.035 -0.044,1.413c-0.191,0.181 -0.438,0.271 -0.684,0.271zM16.767,25.539c-0.171,0 -0.344,-0.044 -0.502,-0.136l-1.729,-1.005c-0.478,-0.277 -0.64,-0.89 -0.361,-1.367c0.277,-0.478 0.891,-0.638 1.367,-0.361l1.729,1.005c0.478,0.277 0.64,0.89 0.361,1.367c-0.186,0.319 -0.521,0.497 -0.865,0.497zM14.929,30.097c-0.078,0 -0.157,-0.009 -0.236,-0.028l-1.943,-0.47c-0.536,-0.13 -0.866,-0.67 -0.736,-1.207c0.13,-0.536 0.671,-0.869 1.207,-0.736l1.943,0.47c0.536,0.13 0.866,0.67 0.736,1.207c-0.111,0.456 -0.52,0.764 -0.971,0.764z" fill="#212ead"></path><path d="M22.766,48.468c0,-0.158 0.013,-0.317 0.026,-0.475c0.238,-2.322 1.82,-3.993 4.208,-3.993c0.881,0 2.299,0.57 3,1c1.344,0.824 2.656,0.824 4,0c0.701,-0.43 2.119,-1 3,-1c2.388,0 3.97,1.671 4.208,3.993c0.013,0.158 0.026,0.317 0.026,0.475c0,0.158 -0.013,0.317 -0.026,0.475c-0.237,4.881 -4.261,8.1 -9.208,8.1c-4.947,0 -8.97,-3.219 -9.208,-8.1c-0.013,-0.158 -0.026,-0.317 -0.026,-0.475z" fill="#a1caf7"></path><path d="M32,58c-6.438,0 -10,-5.321 -10,-9c0,-3.532 2.056,-6 5,-6c1.303,0 2.233,0.62 3.055,1.168c0.67,0.446 1.248,0.832 1.945,0.832c0.697,0 1.275,-0.386 1.945,-0.832c0.822,-0.548 1.752,-1.168 3.055,-1.168c2.944,0 5,2.468 5,6c0,3.679 -3.562,9 -10,9zM27,45c-1.822,0 -3,1.57 -3,4c0,2.513 2.674,7 8,7c5.326,0 8,-4.487 8,-7c0,-2.43 -1.178,-4 -3,-4c-0.697,0 -1.275,0.386 -1.945,0.832c-0.822,0.548 -1.752,1.168 -3.055,1.168c-1.303,0 -2.233,-0.62 -3.055,-1.168c-0.67,-0.446 -1.248,-0.832 -1.945,-0.832z" fill="#212ead"></path><path d="M32,62c-3.921,0 -7.111,-3.19 -7.111,-7.111c0,-2.257 1.036,-4.33 2.844,-5.688c0.441,-0.33 1.067,-0.242 1.4,0.199c0.331,0.441 0.242,1.068 -0.199,1.4c-1.3,0.977 -2.045,2.467 -2.045,4.089c0,2.818 2.293,5.111 5.111,5.111c2.818,0 5.111,-2.293 5.111,-5.111c0,-1.622 -0.745,-3.112 -2.045,-4.089c-0.441,-0.332 -0.53,-0.959 -0.199,-1.4c0.333,-0.442 0.96,-0.53 1.4,-0.199c1.808,1.358 2.844,3.432 2.844,5.688c0,3.921 -3.19,7.111 -7.111,7.111z" fill="#212ead"></path><g fill="#212ead"><path d="M32,10.872c-0.553,0 -1,-0.447 -1,-1c0,-4.477 3.468,-8.872 7,-8.872c0.553,0 1,0.447 1,1c0,0.553 -0.447,1 -1,1c-2.43,0 -5,3.532 -5,6.872c0,0.553 -0.447,1 -1,1z"></path></g><g fill="#212ead"><path d="M32,10.872c-0.553,0 -1,-0.447 -1,-1c0,-2.272 -0.693,-4.448 -2.005,-6.292c-0.32,-0.45 -0.215,-1.075 0.234,-1.395c0.451,-0.319 1.076,-0.214 1.395,0.234c1.555,2.185 2.376,4.763 2.376,7.453c0,0.553 -0.447,1 -1,1z"></path></g><g fill="#212ead"><path d="M25,40c-0.553,0 -1,-0.447 -1,-1c0,-1.654 -1.346,-3 -3,-3c-1.654,0 -3,1.346 -3,3c0,0.553 -0.447,1 -1,1c-0.553,0 -1,-0.447 -1,-1c0,-2.757 2.243,-5 5,-5c2.757,0 5,2.243 5,5c0,0.553 -0.447,1 -1,1z"></path></g><g fill="#212ead"><path d="M47,40c-0.553,0 -1,-0.447 -1,-1c0,-1.654 -1.346,-3 -3,-3c-1.654,0 -3,1.346 -3,3c0,0.553 -0.447,1 -1,1c-0.553,0 -1,-0.447 -1,-1c0,-2.757 2.243,-5 5,-5c2.757,0 5,2.243 5,5c0,0.553 -0.447,1 -1,1z"></path></g></g></g></svg>';
            
            } else if (elm.gender == "niña") {
                image = ' <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64px" height="64px" viewBox="0,0,256,256"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(4,4)"><path d="M51,47.584c0.612,0.268 1.289,0.416 2,0.416c2.761,0 5,-2.239 5,-5c0,-2.05 -2,-4 -4,-2" fill="#efd8be"></path><path d="M52,49c-1.137,0 -1.59,-0.327 -2.152,-0.827c-0.123,-0.108 -0.263,-0.234 -0.448,-0.373c-0.441,-0.332 -0.53,-0.959 -0.199,-1.4c0.331,-0.441 0.96,-0.529 1.4,-0.199c0.237,0.179 0.418,0.338 0.575,0.478c0.349,0.309 0.362,0.321 0.824,0.321c2.206,0 4,-1.794 4,-4c0,-0.77 -0.427,-1.55 -0.971,-1.775c-0.395,-0.162 -0.839,-0.001 -1.322,0.482c-0.391,0.391 -1.023,0.391 -1.414,0c-0.391,-0.391 -0.391,-1.023 0,-1.414c1.063,-1.062 2.341,-1.396 3.502,-0.916c1.298,0.538 2.205,2.028 2.205,3.623c0,3.309 -2.691,6 -6,6z" fill="#9521ad"></path><path d="M13,47.584c-0.612,0.268 -1.289,0.416 -2,0.416c-2.761,0 -5,-2.239 -5,-5c0,-2.05 2,-4 4,-2" fill="#efd8be"></path><path d="M12,49c-3.309,0 -6,-2.691 -6,-6c0,-1.595 0.907,-3.085 2.205,-3.623c1.162,-0.479 2.438,-0.146 3.502,0.916c0.391,0.391 0.391,1.023 0,1.414c-0.391,0.391 -1.023,0.391 -1.414,0c-0.483,-0.483 -0.927,-0.646 -1.322,-0.482c-0.544,0.225 -0.971,1.005 -0.971,1.775c0,2.206 1.794,4 4,4c0.462,0 0.475,-0.012 0.824,-0.322c0.157,-0.14 0.338,-0.299 0.575,-0.478c0.441,-0.33 1.069,-0.241 1.4,0.199c0.331,0.441 0.242,1.068 -0.199,1.4c-0.186,0.139 -0.325,0.265 -0.448,0.373c-0.562,0.501 -1.015,0.828 -2.152,0.828z" fill="#9521ad"></path><path d="M32,10c-12.70255,0 -23,10.52131 -23,23.5c0,12.97869 10.29745,23.5 23,23.5c12.70255,0 23,-10.52131 23,-23.5c0,-12.97869 -10.29745,-23.5 -23,-23.5z" fill="#faefde"></path><path d="M32,57c-13.233,0 -24,-10.767 -24,-24c0,-13.233 10.767,-24 24,-24c13.233,0 24,10.767 24,24c0,13.233 -10.767,24 -24,24zM32,11c-12.131,0 -22,9.869 -22,22c0,12.131 9.869,22 22,22c12.131,0 22,-9.869 22,-22c0,-12.131 -9.869,-22 -22,-22z" fill="#9521ad"></path><path d="M28.516,17.331c-0.477,0 -0.898,-0.341 -0.983,-0.826l-0.348,-1.97c-0.097,-0.544 0.267,-1.062 0.811,-1.158c0.542,-0.103 1.062,0.267 1.158,0.811l0.348,1.97c0.097,0.544 -0.267,1.062 -0.811,1.158c-0.059,0.01 -0.118,0.015 -0.175,0.015zM23.851,18.88c-0.367,0 -0.721,-0.203 -0.896,-0.554l-0.893,-1.79c-0.247,-0.494 -0.046,-1.095 0.448,-1.341c0.498,-0.248 1.096,-0.045 1.341,0.448l0.893,1.79c0.247,0.494 0.046,1.095 -0.448,1.341c-0.144,0.073 -0.296,0.106 -0.445,0.106zM19.819,21.688c-0.266,0 -0.531,-0.105 -0.729,-0.315l-1.37,-1.457c-0.378,-0.402 -0.358,-1.035 0.044,-1.413c0.399,-0.378 1.033,-0.36 1.413,0.044l1.37,1.457c0.378,0.402 0.358,1.035 -0.044,1.413c-0.191,0.181 -0.438,0.271 -0.684,0.271zM16.767,25.539c-0.171,0 -0.344,-0.044 -0.502,-0.136l-1.729,-1.005c-0.478,-0.277 -0.64,-0.89 -0.361,-1.367c0.277,-0.478 0.891,-0.638 1.367,-0.361l1.729,1.005c0.478,0.277 0.64,0.89 0.361,1.367c-0.186,0.319 -0.521,0.497 -0.865,0.497zM14.929,30.097c-0.078,0 -0.157,-0.009 -0.236,-0.028l-1.943,-0.47c-0.536,-0.13 -0.866,-0.67 -0.736,-1.207c0.13,-0.536 0.671,-0.869 1.207,-0.736l1.943,0.47c0.536,0.13 0.866,0.67 0.736,1.207c-0.111,0.456 -0.52,0.764 -0.971,0.764z" fill="#9521ad"></path><path d="M22.766,48.468c0,-0.158 0.013,-0.317 0.026,-0.475c0.238,-2.322 1.82,-3.993 4.208,-3.993c0.881,0 2.299,0.57 3,1c1.344,0.824 2.656,0.824 4,0c0.701,-0.43 2.119,-1 3,-1c2.388,0 3.97,1.671 4.208,3.993c0.013,0.158 0.026,0.317 0.026,0.475c0,0.158 -0.013,0.317 -0.026,0.475c-0.237,4.881 -4.261,8.1 -9.208,8.1c-4.947,0 -8.97,-3.219 -9.208,-8.1c-0.013,-0.158 -0.026,-0.317 -0.026,-0.475z" fill="#f7a1ef"></path><path d="M32,58c-6.438,0 -10,-5.321 -10,-9c0,-3.532 2.056,-6 5,-6c1.303,0 2.233,0.62 3.055,1.168c0.67,0.446 1.248,0.832 1.945,0.832c0.697,0 1.275,-0.386 1.945,-0.832c0.822,-0.548 1.752,-1.168 3.055,-1.168c2.944,0 5,2.468 5,6c0,3.679 -3.562,9 -10,9zM27,45c-1.822,0 -3,1.57 -3,4c0,2.513 2.674,7 8,7c5.326,0 8,-4.487 8,-7c0,-2.43 -1.178,-4 -3,-4c-0.697,0 -1.275,0.386 -1.945,0.832c-0.822,0.548 -1.752,1.168 -3.055,1.168c-1.303,0 -2.233,-0.62 -3.055,-1.168c-0.67,-0.446 -1.248,-0.832 -1.945,-0.832z" fill="#9521ad"></path><path d="M32,62c-3.921,0 -7.111,-3.19 -7.111,-7.111c0,-2.257 1.036,-4.33 2.844,-5.688c0.441,-0.33 1.067,-0.242 1.4,0.199c0.331,0.441 0.242,1.068 -0.199,1.4c-1.3,0.977 -2.045,2.467 -2.045,4.089c0,2.818 2.293,5.111 5.111,5.111c2.818,0 5.111,-2.293 5.111,-5.111c0,-1.622 -0.745,-3.112 -2.045,-4.089c-0.441,-0.332 -0.53,-0.959 -0.199,-1.4c0.333,-0.442 0.96,-0.53 1.4,-0.199c1.808,1.358 2.844,3.432 2.844,5.688c0,3.921 -3.19,7.111 -7.111,7.111z" fill="#9521ad"></path><g fill="#9521ad"><path d="M32,10.872c-0.553,0 -1,-0.447 -1,-1c0,-4.477 3.468,-8.872 7,-8.872c0.553,0 1,0.447 1,1c0,0.553 -0.447,1 -1,1c-2.43,0 -5,3.532 -5,6.872c0,0.553 -0.447,1 -1,1z"></path></g><g fill="#9521ad"><path d="M32,10.872c-0.553,0 -1,-0.447 -1,-1c0,-2.272 -0.693,-4.448 -2.005,-6.292c-0.32,-0.45 -0.215,-1.075 0.234,-1.395c0.451,-0.319 1.076,-0.214 1.395,0.234c1.555,2.185 2.376,4.763 2.376,7.453c0,0.553 -0.447,1 -1,1z"></path></g><g fill="#9521ad"><path d="M25,40c-0.553,0 -1,-0.447 -1,-1c0,-1.654 -1.346,-3 -3,-3c-1.654,0 -3,1.346 -3,3c0,0.553 -0.447,1 -1,1c-0.553,0 -1,-0.447 -1,-1c0,-2.757 2.243,-5 5,-5c2.757,0 5,2.243 5,5c0,0.553 -0.447,1 -1,1z"></path></g><g fill="#9521ad"><path d="M47,40c-0.553,0 -1,-0.447 -1,-1c0,-1.654 -1.346,-3 -3,-3c-1.654,0 -3,1.346 -3,3c0,0.553 -0.447,1 -1,1c-0.553,0 -1,-0.447 -1,-1c0,-2.757 2.243,-5 5,-5c2.757,0 5,2.243 5,5c0,0.553 -0.447,1 -1,1z"></path></g></g></g></svg>';
               
            } else {
                image = '<img src="/heart.png" width="50">'
            }

            const item = `
                <div class="scratch-item">
                    <div class="scratch-container">
                        <div class="scratch-card">
                            <div class="code">
                                ${image}
                            </div>
                        </div>
                        <canvas class="canvas" id="scratch-card-${index}-${elm.gender}" width="100" height="100"></canvas>
                    </div>
                </div>
            `;

            const scratchItem = document.createElement('div', {class:'scratch-item'});
            
            //scratchItem.innerHTML = item;
            board.insertAdjacentHTML('beforeend', item);

            let iDScratch = `scratch-card-${index}-${elm.gender}`;

            createScratchCard(iDScratch, elm.color, results)
        });

        

    }

    fetch('/data.json')
    .then(response => response.json())
    .then(data => start(data));
    
});