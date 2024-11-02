const { ArifzynAPI } = require("../dist/cjs"); // Corrected path to the compiled module

const api = new ArifzynAPI(); // Ensure you provide the actual API key

(async () => { 
  try {
    /*
    const animeDiffResponse = await api.call('/ai/animediff', { prompt: 'cute, long hair' });
    */
    const res = await api.listFeatures("ai")
    console.log('Response from API:', res); 
  } catch (error) {
    console.error('Error occurred while calling the API:', error);
  }
})(); 