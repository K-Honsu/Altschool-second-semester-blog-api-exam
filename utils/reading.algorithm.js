const countWords = (text) => {
    const words = text.split(/\s+/);
    return words.length;
}

// Function to calculate reading time
const calculateReadingTime = (wordCount, readingSpeed) => {
    const minutes = wordCount / readingSpeed;
    return Math.ceil(minutes); // Round up to the nearest minute
}

module.exports = { countWords, calculateReadingTime };
