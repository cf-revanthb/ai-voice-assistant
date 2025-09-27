// Debug utility to check environment variables
export const debugEnvironmentVariables = () => {
  console.log('=== Environment Variables Debug ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('REACT_APP_SAMBANOVA_API_KEY:', process.env.REACT_APP_SAMBANOVA_API_KEY ? 'Set' : 'Not set');
  console.log('REACT_APP_HUME_API_KEY:', process.env.REACT_APP_HUME_API_KEY ? 'Set' : 'Not set');
  console.log('REACT_APP_HUME_SECRET_KEY:', process.env.REACT_APP_HUME_SECRET_KEY ? 'Set' : 'Not set');
  console.log('REACT_APP_SAMBANOVA_MODEL:', process.env.REACT_APP_SAMBANOVA_MODEL || 'Not set');
  console.log('REACT_APP_USE_HUME_TTS:', process.env.REACT_APP_USE_HUME_TTS || 'Not set');
  console.log('All REACT_APP_ variables:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));
  console.log('===================================');
};
