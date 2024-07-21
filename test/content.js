// Function to add a button next to each profile
function addButtonToProfiles() {
  const articleTags = document.querySelectorAll('article') ?? [];
  
  articleTags.forEach(article => {
    // Select all anchor tags on the page
    const anchorTags = article.querySelectorAll('a');

    // Filter the anchor tags based on the exact href pattern
    const matchingAnchorTags = Array.from(anchorTags).filter(anchor => {
      const href = anchor.getAttribute('href');
      return href && /^\/[^\/]+\/\?hl=en$/.test(href);
    });

    let neededAnchor = null

    if(matchingAnchorTags.length > 2){
      neededAnchor = matchingAnchorTags[1]
    } else if(matchingAnchorTags.length <= 2){
      neededAnchor = matchingAnchorTags[0]
    }

    if(!(neededAnchor ?? false)){
      return
    }

    if (!neededAnchor.parentElement.querySelector('.scrape-button')) {
      const button = document.createElement('button');
      button.innerText = 'Add to my List & Like';
      button.className = 'scrape-button';
      button.style.marginLeft = '10px';
      button.onclick = () => scrapeProfile(neededAnchor.getAttribute('href'));

      neededAnchor.parentElement.appendChild(button);
    }
    
  });
  
  return

  }
  
  // Function to handle button click and send profile data to the backend
  function scrapeProfile(profileUrl) {
    console.log(profileUrl)
    return
    const profileData = { url: profileUrl };
  
    chrome.runtime.sendMessage({
      action: 'scrapeProfile',
      data: profileData
    }, response => {
      console.log('Profile data sent to backend:', response);
    });
  }
  
  // Function to observe DOM changes and add buttons dynamically
  function observeDOMChanges() {
    const observer = new MutationObserver(addButtonToProfiles);
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // Run the initial function to add buttons
  addButtonToProfiles();
  
  // Start observing DOM changes
  observeDOMChanges();
  