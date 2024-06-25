import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop } from '@fortawesome/free-solid-svg-icons';
import { MdClear } from 'react-icons/md';
import AudioTimer from './AudioRecorder.jsx';
import { ReactMic } from 'react-mic';
import './ReactRecorder.css'; // Ensure this CSS file exists

const ReactRecorder = ({ onRecordingComplete }) => {
  const [isRunning, setIsRunning] = React.useState(false);
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const [voice, setVoice] = React.useState(false);
  const [recordBlob, setRecordBlob] = React.useState(null); // Store the recorded blob
  const [showConfirmation, setShowConfirmation] = React.useState(false);

  const onStop = (recordedBlob) => {
    setRecordBlob(recordedBlob);
    setIsRunning(false);
    setShowConfirmation(true); // Show confirmation after stopping
  };

  const startHandle = () => {
    setIsRunning(true);
    setVoice(true);
  };

  const stopHandle = () => {
    setIsRunning(false);
    setVoice(false);
  };

  const clearHandle = () => {
    setIsRunning(false);
    setVoice(false);
    setRecordBlob(null); // Clear recorded blob
    setElapsedTime(0);
    setShowConfirmation(false); // Hide confirmation on clear
  };

  const confirmSave = () => {
    setShowConfirmation(false); // Hide confirmation after save
    onRecordingComplete(recordBlob.blob); // Pass the blob to parent component
    setRecordBlob(null); // Clear recorded blob after saving
  };

  return (
    <div className="recorder-container">
      <div className="recorder-button">
        <ReactMic
          record={voice}
          className="mic"
          onStop={onStop}
          strokeColor="#000000"
          backgroundColor="transparent"
        />
        {!isRunning ? (
          <button
            onClick={startHandle}
            className="recorder-start-button"
          >
            <FontAwesomeIcon icon={faMicrophone} className="icon" />
          </button>
        ) : (
          <button
            onClick={stopHandle}
            className="recorder-stop-button"
          >
            <FontAwesomeIcon icon={faStop} className="icon" />
          </button>
        )}
      </div>
      {isRunning && (
        <div className="timer">
          <AudioTimer
            isRunning={isRunning}
            elapsedTime={elapsedTime}
            setElapsedTime={setElapsedTime}
          />
        </div>
      )}
      {showConfirmation && (
        <div className="recorder-confirmation">
          <button
            onClick={confirmSave}
            className="recorder-send-button"
          >
            <FontAwesomeIcon icon={faMicrophone} className="mr-1" /> 
          </button>
          <button
            onClick={clearHandle}
            className="recorder-discard-button"
          >
            <MdClear className="mr-1" /> 
          </button>
        </div>
      )}
    </div>
  );
};

export default ReactRecorder;
