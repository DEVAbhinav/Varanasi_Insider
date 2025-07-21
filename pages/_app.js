// /pages/_app.js

// 1. Import your global stylesheet
import '../styles/globals.css';

// 2. Import any component CSS that needs to be global (if any)
// For example, if you decide one component's styles must be global.
// import '../components/SomeComponent/SomeComponent.module.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
