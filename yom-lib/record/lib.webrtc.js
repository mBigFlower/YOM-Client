class _webrtc {
  constructor () {
    this._mediaConstraints = {
      optional: [],
      mandatory: {
        // 这两个值如果不设置，默认是 false，
        // 在后续的获取 candidate 时，是拿不到的。之后设置为 true，才能拿到 candidate
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
      }
    }
  }

  async getScreen(options) {
    return navigator.mediaDevices.getDisplayMedia(options)
  }

  /* 音视频采集 */
  getMedia (constraints) {
    return new Promise((resolve, reject) => {
      if (!this._isSupport()) {
        return reject('browser not support webrtc.')
      }
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
          resolve(stream)
        })
        .catch(function (err) {
          reject('Unable to get video stream:' + err)
        })
    })
  }

  /* 获取设备列表 */
  getDevices () {
    return navigator.mediaDevices.enumerateDevices()
  }

  /* 创建PeerConnection */
  getPeerConnection (onicecandidate, ontrack, onicegatheringcomplete) {
    const pc = new RTCPeerConnection(null)
    pc.onicecandidate = onicecandidate
    pc.ontrack = ontrack
    pc.onicegatheringstatechange = function () {
      if (pc.iceGatheringState === 'complete') {
        onicegatheringcomplete()
      }
    }
    return pc
  }

  /* 绑定candidate */
  addIceCandidate (pc, candidate) {
    return new Promise(function (resolve, reject) {
      if (pc) {
        pc.addIceCandidate(new RTCIceCandidate(candidate))
          .then(resolve)
          .catch(reject)
      } else {
        reject('peerconnection is null.')
      }
    })
  }

  /* 绑定音视频流到PeerConnection */
  addTracks (pc, stream) {
    if (pc && stream) {
      stream.getTracks().forEach(
        function (track) {
          pc.addTrack(track, stream)
        })
    }
  }

  /* 创建Offer */
  createOffer (pc, bitrate) {
    return new Promise((resolve, reject) => {
      if (pc) {
        pc.createOffer(desc => {
          // desc.sdp = setVideoBitrate(desc.sdp, bitrate);
          pc.setLocalDescription(desc, function () {
            resolve(desc)
          }, reject)
        }, reject, this._mediaConstraints)
      } else {
        reject('peerconnection is null.')
      }
    })
  }

  /* 创建应答 */
  createAnswer (pc, remoteSdp, bitrate) {
    return new Promise((resolve, reject) => {
      if (pc) {
        const remoteDesc = new RTCSessionDescription(remoteSdp)
        // remoteDesc.sdp = updateBandwidthRestriction(remoteDesc.sdp, bindwidth);
        pc.setRemoteDescription(remoteDesc, () => {
          pc.createAnswer(desc => {
            // desc.sdp = setVideoBitrate(desc.sdp, bitrate);
            pc.setLocalDescription(desc, function () {
              resolve(desc)
            }, reject)
          }, reject, this._mediaConstraints)
        }, reject)
      } else {
        reject('peerconnection is null.')
      }
    })
  }

  /* 接收应答 */
  receiveAnswer (pc, remoteSdp) {
    return new Promise(function (resolve, reject) {
      if (pc) {
        const remoteDesc = new RTCSessionDescription(remoteSdp)
        // remoteDesc.sdp = updateBandwidthRestriction(remoteDesc.sdp, bindwidth);
        pc.setRemoteDescription(remoteDesc, resolve, reject)
      } else {
        reject('peerconnection is null.')
      }
    })
  }

  /* 关闭PeerConnection */
  close (pc) {
    if (pc) {
      // 释放PeerConnection资源
      pc.close()
      pc.onicecandidate = null
      pc.ontrack = null
      pc = null
    }
  }

  /* 绑定音频输出设备 */
  attachAudioOutput (element, sinkId) {
    return new Promise(function (resolve, reject) {
      if (typeof element.sinkId !== 'undefined') {
        element.setSinkId(sinkId)
          .then(resolve)
          .catch(function (err) {
            if (err.name === 'SecurityError') {
              reject('You need to use HTTPS for selecting audio output device: ' + err)
            } else {
              reject(err)
            }
          })
      } else {
        reject('Element does not support output device selection.')
      }
    })
  }

  mute (stream, ismute) {
    return new Promise(function (resolve, reject) {
      if (stream) {
        stream.getAudioTracks().forEach(
          function (track) {
            track.enabled = !ismute
          })
        resolve()
      } else {
        reject('[mute] mediatream is null.')
      }
    })
  }

  muteVideo (stream, ismute) {
    return new Promise(function (resolve, reject) {
      if (stream) {
        stream.getVideoTracks().forEach(
          function (track) {
            track.enabled = !ismute
          })
        resolve()
      } else {
        reject('[muteVideo] mediatream is null.')
      }
    })
  }

  _isSupport () {
    // chrome://flags/#unsafely-treat-insecure-origin-as-secure    enable  且要输入 ip:port
    if (!navigator.mediaDevices.getUserMedia) { return false }
    return true
  }

  // Find the line in sdpLines that starts with |prefix|, and, if specified,
  // contains |substr| (case-insensitive search).
  _findLine (sdpLines, prefix, substr) {
    return this._findLineInRange(sdpLines, 0, -1, prefix, substr)
  }

  // Find the line in sdpLines[startLine...endLine - 1] that starts with |prefix|
  // and, if specified, contains |substr| (case-insensitive search).
  _findLineInRange (sdpLines, startLine, endLine, prefix, substr) {
    const realEndLine = endLine !== -1 ? endLine : sdpLines.length
    for (let i = startLine; i < realEndLine; ++i) {
      if (sdpLines[i].indexOf(prefix) === 0) {
        if (!substr ||
                    sdpLines[i].toLowerCase().indexOf(substr.toLowerCase()) !== -1) {
          return i
        }
      }
    }
    return null
  }

  // Gets the codec payload type from an a=rtpmap:X line.
  _getCodecPayloadType (sdpLine) {
    const pattern = /a=rtpmap:(\d+) \w+\/\d+/
    const result = sdpLine.match(pattern)
    return (result && result.length === 2) ? result[1] : null
  }

  /* 设置码率 */
  _setVideoBitrate (sdp, bitrate) {
    const xgoogle_min_bitrate = bitrate
    const xgoogle_max_bitrate = bitrate

    const sdpLines = sdp.split('\r\n')

    // H264
    const h264Index = this._findLine(sdpLines, 'a=rtpmap', 'H264/90000')
    let h264Payload
    if (h264Index) {
      h264Payload = this._getCodecPayloadType(sdpLines[h264Index])
    }

    if (!h264Payload) {
      return sdp
    }

    let appendrtxNext = '\r\n'
    appendrtxNext += 'a=fmtp:' + h264Payload + ' x-google-min-bitrate=' + (xgoogle_min_bitrate || '228') + '; x-google-max-bitrate=' + (xgoogle_max_bitrate || '228')
    sdpLines[h264Index] = sdpLines[h264Index].concat(appendrtxNext)
    sdp = sdpLines.join('\r\n')

    return sdp
  }

  /* 设置带宽限制 */
  _updateBandwidthRestriction (sdp, bandwidth) {
    if (!bandwidth || bandwidth === 'unlimited') {
      // 无限制
      return sdp.replace(/b=AS:.*\r\n/, '').replace(/b=TIAS:.*\r\n/, '')
    } else {
      const modifier = 'AS'
      if (sdp.indexOf('b=' + modifier + ':') === -1) {
        // insert b= after c= line.
        // sdp = sdp.replace(/c=IN (.*)\r\n/,
        //     'c=IN $1\r\nb=' + modifier + ':' + bandwidth + '\r\n');
        sdp = sdp.replace(/a=mid:video\r\n/g,
          'a=mid:video\r\nb=' + modifier + ':' + bandwidth + '\r\n')
      } else {
        sdp = sdp.replace(new RegExp('b=' + modifier + ':.*\r\n'),
          'b=' + modifier + ':' + bandwidth + '\r\n')
      }
      return sdp
    }
  }
}

