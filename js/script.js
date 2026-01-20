// need to import jquery
// Source: https://gist.github.com/alechko/5755089

// using the intersection observer to detect which section is in view, depending on how much portion of the section is visible
// this will be indicated by a change in the button on the nav bar that corresponds to the section in view

// wrap it in a function that will be executed only after the DOM is fully loaded
// if <script src=...></script> is put at the end of the html doc, then this wrapper function is not necessary.

function init() {
    // Get all sections and nav items

    const sections = document.querySelectorAll('section');
    console.log(sections);
    const navItems = document.querySelectorAll('.nav-item');
    console.log(navItems);

    // Set data-index attributes dynamically
    sections.forEach((section, index) => {
        section.dataset.index = index;
        navItems[index].dataset.index = index;
    });

    // Intersection Observer options
    const options = {
        threshold: 0.5  // Trigger when 50% of the element is in view
    };

    // Intersection Observer callback
    const callback = (entries) => {
        entries.forEach(entry => {
            console.log(entry);
            if (entry.isIntersecting) {
                console.log(entry.isIntersecting);
                // Remove 'active' class from all nav-items
                document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

                // Find the corresponding nav-item using data-index and add 'active' class
                const index = entry.target.dataset.index;
                console.log(entry.target);
                console.log(index);
                const navItem = document.querySelector(`.nav-item[data-index="${index}"]`);
                console.log(navItem);
                if (navItem) {
                    navItem.classList.add('active');
                    console.log(navItem);
                }
            }
        });
    };

    // Create Intersection Observer instance
    const observer = new IntersectionObserver(callback, options);

    // Observe all sections
    // "children" might not be a good variable name
    //const children = document.querySelectorAll('.container-scroll > *');
    // the above line will make IntersectionObserver monitor ALL direct children of the container-scroll class
    // but that is not what we want, because there are children we do not want to be monitored
    // so we use pseudo-class :not() instead of `*` to exclude these children
    const children = document.querySelectorAll('.container-scroll > :not(.header-mini)');
    // this does not work, because it returns an HTML collection, not a NodeList!
    // const children = document.querySelector('.container-scroll').children; 

    children.forEach(section => {
        observer.observe(section);
    });

    // Function to change the property of a CSS class
    function changeCSSProperty(className, property, value, important) {
        // Loop through all the stylesheets
        for (let i = 0; i < document.styleSheets.length; i++) {
            let sheet = document.styleSheets[i];
            try {
                // Loop through all the rules in the stylesheet
                for (let j = 0; j < sheet.cssRules.length; j++) {
                    let rule = sheet.cssRules[j];
                    // Check if the rule is the one we want to change
                    if (rule.selectorText === className) {
                        if (important) {
                            // Change the property with !important
                            rule.style.setProperty(property, value, 'important');
                        } else {
                            // Change the property without !important
                            rule.style.setProperty(property, value);
                        }
                        break;
                    }
                }
            } catch (e) {
                if (e.name !== 'SecurityError') {
                    throw e; // Rethrow if it's not a security error
                }
                // Otherwise, continue with the next stylesheet
                continue; // Skip to the next stylesheet
            }
        }
    }
    // Call the function to change the color property of .example-class to red
    // changeCSSProperty('.example-class', 'color', 'red');

    //-----controlling when header-mini appears----//
    const header = document.querySelector('header');
    const headerContent = header.innerHTML;
    const headerMini = document.querySelector('.header-mini');

    // Intersection Observer options for header
    const headerOptions = {
        threshold: 0.1
    };

    // Intersection Observer callback for header
    const headerCallback = (entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                // if (entry.intersectionRatio <= 0.1) {
                // Switch 'header-mini' class to display: block when header is fully out of view
                // add original header content into this header-mini class
                // headerMini.style.display = "block";
                changeCSSProperty('.header-mini', 'display', 'block'); // this might not be necessary
                changeCSSProperty('.header-mini.grid-container', 'display', 'grid', true);
                headerMini.classList.add('is-visible');
                headerMini.innerHTML = headerContent;

            } else {
                // } else if (entry.intersectionRatio > 0.1) {
                // Switch 'header-mini' class to display: none when header is in view
                // This does not work, because right now .header-mini.grid-container display: grid is flagged with !important. So editing the stylesheet directly from js is much more flexible.
                // headerMini.style.display = "none";
                // changing the stylesheet directly with js allows for finer control than changing the html
                changeCSSProperty('.header-mini', 'display', 'none'); // this might not be necessary
                changeCSSProperty('.header-mini.grid-container', 'display', 'none');
                headerMini.classList.remove('is-visible');
            }
        });
    };

    // Create Intersection Observer instance for header
    const headerObserver = new IntersectionObserver(headerCallback, headerOptions);

    // Observe the header
    headerObserver.observe(header);

    // activate only when screen width falls below 768px 
    // if ($(window).width() < 768) { 
    // }
    // TO-DO: wrap the above code in a media query, so as to implement a different desktop layout and behavior
    // e.g., disable header-mini on desktop view, and left-dock header-full (always in view), and sections on its right scroll up and down to view.
	
	const user = "quangduc.pham";
	const domain = "cunef.edu";
	const email = `${user}@${domain}`;

	const el = document.getElementById("thudientu");
	if (el) {
	  el.innerHTML = `<a href="mailto:${email}">${email}</a>`;
	}
}



// Add event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', init);