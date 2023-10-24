import React, { useState, useEffect } from 'react';
import './ReactionsPage.css'; // Add CSS styling for this page
import { useParams } from 'react-router-dom';
import Header from './Header';
import { FaHandPaper, FaQuestionCircle, FaLightbulb } from 'react-icons/fa';
import { BsSmartwatch } from 'react-icons/bs';
import { Bar, Pie, Line } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const iconMapping = {
  1: <FaHandPaper />,
  2: <FaQuestionCircle />,
  3: <FaLightbulb />,
};

const wordMapping = {
  1: 'Hand-raise',
  2: 'Confused',
  3: 'Interesting',
};

const ReactionsPage = (props) => {
  const { session_id } = useParams();
  const [reactions, setReactions] = useState([]); // Initialize reactions as an empty array
  const [timeElapsed, setTimeElapsed] = useState(null);
  const [firstReactionDate, setFirstReactionDate] = useState(null);

  //////////////////////////////////////////////////////////////////////
  // Date time functions
  //////////////////////////////////////////////////////////////////////

  function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  }

  function formatTimeElapsed(seconds) {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const remainingSeconds = String(Math.floor(seconds % 60)).padStart(2, '0');
    console.log(remainingSeconds);

    return `${hours}:${minutes}:${remainingSeconds}`;
  }

  useEffect(() => {
    if (reactions.length > 0) {
      const then = new Date(reactions[0].timeStamp);
      then.setHours(then.getHours() - 4);
      then.setSeconds(then.getSeconds() - 12);
      const timeDiff = Date.now() - then;
      setFirstReactionDate(formatDate(then));
      setTimeElapsed(formatTimeElapsed(timeDiff / 1000));
    } else {
    }
  }, [reactions]);

  const formatTime = (timestamp) => {
    const reactionTime = new Date(timestamp);
    reactionTime.setHours(reactionTime.getHours() - 4);
    reactionTime.setSeconds(reactionTime.getSeconds() - 12);

    const hours = reactionTime.getHours().toString().padStart(2, '0');
    const minutes = reactionTime.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatTimeAgo = (timestamp) => {
    const then = new Date(timestamp);
    then.setHours(then.getHours() - 4);
    then.setSeconds(then.getSeconds() - 12);

    const timeDiff = Date.now() - then;
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

  //////////////////////////////////////////////////////////////////////
  // fetching data
  //////////////////////////////////////////////////////////////////////

  const fetchSessionData = async () => {
    try {
      const response = await fetch(
        `${props.serverurl}/get-session-data/${session_id}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching session data:', error);
      return null;
    }
  };

  const pollReactions = async () => {
    const sessionData = await fetchSessionData();
    if (
      sessionData &&
      sessionData.status === 'success' &&
      sessionData.data.reactions
    ) {
      setReactions(sessionData.data.reactions);
    }
  };

  useEffect(() => {
    fetchSessionData().then((data) => {
      if (data) {
        setReactions(data.data.reactions);
      }
    });
  }, [session_id]);

  useEffect(() => {
    // Poll reactions and update the reactions array every second
    const pollInterval = setInterval(pollReactions, 1000);

    return () => clearInterval(pollInterval);
  }, [session_id]);

  //////////////////////////////////////////////////////////////////////
  // Create the data for Pie Chart (Count of each reation per user)
  //////////////////////////////////////////////////////////////////////

  const userReactionsMap = new Map();

  reactions.forEach((reaction) => {
    const userSessionId = reaction.userSessionId;

    // Check if the userSessionId is already in the map
    if (userReactionsMap.has(userSessionId)) {
      userReactionsMap.set(
        userSessionId,
        userReactionsMap.get(userSessionId) + 1
      );
    } else {
      // If not, initialize the count to 1
      userReactionsMap.set(userSessionId, 1);
    }
  });

  const pieChartData = {
    labels: Array.from(userReactionsMap.keys()).map(
      (userSessionId) => userSessionId
    ),
    datasets: [
      {
        data: Array.from(userReactionsMap.values()),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7',
          // Add more colors as needed
        ],
        borderWidth: 1,
      },
    ],
  };

  // Customize the pie chart options
  const pieChartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  //////////////////////////////////////////////////////////////////////
  // Create the data for Bar chart (Count of each reaction)
  //////////////////////////////////////////////////////////////////////

  const reactionCounts = [0, 0, 0];
  reactions.forEach((reaction) => {
    reactionCounts[reaction.reaction - 1]++;
  });

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
    maintainAspectRatio: false,
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

  //////////////////////////////////////////////////////////////////////
  // Create the data for Line chart (Time vs Reaction for last 10 minutes)
  //////////////////////////////////////////////////////////////////////

  // Function to generate time labels in "X min ago" format for the last ten minutes
  const generateTimeLabels = (minutesAgo) => {
    const labels = [];
    for (let i = 0; i < 10; i++) {
      labels.push(`${i * minutesAgo} min ago`);
    }
    return labels.reverse();
  };

  const reactionData = [[], [], []];
  reactions.forEach((reaction) => {
    reactionData[reaction.reaction - 1].push(reaction.timeStamp);
  });

  // Calculate the number of reactions per minute for the last ten minutes
  const reactionsPerMinute = Array(10).fill(0);
  reactionData[0].forEach((timestamp) => {
    const then = new Date(timestamp);
    then.setHours(then.getHours() - 4);
    then.setSeconds(then.getSeconds() - 12);
    const timeDiff = Date.now() - then;
    const minutesAgo = Math.floor(timeDiff / (1000 * 60));
    if (minutesAgo >= 0 && minutesAgo < 10) {
      reactionsPerMinute[9 - minutesAgo]++;
    }
  });

  // Create the Line chart data and options
  const lineChartDataLast10Minutes = {
    labels: generateTimeLabels(1), // Generate labels in "X min ago" format
    datasets: [
      {
        label: 'Reaction 1',
        data: reactionsPerMinute,
        borderColor: '#3498db',
        fill: false,
      },
      {
        label: 'Reaction 2',
        data: reactionsPerMinute, // Use the same data for all reactions
        borderColor: '#e74c3c',
        fill: false,
      },
      {
        label: 'Reaction 3',
        data: reactionsPerMinute, // Use the same data for all reactions
        borderColor: '#f1c40f',
        fill: false,
      },
    ],
  };

  const lineChartOptions = {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false,
      },
      legend: {
        position: 'top',
      },
    },
  };

  //////////////////////////////////////////////////////////////////////
  // return
  //////////////////////////////////////////////////////////////////////

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
        <div className="vl"></div>
        <div></div>
        <div className="graphs-canvas">
          <div className="graphs-title">Session Analytics</div>
          <div className="graphs-subtitle">
            <div>Time Elapsed : {timeElapsed}</div>

            <div>Date: {firstReactionDate}</div>
          </div>
          <hr className="hl"></hr>
          <div className="divider">
            <div className="mainchart">
              <div className="today">
                Today, students gave a total of {reactions.length} reactions
              </div>
              <div className="lineholder">
                {' '}
                <Line
                  data={lineChartDataLast10Minutes}
                  options={lineChartOptions}
                />
              </div>
            </div>

            <div className="minichart-holder">
              <div className="vl"></div>
              <div className="minichart">
                <div className="minichart-title">Cumulative Statistics</div>
                <div className="barholder">
                  <div className="bar">
                    <div className="bar-title">
                      <strong>Reaction Distribution</strong>
                    </div>
                    <Bar data={barChartData} options={options} />
                  </div>
                </div>
                <div className="pieholder">
                  <div className="bar">
                    <div className="bar-title">
                      <strong>Unique Users</strong>
                    </div>
                    <Pie data={pieChartData} options={pieChartOptions} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReactionsPage;
