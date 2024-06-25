import React, { useState, useEffect } from 'react';

const AudioRecorder = ({ onRecordingComplete }) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

  useEffect(() => {
    if (recording) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const recorder = new MediaRecorder(stream);
          recorder.ondataavailable = event => {
            setAudioChunks(prev => [...prev, event.data]);
          };
          recorder.onstop = () => {
            const audioBlob = new Blob(audioChunks);
            onRecordingComplete(audioBlob);
            setAudioChunks([]);
          };
          recorder.start();
          setMediaRecorder(recorder);
        })
        .catch(err => console.error('Error accessing microphone:', err));
    } else {
      mediaRecorder?.stop();
    }
  }, [recording]);

  const handleRecord = () => setRecording(true);
  const handleStop = () => setRecording(false);

  return (
    <div>
      {recording ? (
        <button onClick={handleStop}>Stop Recording</button>
      ) : (
        <button onClick={handleRecord}>Start Recording</button>
      )}
    </div>
  );
};

export default AudioRecorder;