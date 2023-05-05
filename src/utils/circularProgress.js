const { CanvasRenderService } = require('chartjs-node-canvas');

const width = 400; // width of the canvas
const height = 400; // height of the canvas
const canvas = new CanvasRenderService(width, height, (Chart) => { });

const configuration = {
    type: 'doughnut',
    data: {
        datasets: [{
            data: [75, 25],
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)'
            ],
            borderWidth: 0
        }]
    },
    options: {
        cutout: '80%',
        plugins: {
            doughnutlabel: {
                labels: [{
                    text: '75%',
                    font: {
                        size: '50',
                        weight: 'bold'
                    },
                    color: '#000'
                }]
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false
        }
    }
};

canvas.renderToBuffer(configuration).then(buffer => {
    // buffer contains the image in PNG format
    console.log('Image created:', buffer);
}).catch(err => {
    console.error(err);
});
