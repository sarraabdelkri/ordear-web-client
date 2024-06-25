
import React from 'react';

const AudioTimer = ({ isRunning, elapsedTime, setElapsedTime }) => {
  React.useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => setElapsedTime(elapsedTime + 1), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, elapsedTime]);

  const hours = Math.floor(elapsedTime / 360000);
  const minutes = Math.floor((elapsedTime % 360000) / 6000);
  const seconds = Math.floor((elapsedTime % 6000) / 100);
  const milliseconds = elapsedTime % 100;

  const styles = {
    timerContainer: {
      marginLeft: '0.5rem',
      display: 'flex',
      alignItems: 'center',
    },
    timerBox: {
      backgroundColor: '#f3f4f6', // bg-gray-100
      borderRadius: '9999px', // rounded-full
      padding: '0.5rem', // p-2
      width: '4rem', // w-16
      height: '4rem', // h-16
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    timerText: {
      textAlign: 'center',
      fontSize: '1.125rem', // text-lg
      fontWeight: '600', // font-semibold
    },
  };

  return (
    <div style={styles.timerContainer}>
      <div style={styles.timerBox}>
        <div style={styles.timerText}>
          {hours}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}.{milliseconds.toString().padStart(2, '0')}
        </div>
      </div>
    </div>
  );
};

export default AudioTimer;