// 5 结束录制
// 1 暂停或者恢复
// 3 开始录制
(function () {
    if (window.rpgmvMediaRecorder) {
        var r = window.rpgmvMediaRecorder;
        if (r.mediaRecorder.state === 'inactive') {
            r.mediaRecorder.start(1000);
        }
    } else {
        window.rpgmvMediaRecorder = {

        }
        var r = window.rpgmvMediaRecorder;
        r.combinedStream = new MediaStream();
        r.videoStream = GameCanvas.captureStream(30); // 30 是帧率
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
            open(URL.createObjectURL(blob));
            chunks.length = 0
        };
        r.mediaRecorder.start(1000);
        WebAudio.prototype.$_connectNodes = WebAudio.prototype._connectNodes;
        WebAudio.prototype._connectNodes = function () {
            this.$_connectNodes();
            WebAudio._masterGainNode.connect(r.dest);
        };
        window.addEventListener("keydown", function (e) {
            if (r.mediaRecorder.state === 'inactive') {
                if (e.keyCode === 99) r.mediaRecorder.start(1000); // 每个1s添加一次chunks，无参数表示完整视频
            } else if (e.keyCode === 101) {
                r.mediaRecorder.stop()
            } else if (e.keyCode === 97) {
                if (r.mediaRecorder.state === 'paused') {
                    r.mediaRecorder.resume()
                } else {
                    r.mediaRecorder.pause()
                }
            }
        })
    }
})()
