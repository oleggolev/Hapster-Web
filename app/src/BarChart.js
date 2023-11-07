import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ReactionsPage = (props) => {
  const { session_id } = useParams();
  const [reactions, setReactions] = useState([]); // Initialize reactions as an empty array

  const formatTime = (timestamp) => {
    const reactionTime = new Date(timestamp);
    reactionTime.setHours(reactionTime.getHours() - 4);
    reactionTime.setSeconds(reactionTime.getSeconds() + 12);

    const hours = reactionTime.getHours().toString().padStart(2, '0');
    const minutes = reactionTime.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatTimeAgo = (timestamp) => {
    const then = new Date(timestamp);
    then.setHours(then.getHours() - 4);
    then.setSeconds(then.getSeconds() - 12);

    const timeDiff = Date.now() - then;
    console.log(timeDiff);
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) {
      return `${seconds} s${seconds === 1 ? '' : 's'} ago`;
    } else if (minutes < 60) {
      return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
    } else if (hours < 24) {
      return `${hours} hr${hours === 1 ? '' : 's'} ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days} day${days === 1 ? '' : 's'} ago`;
    }
  };

  // Function to fetch session data to initialize the array
  const fetchInitialReactions = async () => {
    try {
      const response = await fetch(
        `${props.serverurl}/get-session-data/${session_id}`
      );
      const data = await response.json();
      if (data.status === 'success' && data.data.reactions) {
        // Initialize reactions with the data from the session
        setReactions(data.data.reactions);
      }
    } catch (error) {
      console.error('Error fetching initial reactions:', error);
    }
  };

  // Function to poll reactions from the API and append to the array
  const pollReactions = async () => {
    try {
      const response = await fetch(
        `${props.serverurl}/get-reaction/${session_id}`
      );
      const data = await response.json();
      if (data) {
        // Append new reactions to the existing reactions array
        setReactions((prevReactions) => [...prevReactions, ...data]);
      }
    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  };

  useEffect(() => {
    // Fetch initial reactions when the page is first loaded
    fetchInitialReactions();
  }, [session_id]);

  useEffect(() => {
    // Poll reactions and append them to the array every second
    const pollInterval = setInterval(pollReactions, 1000);

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(pollInterval);
  }, [session_id]);

  // Calculate the count of each reaction
  const reactionCounts = [0, 0, 0];
  reactions.forEach((reaction) => {
    reactionCounts[reaction.reaction - 1]++;
  });

  // Prepare data for the time vs reaction graphs
  const timeLabels = reactions.map((reaction) => reaction.timeStamp);
  const reactionData = [[], [], []];
  reactions.forEach((reaction) => {
    reactionData[reaction.reaction - 1].push(reaction.timeStamp);
  });

  // Create the data for Bar chart (Count of each reaction)
  const barChartData = {
    labels: ['Hand-Raise', ' Confused', 'Interesting'],
    datasets: [
      {
        label: 'Count of Reactions',
        data: reactionCounts,
        backgroundColor: ['#3498db', '#e74c3c', '#f1c40f'],
      },
    ],
  };
  const options = {
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: false,
      },
      customCanvasBackgroundColor: {
        color: 'lightGreen',
      },
    },

    scales: {
      y: {
        ticks: {
          color: 'white',
        },
        grid: {
          display: false,
        },
      },
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          display: false,
        },
      },
    },
  };
  // Create the data for Line chart (Time vs Reaction for last 10 minutes)
  const lineChartDataLast10Minutes = {
    labels: timeLabels.slice(-10), // Last 10 timestamps
    datasets: [
      {
        label: 'Reaction 1',
        data: reactionData[0].slice(-10),
        borderColor: '#3498db',
        fill: false,
      },
      {
        label: 'Reaction 2',
        data: reactionData[1].slice(-10),
        borderColor: '#e74c3',
        fill: false,
      },
      {
        label: 'Reaction 3',
        data: reactionData[2].slice(-10),
        borderColor: '#f1c40f',
        fill: false,
      },
    ],
  };

  return (
    <div className="reactions-page">
      <div className="header">
        <Header session_id={session_id} />
      </div>

      <div className="inputpage-background">
        <div className="reactions">
          <div class="reactions-title">
            <BsSmartwatch className="watch"></BsSmartwatch>
            <strong>Reaction Log</strong>
            <p className="reactions-subtitle">Instructor's Apple Watch</p>
          </div>

          <div className="reactions-content">
            <ul>
              {reactions
                .slice()
                .reverse()
                .map((reaction, index) => (
                  <div>
                    <li key={index}>
                      <div className="pair">
                        {iconMapping[reaction.reaction]}
                        {wordMapping[reaction.reaction]}
                      </div>
                      <div className="pair">
                        <div> {formatTime(reaction.timeStamp)}</div>
                        <div className="timeago">
                          {' '}
                          {formatTimeAgo(reaction.timeStamp)}
                        </div>
                      </div>
                    </li>
                    {index !== reactions.length - 1 && <hr></hr>}{' '}
                  </div>
                ))}
            </ul>
          </div>
        </div>

        <div className="bar">
          <Bar data={barChartData} options={options} width={300} height={300} />
        </div>
      </div>
    </div>
  );
};
export default ReactionsPage;
