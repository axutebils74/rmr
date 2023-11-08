// 四指暂停
// 五指结束录制
(function(){
    if(window.rpgmvMediaRecorder){
        var r = window.rpgmvMediaRecorder;
        if(r.mediaRecorder.state === 'inactive'){
            r.mediaRecorder.start();
        }
    }else{
        window.rpgmvMediaRecorder = {

        }
        var r = window.rpgmvMediaRecorder;
        r.combinedStream = new MediaStream();
        r.videoStream = GameCanvas.captureStream(25); // 25 FPS
        r.videoStream.getVideoTracks().forEach(function (track) {
          r.combinedStream.addTrack(track);
        });
        r.dest = new MediaStreamAudioDestinationNode(WebAudio._context);
        r.dest.stream.getAudioTracks().forEach(function (track) {
          r.combinedStream.addTrack(track);
        });
        r.mediaRecorder = new MediaRecorder(r.combinedStream, {
        'type': 'video/webm'
        });
        var chunks = [];
        r.mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data);
        };
        r.mediaRecorder.onstop = function () {
        var blob = new Blob(chunks, {
            'type': 'video/webm'
        });
        chunks.length = 0
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = Date.now() + '.webm'
        a.click();
        };
        r.mediaRecorder.start(); 
        WebAudio.prototype.$_connectNodes = WebAudio.prototype._connectNodes;
        WebAudio.prototype._connectNodes = function () {
          this.$_connectNodes();
          WebAudio._masterGainNode.connect(r.dest);
        };
        window.addEventListener("touchstart",function(e){
            if(r.mediaRecorder.state === 'inactive'){
                if(e.touches.length === 5) r.mediaRecorder.start()
            }else if(e.touches.length === 4){
                if(r.mediaRecorder.state === 'paused'){
                    r.mediaRecorder.resume()
                }else{
                    r.mediaRecorder.pause()
                }
            }else if(e.touches.length === 5){
                r.mediaRecorder.stop()
            }
        })
    }
})()
