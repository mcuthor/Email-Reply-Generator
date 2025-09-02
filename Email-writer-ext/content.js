console.log("Content script loaded");
function creatAIbutton() {
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3 ai-reply-button'; // Gmail button classes
    button.style.margin =  '8px';
    button.innerHTML = 'AI Reply';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');
  return button;

}

function getEmailContent() {
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]'
    ];
    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            return content.innerText.trim();
        }
        return '';
    }
}
function findComposeToolbar() {
    const selector = [
        '.btC', // Gmail new compose toolbar
        '.aDh', // Gmail old compose toolbar
        '[role="toolbar"]' , 
        '.gU.Up'
    ];

    for(const sel of selector){
        const toolbar = document.querySelector(sel);
        if(toolbar) return toolbar;
    }
    return null;

}

function injectButton() {
    const existingButton = document.querySelector('.ai-reply-button'); // Gmail compose toolbar classes
    if(existingButton) existingButton.remove(); // Remove existing button if any
    const toolbar = findComposeToolbar();
    if(!toolbar){
        console.log("Compose toolbar not found");
        return;

    }
    console.log("Compose toolbar found, Creating AI button");
    const button = creatAIbutton();
    button.classList.add('ai-reply-button');

    button.addEventListener('click', async () => {
        try {
            button.innerHTML = 'Generating...';
            button.disabled = 'true';
            const emailContent = getEmailContent();
          const response  =   await fetch('http://localhost:8080/api/email/generate',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                     emailContent : emailContent,
                     tone : 'Professional'

                 })
            });
        if(!response.ok) 
            {throw new Error("Network response was not ok");
            }
              const generatedReply = await response.text();
            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');

            if (composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);
            } else {
                console.error('Compose box was not found');
            }

        }catch(error)
        {    console.error(error)
            alert('Failed to generate AI reply:', error);

        }  finally{
            button.innerHTML = 'AI Reply';
            button.disabled = false;
        }
        
    });
    toolbar.insertBefore(button, toolbar.firstChild);
}
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
       const addedNodes  = Array.from(mutation.addedNodes);
       const hasComposeElement = addedNodes.some(node => 
           node.nodeType === Node.ELEMENT_NODE && 
           (node.matches('.aDh,.btC,[role="dialog"]') || node.querySelector('.aDh,.btC,[role="dialog"]'))
       );
       if (hasComposeElement) {
           console.log("Compose window detected");
           // Perform actions when compose window is detected
           setTimeout(injectButton, 500); // Delay to ensure elements are loaded
       }
    }
}); 

     observer.observe(document.body, {
     childList: true, 
     subtree: true 
    });