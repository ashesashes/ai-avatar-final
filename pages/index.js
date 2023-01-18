import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import Head from 'next/head';
import Image from 'next/image'; 
import ReactGA from 'react-ga'; 


//import buildspaceLogo from '../assets/logo.png';

const TRACKING_ID = "G-HCYNLDX2FS"; // GOOGLE_TRACKING_ID
ReactGA.initialize(TRACKING_ID);



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
  const [promptArray, setPromptArray] = useState([
    "ink sketch of jungkook highly detailed beautiful realistic ",
    "Jungkook as pixar character, baseball player, photorealistic, hdr, symmetrical face, 4k, 8k",
    "Charcoal sketch of jungkook",
    "Jungkook as a 'pirate, astronaut, dragon', cartoonish, hdr, symmetrical face, 4k, 8k",
    "Jungkook as a 'warrior', photorealistic, hdr, symmetrical face, 4k, 8k",
    "Jungkook as samurai master, character art portrait, anime key visual, strong face, 8 k wallpaper, very high detailed, sharp focus, morandi color scheme, art station, by krenz cushart beautiful eyes no deformities  photorealistic uhd 8K",
    "portrait of Jungkook as Batman cyberpunk sharp details,sharp focus,elegant,highly detailed,illustration,by jordan grimmer and greg rutkowski and pine ( ハイネ ) wlop,intricate,beautiful,trending artstation,pixiv,digital art",
    "Jungkook as a mecha pilot, in the style of Chriss Foss, Darrell K. Sweet and Michael Whelanberserk, singleface, cinematic lighting, cinematic shot + photos taken by ARRI, photos taken by sony, photos taken by canon, photos taken by nikon, photos taken by sony, photos taken by hasselblad + incredibly detailed, sharpen, details + professional lighting, photography lighting + 50mm, 80mm, 100m + lightroom gallery + behance photographys + unsplash",
    "jungkook in peaky blinders style of john singer sargeant, rembrandt",
    "Jungkook in the style of stained glass cathedral, alphonse much, James jean, Erin Hanson, hyper detailed, backlit, vibrant",
    "Anime key visual of jungkook as a man wearing white shirt and red tie, intricate, magical forest, stunning, highly detailed, digital painting, artstation, smooth, hard focus, illustration, predator movie, prey movie 2 0 2 2, art by artgerm and greg rutkowski and alphonse mucha uhd 8K ",
    "highly detailed, digital painting of jungkook, artstation, concept art, sharp focus, illustration, cinematic lighting, art by artgerm and greg rutkowski and alphonse mucha | asymmetrical, ugly, deformed, disfigured, cartoon",
    "Portrait art of jungkook as a samurai,detailed,intricate,full of colour,cinematic lighting,4k,focused,extreme details,cinematic,masterpiece | ugly, deformed, too many hands, extra limbs, disfigured, asymmetrical",
    "jungkook portrait with classical floral elements emanating from center of face,woodcutting template,decorative design,classical ornament,motif, bilateral symmetry,roses,leaves,flowers,buds,flowering buds,feathers,negative space,highly detailed etching",
    "Stylish haute couture outfit worn by jungkook in the style of 90's vintage anime,surrealism,akira style. detailed line art. fine details. inside a 7/11 in tokyo | grid of images, multiple people", 
    "jungkook at a tea party by thomas kinkade, trending on artstation 8K",
    "Jungkook is a hacker programming at a computer in a room full of gadgets,by makoto shinkai and ghibli studio,outlined silhouettes,dramatic lighting,highly detailed,incredible quality,trending on artstation",
    "Portrait of jungkook as Thor, muscular, fantasy, intricate, elegant, highly detailed, digital painting, art station, concept art, smooth, sharp focus, illustration, art by art germ and greg rutkowski and alphonse mucha",
    "Anime portrait of jungkook arty vibes, greyscale, purple tint",
    "anime concept art of jungkook musdcular beautiful wow vibes"
  ]);
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

  //Add random prompt function
  const randomPrompt = () => {
    const randomNumber = Math.floor(Math.random() * (promptArray.length));
    setInput(promptArray[randomNumber]);
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
  <Script
        src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
        strategy="afterInteractive"
      />
  <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config','G-HCYNLDX2FS');
        `}
    </Script>
  <div className = "container">
    <div className="header">
      <div className="header-title">
        <h1>Jungkook Fan Art 🖼</h1>
      </div>
      <div className="header-subtitle">
        <h2>
          Make Jungkook fanart in 1 click - describe what you want to see
        </h2>
      </div>
      <div className="text">
            <a className="random-prompt" onClick={randomPrompt}>
                       {isGenerating ? (
                                <span></span>
                            ) : ( 
                              <h5> 🔮 tap for a random inspiration </h5>
                              )}
              </a>
          </div>
      <div className="prompt-container">
      <input className="prompt-box" placeholder="for example: anime portrait of jungkook arty vibes greyscale pink tint" value={input} onChange={onChange} />
      <span class="info-text"><h5>The first picture takes between 1-3 mins to load</h5></span>
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
          <span className="loader">  
          </span>
        ) : (
          <p>Generate</p>
        )}
       </div>
          </a>
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
  
</div>
  );
};

export default Home; 