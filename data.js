const learningDataBinary = atob(window.LEARNING_DATA_B64 || "");
const learningDataBytes = Uint8Array.from(learningDataBinary, (character) => character.charCodeAt(0));
window.LEARNING_DATA = JSON.parse(new TextDecoder().decode(learningDataBytes));
