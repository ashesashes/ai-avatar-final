import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image'; 

//import buildspaceLogo from '../assets/logo.png';

const Home = () => {
  const maxRetries = 20;
  const [input, setInput] = useState('');
  const [img, setImg] = useState('');
  //Number of retries
  const [retry, setRetry] = useState(0);
  //Num of retries left 
  const [retryCount, setRetryCount] = useState(maxRetries);
  const [isGenerating, setIsGenerating] = useState(false);
  const [finalPrompt, setFinalPrompt] = useState(''); 
  const onChange = (event) => {
    setInput(event.target.value);
  };
  
  const generateAction = async () => {
    console.log('Generating...');	

    //making sure there is no double click 
    if (isGenerating && retry === 0) return; 

    //setLoading has started
    setIsGenerating(true); 

    //check to see if this is a retry request and if so decrease retryCount
    if (retry > 0) {
      setRetryCount((prevState) => {
        if (prevState === 0) {
          return 0;
        } else {
          return prevState - 1; 
        }
      });
      setRetry(0);
    }

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'image/jpeg',
    },
    body: JSON.stringify({input}),
  });

  const data = await response.json();

  // if the model is still loading, drop the retry time
  if (response.status == 503) {
    //console.log('Model is still loading'); 

    //Set estimated time property in state
    setRetry(data.estimated_time);
    return;
  }

  //log other errors
  if (!response.ok) {
    console.log(`Error: ${data.error}`);
    //Stop loading
    setIsGenerating(false); 
    return;
  }
  setImg(data.image); 


  //set final prompt
  setFinalPrompt(input);
  //remove content from the input box
  setInput(''); 
  setImg(data.image);
  //stop loading
  setIsGenerating(false); 

  };

  const sleep = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  useEffect(() => {
    const runRetry = async () => {
      if (retryCount === 0) {
        console.log(`Model still loading after ${maxRetries} retries. Try request again in 5 minutes.`);
        setRetryCount(maxRetries);
        return;
        }

      console.log(`Trying again in ${retry} seconds.`);

      await sleep(retry * 1000);

      await generateAction();
    };

    if (retry === 0) {
      return;
    }

    runRetry();
  }, [retry]);
  
  return (
<div className="root">
  <Head>
    <title> Jungkook Magic Mirror Portraits</title>
  </Head>
  <div className = "container">
    <div className="header">
      <div className="header-title">
        <h1>Jungkook Fan Art 🖼</h1>
      </div>
      <div className="header-subtitle">
        <h2>
          Re-imagine Jungkook as a pirate, cyberpunk, or anything!
        </h2>
      </div>
      <div className="prompt-container">
      <input className="prompt-box" placeholder="example: anime portrait of jungkook arty vibes greyscale pink tint" value={input} onChange={onChange} />
        <div className="prompt-buttons">
          <a 
          className={
              isGenerating ? 'generate-button loading' : 'generate-button'
          } 
          onClick={generateAction}
          >
          {/* added a loading indicator here */}
      <div className="generate">
        {isGenerating ? (
          <span className="loader"></span>
        ) : (
          <p>Generate</p>
        )}
       </div>
          </a>
      </div>
    </div>
    </div>
  </div>
  {img && 
    <div className="output-content">
      <Image src={img} width={512} height={512} alt={finalPrompt} />
      <p>{finalPrompt}</p>
    </div>
  }
</div>
  );
};

export default Home; 