class _mediaDeviceControl {
  constructor () {
    this.deviceList = []
    this.options = {
      audioinput: {},
      videoinput: {},
      audiooutput: {}
    }
  }

  /**
     * 获取设备列表
     */
  getMediaDevices () {
    return new Promise((resolve, reject) => {
      this.deviceList.splice(0)
      // 获取本地音视频设备列表
      webrtc.getDevices().then((deviceInfos) => {
        for (let i = 0; i < deviceInfos.length; i++) {
          const device = deviceInfos[i]
          this.deviceList.push(device)
        }
        resolve(this.deviceList)
      }).catch(reject)
    })
  }

  /**
     * 获取当前设置的媒体设备信息
     */
  getOptions () {
    return this.options
  }

  getLocalCamera () {
    const constraints = { audio: false, video: true }
    return new Promise(function (resolve, reject) {
      navigator.getUserMedia(constraints, stream => {
        resolve(stream)
      }, err => {
        reject(err)
      })
    })
  }

  setSpeakerDevice (playDev) {
    this.options.audiooutput = playDev
  }

  setAudioCaptureDevice (captureDev) {
    this.options.audioinput = captureDev
  }

  setVideoCaptureDevice (captureDev) {
    this.options.videoinput = captureDev
  }

  _webRTCKind2MediaType (kind) {
    if (kind === 'videoinput') {
      return 0
    } else if (kind === 'audioinput') {
      return 2
    } else if (kind === 'audiooutput') {
      return 3
    }
    return kind
  }
}

const webrtc = new _webrtc()
const mediaDeviceControl = new _mediaDeviceControl()

export { webrtc, mediaDeviceControl }
