import React, { useState } from "react";
import "../styles/Writer.css";

const Writer = () => {
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Array of topics and subtopics for first-grade students
  const topics = [
    {
      topic: "My Favorite Animal",
      subtopics: [
        "What does it look like?",
        "What does it eat?",
        "Why do I like it?",
      ],
    },
    {
      topic: "A Day At The Park",
      subtopics: [
        "Who was with me?",
        "What did I eat?",
        "What was my favorite part?",
      ],
    },
    {
      topic: "What I Like To Eat",
      subtopics: [
        "What is my favorite food?",
        "Who makes it for me?",
        "When do I eat it?",
      ],
    },
    {
      topic: "My Family",
      subtopics: [
        "Who is in my family?",
        "What do we do together?",
        "Where do we live?",
      ],
    },
    {
      topic: "A Fun Game To Play",
      subtopics: [
        "What are the rules?",
        "What do I like about it?",
        "Who do I play it with?",
      ],
    },
    {
      topic: "My Best Friend",
      subtopics: [
        "What is their name?",
        "How did we meet?",
        "What do we do together?",
      ],
    },
    {
      topic: "A Rainy Day",
      subtopics: [
        "What happens when it rains?",
        "How does it make me feel?",
        "What do I do on a rainy day?",
      ],
    },
    {
      topic: "The Color I Like Most",
      subtopics: [
        "What is my favorite color?",
        "What things are this color?",
        "Why do I like this color?",
      ],
    },
    {
      topic: "A Place I Want To Visit",
      subtopics: [
        "Where is it?",
        "What can I do there?",
        "Who would I go with?",
      ],
    },
    {
      topic: "My Favorite Toy",
      subtopics: ["What is it?", "What does it do?", "Who gave it to me?"],
    },
  ];

  // Function to handle the onClick event for the topic cards
  const handleCardClick = (index) => {
    setSelectedTopicIndex(index);
    handleConfirm(index);
  };

  // Function to handle the confirmation in the custom dialog
  const handleConfirm = (index = -1) => {
    if (index === -1) {
      const card = document.getElementById(`prompt-card-${selectedTopicIndex}`);
      if (card.style.backgroundColor === "green") {
      }
      card.style.backgroundColor = "green";
    } else {
      const card = document.getElementById(`prompt-card-${index}`);
      card.style.backgroundColor = "green";
    }
    setIsModalOpen(false);
  };

  // Function to handle the cancellation in the custom dialog
  const handleCancel = () => {
    const card = document.getElementById(`prompt-card-${selectedTopicIndex}`);
    card.style.backgroundColor = "lightblue";
    setIsModalOpen(false);
  };

  return (
    <div className="writer-container">
      <h1 className="writer-title noprint">Writing Topics</h1>
      <h3 className="noprint" style={{ color: "black" }}>
        Choose a topic to get started!
      </h3>
      {selectedTopicIndex !== null && (

      <button
        className="noprint homework-button"
        onClick={function () {
          window.print();
        }}
      >
        Print My Homework!
      </button>
      )}
      <div className="prompts-wrapper noprint">
        {topics.map((topicObj, index) => (
          <div
            id={`prompt-card-${index}`}
            className="prompt-card"
            key={index}
            onClick={() => handleCardClick(index)}
          >
            <p className="prompt-text">{topicObj.topic}</p>
          </div>
        ))}
      </div>

      {/* Custom Modal Dialog */}
      {isModalOpen && selectedTopicIndex !== null && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title">
              Could your little one write something?
            </h2>
            <p>Topic: {topics[selectedTopicIndex].topic}</p>
            <p>Subtopics:</p>
            <ul>
              {topics[selectedTopicIndex].subtopics.map((subtopic, index) => (
                <li key={index}>{subtopic}</li>
              ))}
            </ul>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={handleConfirm}>
                They did!
              </button>
              <button className="cancel-button" onClick={handleCancel}>
                Not this time!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Form */}
      {selectedTopicIndex !== null && (
        <div className="printable-form">
          <h2>{topics[selectedTopicIndex].topic}</h2>
          <div className="name-section">
            <h3>Writer's Name:</h3>
            <div className="writing-line">
              <p>
                ________________________________________________________________
              </p>
            </div>
          </div>
          {topics[selectedTopicIndex].subtopics.map((subtopic, index) => (
            <div key={index} className="subtopic-section">
              <h3>{subtopic}</h3>
              <div className="writing-lines">
                <p>
                  ________________________________________________________________
                </p>
                <p>
                  ________________________________________________________________
                </p>
                <p>
                  ________________________________________________________________
                </p>
                <p>
                  ________________________________________________________________
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Writer;
