import React from 'react';

const Resources = () => {
  const meditationLinks = [
    {
      title: '5-Minute Mindfulness Meditation',
      url: 'https://www.youtube.com/embed/inpok4MKVLM',
    },
    {
      title: 'Relaxing Body Scan Meditation',
      url: 'https://www.youtube.com/embed/dEzbdLn2bJc',
    },
  ];

  const selfCareTips = [
    'Take a 10-minute walk outdoors.',
    'Practice deep breathing for 5 minutes.',
    'Write in a gratitude journal.',
    'Disconnect from social media for 1 hour.',
    'Drink a full glass of water mindfully.',
  ];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Mental Health Resources</h2>

      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">🎧 Guided Meditations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meditationLinks.map((link, idx) => (
            <div key={idx} className="border p-4 rounded shadow">
              <h4 className="font-semibold mb-2">{link.title}</h4>
              <iframe
                width="100%"
                height="200"
                src={link.url}
                title={link.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-2">💡 Self-care Tips</h3>
        <ul className="list-disc ml-6">
          {selfCareTips.map((tip, idx) => (
            <li key={idx} className="mb-1">{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Resources;
