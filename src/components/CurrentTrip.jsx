import React from 'react';

const CurrentTrip = ({ activeTrip, progress, remainingTime, handleComplete }) => {
  const darkBlue = '#003366';

  return (
    <div className="bg-white p-4 rounded-xl shadow border" style={{ borderColor: darkBlue }}>
      <h3 className="font-extrabold mb-4" style={{ color: '#222222' }}>Current Trip</h3>
      {activeTrip ? (
        <>
          <p className="font-extrabold" style={{ color: darkBlue }}>
            {activeTrip.from} → {activeTrip.to}
          </p>
          <p className="text-xs text-gray-500">
            {activeTrip.startTime} – {activeTrip.endTime}
          </p>

          <div className="w-full bg-gray-300 rounded-full mt-4">
            <div
              className="h-2 rounded-full"
              style={{ backgroundColor: darkBlue, width: `${progress}%` }}
            ></div>
          </div>

          <p className="mt-2 font-extrabold" style={{ color: darkBlue }}>
            Estimated Time Left: {remainingTime} min
          </p>

          <button
            onClick={() => handleComplete(activeTrip._id || 1)}
            className="mt-4 px-4 py-2 font-extrabold rounded transition"
            style={{
              color: darkBlue,
              border: `1px solid ${darkBlue}`,
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = darkBlue;
              e.target.style.color = '#fff';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = darkBlue;
            }}
          >
            Mark Completed
          </button>
        </>
      ) : (
        <p className="text-gray-500">No active trip</p>
      )}
    </div>
  );
};

export default CurrentTrip;
