import React, { useState } from "react";
import "../styles/Starter.css";

const Starter = ({ startersSelected }) => {
  console.log("startersSelected:", startersSelected); // Debugging to see what is passed

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);

  // Word arrays
  const singleNouns = [
    "cat",
    "dog",
    "sun",
    "car",
    "tree",
    "bird",
    "ball",
    "hat",
    "book",
    "fish",
  ];
  const pluralNouns = [
    "cats",
    "dogs",
    "trees",
    "cars",
    "books",
    "birds",
    "apples",
    "stars",
    "toys",
    "hats",
  ];
  const adjectives = [
    "big",
    "small",
    "happy",
    "sad",
    "fast",
    "slow",
    "hot",
    "cold",
    "red",
    "blue",
  ];
  const verbs = [
    "run",
    "jump",
    "play",
    "sing",
    "read",
    "eat",
    "swim",
    "walk",
    "sleep",
    "dance",
  ];
  const nounPlaces = [
    "park",
    "home",
    "school",
    "store",
    "beach",
    "zoo",
    "farm",
    "city",
    "house",
    "yard",
  ];
  const bodyParts = [
    "hand",
    "foot",
    "head",
    "arm",
    "leg",
    "ear",
    "nose",
    "eye",
    "mouth",
    "knee",
  ];
  const pluralNounPlaces = [
    "parks",
    "homes",
    "schools",
    "stores",
    "beaches",
    "farms",
    "cities",
    "rooms",
    "houses",
    "shops",
  ];
  const gamesSports = [
    "tag",
    "soccer",
    "hopscotch",
    "hide-and-seek",
    "catch",
    "jump rope",
    "baseball",
    "basketball",
    "duck-duck-goose",
    "tennis",
  ];
  const objects = [
    "toy",
    "ball",
    "book",
    "doll",
    "block",
    "chair",
    "bike",
    "pencil",
    "cup",
    "bag",
  ];

  // Function to generate a random word from the correct array based on partnerType
  const getRandomWord = (partnerType) => {
    switch (partnerType) {
      case "single noun":
        return singleNouns[Math.floor(Math.random() * singleNouns.length)];
      case "plural noun":
        return pluralNouns[Math.floor(Math.random() * pluralNouns.length)];
      case "adjective":
        return adjectives[Math.floor(Math.random() * adjectives.length)];
      case "verb":
        return verbs[Math.floor(Math.random() * verbs.length)];
      case "noun/place":
        return nounPlaces[Math.floor(Math.random() * nounPlaces.length)];
      case "body part":
        return bodyParts[Math.floor(Math.random() * bodyParts.length)];
      case "plural noun/places":
        return pluralNounPlaces[
          Math.floor(Math.random() * pluralNounPlaces.length)
        ];
      case "game/sport":
        return gamesSports[Math.floor(Math.random() * gamesSports.length)];
      case "object":
        return objects[Math.floor(Math.random() * objects.length)];
      default:
        return "";
    }
  };

  // Function to generate sentences based on startersSelected
  const generateSentences = () => {
    if (!startersSelected || typeof startersSelected !== "object") {
      console.log("Invalid startersSelected:", startersSelected); // Debugging
      return ["Something went wrong"]; // Return an empty array if startersSelected is undefined or not an object
    }

    return Object.keys(startersSelected)
      .filter((key) => startersSelected[key]?.isShown) // Only starters that are shown
      .map((key) => {
        const starter = startersSelected[key];
        const randomWord = getRandomWord(starter.partnerType); // Generate random word based on partnerType
        const sentence = `${starter.text} ${randomWord}`; // Combine starter text with the random word
        return sentence; // Return generated sentence
      });
  };

  // Generate sentences
  const sentences = generateSentences();

  // Function to handle the onClick event for the sentence cards
  const handleCardClick = (index) => {
    setSelectedCardIndex(index);
    setIsModalOpen(true);
  };

  // Function to handle the confirmation in the custom dialog
  const handleConfirm = () => {
    const card = document.getElementById(`sentence-card-${selectedCardIndex}`);
    card.style.backgroundColor = "green";
    setIsModalOpen(false);
  };

  // Function to handle the cancellation in the custom dialog
  const handleCancel = () => {
    const card = document.getElementById(`sentence-card-${selectedCardIndex}`);
    card.style.backgroundColor = "lightblue";
    setIsModalOpen(false);
  };

  return (
    <div className="starter-container">
      <h1 className="title">Generated Sentences</h1>
      <div className="sentences-wrapper">
        {sentences.map((sentence, index) => (
          <div
            id={`sentence-card-${index}`}
            className="sentence-card"
            key={index}
            onClick={() => handleCardClick(index)}
          >
            <p className="sentence-text">{sentence}</p>
          </div>
        ))}
      </div>

      {/* Custom Modal Dialog */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title">Could your learner read this?</h2>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={handleConfirm}>
                Yes
              </button>
              <button className="cancel-button" onClick={handleCancel}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Starter;
