var Db  = require('./dboperations');
var Device = require('./DeviceID');
const dboperations = require('./dboperations');
const fs = require('fs')
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/Videos', router);


router.use((request,response,next)=>{
   console.log('middleware');
   next();
})

router.route('/video').get((request,response)=>{

    dboperations.getvideo().then(result => {
       response.json(result[0]);
    })

})



router.get('/:id',(req,res)=> {
    const aid = req.params.id
    dboperations.getvideoid(aid).then(result=>{
    res.json(result[0]);
    console.log(result[0])
})
})



router.route('/video').post((request,response)=>{    
    var device = request.body
    
    dboperations.PostID(device).then(result => {
      return response.status(201).json(device);      
          
    })

})


router.get('/video/:id', (req, res) => {
    const videoPath = `assets/${req.params.id}`;
    const videoStat = fs.statSync(videoPath);
    const fileSize = videoStat.size;
    const videoRange = req.headers.range;
    if (videoRange) {
        const parts = videoRange.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize-1;
        const chunksize = (end-start) + 1;
        const file = fs.createReadStream(videoPath, {start, end});
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);
    }
});



var port = process.env.PORT || 3030;
app.listen(port);
console.log('Order API is runnning at ' + port);



